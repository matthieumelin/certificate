import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { createClient } from "@supabase/supabase-js";
import EmailService from "./emailService.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || "development";
const file = env === "production" ? ".env.production" : ".env.development";

dotenvExpand.expand(
  dotenv.config({
    path: path.join(__dirname, file),
  }),
);

console.log(`🔹 Mode serveur : ${env}`);
console.log(`🔹 Fichier .env chargé : ${file}`);

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const emailService = new EmailService({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  senderEmail: process.env.SENDER_EMAIL || "noreply@example.com",
  allowedDomains: process.env.ALLOWED_EMAIL_DOMAINS?.split(",") || [],
});

if (!process.env.FRONTEND_URL) {
  console.error("FRONTEND_URL manquant dans .env !");
  process.exit(1);
}

app.use(cors({ origin: process.env.FRONTEND_URL }));

const emailRateLimiter = new Map();
const RATE_LIMIT_WINDOW = 60000;
const MAX_EMAILS_PER_WINDOW = 5;

function checkRateLimit(identifier) {
  const now = Date.now();
  const userRequests = emailRateLimiter.get(identifier) || [];

  const recentRequests = userRequests.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW,
  );

  if (recentRequests.length >= MAX_EMAILS_PER_WINDOW) {
    return false;
  }

  recentRequests.push(now);
  emailRateLimiter.set(identifier, recentRequests);
  return true;
}

function generateRandomPin(min = 6, max = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = Math.floor(Math.random() * (max - min + 1)) + min;

  let pin = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    pin += chars[randomIndex];
  }

  return pin.toUpperCase();
}

async function insertObjectPhoto(objectId, path, type) {
  if (!path || !path.length) return;

  const { error } = await supabase.from("object_photos").insert({
    object_id: objectId,
    path,
    type,
  });

  if (error) {
    console.error("Erreur insertion object_photos:", error);
  }
}

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error("Webhook error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const draftId = session.metadata.draft_id;

      if (draftId) {
        console.log(`✅ Paiement confirmé pour draft ${draftId}`);
      }
    }

    res.json({ received: true });
  },
);

app.use(express.json());

app.post("/send-certificate-email", async (req, res) => {
  const { certificateId } = req.body;

  if (!certificateId) {
    return res.status(400).json({ error: "certificateId manquant" });
  }

  try {
    const { data: certificate, error: certError } = await supabase
      .from("certificates")
      .select("id, customer_id, certificate_type_id")
      .eq("id", certificateId)
      .single();

    if (certError || !certificate) {
      return res.status(404).json({ error: "Certificat introuvable" });
    }

    const { data: customer, error: customerError } = await supabase
      .from("profiles")
      .select("email, first_name, last_name")
      .eq("id", certificate.customer_id)
      .single();

    if (customerError || !customer) {
      return res.status(404).json({ error: "Client introuvable" });
    }

    const { data: certType } = await supabase
      .from("certificate_types")
      .select("name")
      .eq("id", certificate.certificate_type_id)
      .single();

    await emailService.sendCertificate({
      to: customer.email,
      customerName: `${customer.first_name} ${customer.last_name}`,
      certificateName: certType?.name || "Certificat",
      certificateDetailsLink: `${process.env.FRONTEND_URL}/certificate/${certificate.id}`,
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Erreur envoi email certificat:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/send-mail", async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res
      .status(400)
      .json({ error: "Paramètres manquants (to, subject, html requis)" });
  }

  const clientIp = req.ip;
  if (!checkRateLimit(clientIp)) {
    return res
      .status(429)
      .json({ error: "Trop de requêtes, réessayez plus tard." });
  }

  try {
    const result = await emailService.sendCustomEmail({ to, subject, html });
    res.json({ success: true, result });
  } catch (error) {
    console.error("Erreur envoi email:", error);
    res.status(500).json({ error: "Erreur envoi email" });
  }
});

app.post("/send-inauthentic-alert", async (req, res) => {
  const {
    certificateId,
    objectModel,
    objectBrand,
    objectReference,
    suspectPoints,
    expertComment,
    imagesUrl,
  } = req.body;

  if (!certificateId) {
    return res.status(400).json({ error: "ID certificat manquant" });
  }

  try {
    const { data: certificate, error: certError } = await supabase
      .from("certificates")
      .select("customer_id, certificate_type_id, id")
      .eq("id", certificateId)
      .single();

    if (certError || !certificate) {
      console.error("Erreur récupération certificat:", certError);
      return res.status(404).json({ error: "Certificat non trouvé" });
    }

    const { data: customer, error: customerError } = await supabase
      .from("profiles")
      .select("email, first_name, last_name")
      .eq("id", certificate.customer_id)
      .single();

    if (customerError || !customer) {
      console.error("Erreur récupération client:", customerError);
      return res.status(404).json({ error: "Client non trouvé" });
    }

    const { data: certType } = await supabase
      .from("certificate_types")
      .select("name")
      .eq("id", certificate.certificate_type_id)
      .single();

    await emailService.sendInauthenticItemAlert({
      to: customer.email,
      customerName: `${customer.first_name} ${customer.last_name}`,
      certificateType: certType?.name || "Certificat",
      certificateDetailsLink:
        `${process.env.FRONTEND_URL}/certificate/${certificateId}` ||
        "",
      objectBrand: objectBrand || "",
      objectModel: objectModel || "",
      objectReference: objectReference || "",
      suspectPoints: suspectPoints || [],
      expertComment: expertComment || "Aucun commentaire fourni.",
    });

    console.log(
      "Alerte inauthentique envoyée pour le certificat:",
      certificateId,
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Erreur envoi alerte inauthentique:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

async function resolveObjectField(value, tableName, supabase) {
  if (!value) {
    return value;
  }

  const { data: existing } = await supabase
    .from(tableName)
    .select("name")
    .eq("name", value)
    .maybeSingle();

  if (existing) {
    return existing.name;
  }

  return value;
}

app.post("/upsert-certificate-draft", async (req, res) => {
  const {
    id,
    customer_data,
    object_type_id,
    object_brand,
    object_model,
    object_reference,
    object_serial_number,
    object_front_photo,
    certificate_type_id,
    partner_id,
    payment_method_id,
    created_by,
  } = req.body;

  if (!id || !created_by) {
    return res.status(400).json({ error: "id ou created_by manquant" });
  }

  try {
    const { data, error } = await supabase
      .from("certificate_drafts")
      .upsert({
        id,
        customer_data,
        object_type_id,
        object_brand,
        object_model,
        object_reference,
        object_serial_number,
        object_front_photo,
        certificate_type_id,
        partner_id,
        payment_method_id,
        created_by,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Draft error:", error);
      return res.status(500).json({ error: "Erreur création draft" });
    }

    return res.json({ success: true, draft: data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/confirm-instore-payment", async (req, res) => {
  const { draftId } = req.body;

  if (!draftId) {
    return res.status(400).json({ error: "draftId manquant" });
  }

  try {
    const { data: draftData, error: draftError } = await supabase
      .from("certificate_drafts")
      .select("*")
      .eq("id", draftId)
      .single();

    if (draftError || !draftData) {
      return res.status(404).json({ error: "Draft non trouvé" });
    }

    const customer = draftData.customer_data;
    if (!customer?.email) {
      return res.status(400).json({ error: "Email client manquant" });
    }

    let { data: userProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", customer.email)
      .maybeSingle();

    let isNewGuestProfile = false;

    if (!userProfile) {
      try {
        let authUserId;
        const { data: authData, error: authError } =
          await supabase.auth.admin.createUser({
            email: customer.email,
            email_confirm: true,
            user_metadata: {
              first_name: customer.first_name,
              last_name: customer.last_name,
            },
          });

        if (authError) {
          if (authError.message.includes("already registered")) {
            console.log("⚠️ Utilisateur Auth existe déjà");
            const { data: existingUsers } =
              await supabase.auth.admin.listUsers();
            const existingUser = existingUsers?.users.find(
              (user) => user.email === customer.email,
            );

            if (!existingUser) {
              return res.status(500).json({
                error: "Impossible de récupérer l'utilisateur Auth",
              });
            }

            authUserId = existingUser.id;
          } else {
            console.error("❌ Erreur Auth:", authError);
            return res.status(500).json({
              error: "Impossible de créer le compte utilisateur",
              details: authError.message,
            });
          }
        } else {
          authUserId = authData.user.id;
          console.log("✅ Compte Auth créé:", authUserId);
        }

        const { data: newProfile, error: profileError } = await supabase
          .from("profiles")
          .upsert(
            {
              id: authUserId,
              email: customer.email,
              first_name: customer.first_name,
              last_name: customer.last_name,
              phone: customer.phone,
              address: customer.address,
              city: customer.city,
              postal_code: customer.postal_code,
              country: customer.country,
              is_guest: true,
            },
            {
              onConflict: "id",
            },
          )
          .select()
          .single();

        if (profileError) {
          console.error("❌ Erreur création profil:", profileError);
          return res.status(500).json({
            error: "Impossible de créer le profil",
            details: profileError.message,
          });
        }

        userProfile = newProfile;
        isNewGuestProfile = !authError;
        console.log("✅ Profil créé/mis à jour:", userProfile.id);
      } catch (error) {
        console.error("❌ Exception création utilisateur:", error);
        return res.status(500).json({
          error: "Erreur serveur lors de la création du compte",
        });
      }
    }

    const { data: object, error: objectError } = await supabase
      .from("objects")
      .insert({
        type_id: draftData.object_type_id,
        model: draftData.object_model,
        brand: draftData.object_brand,
        reference: draftData.object_reference,
        serial_number: draftData.object_serial_number,
        owner_id: userProfile.id,
      })
      .select()
      .single();

    if (objectError) {
      return res.status(500).json({ error: "Erreur création objet" });
    }

    await insertObjectPhoto(
      object.id,
      draftData.object_front_photo[0],
      "front",
    );

    const { data: certificate, error: certError } = await supabase
      .from("certificates")
      .insert({
        id: draftId,
        object_id: object.id,
        created_by: draftData.created_by,
        customer_id: userProfile.id,
        certificate_type_id: draftData.certificate_type_id,
        payment_method_id: draftData.payment_method_id,
        status: "payment_confirmed",
      })
      .select()
      .single();

    if (certError) {
      return res.status(500).json({ error: "Erreur création certificat" });
    }

    await supabase.from("certificate_drafts").delete().eq("id", draftId);

    await emailService.sendCertificate({
      to: customer.email,
      customerName: `${customer.first_name} ${customer.last_name}`,
      certificateName: "Certificat",
      certificateDetailsLink: `${process.env.FRONTEND_URL}/certificate/${certificate.id}`,
    });

    if (isNewGuestProfile) {
      try {
        const { data, error } = await supabase.auth.admin.generateLink({
          type: "magiclink",
          email: customer.email,
          options: {
            redirectTo: `${process.env.FRONTEND_URL}/set-password`,
          },
        });

        if (error) throw error;

        const magicLink = data?.properties?.action_link;
        if (magicLink) {
          await emailService.sendAccountInvitation({
            to: customer.email,
            customerName: `${customer.first_name} ${customer.last_name}`,
            inviteLink: magicLink,
          });
          console.log("📧 Email d'invitation envoyé à:", customer.email);
        }
      } catch (inviteError) {
        console.error("⚠️ Erreur envoi email d'invitation:", inviteError);
      }
    }

    return res.json({ success: true, certificate });
  } catch (error) {
    console.error("❌ Confirm in-store payment error:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/verify-payment", async (req, res) => {
  const { sessionId } = req.body;
  console.log("🔍 Vérification paiement pour session:", sessionId);

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID manquant" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid" || session.status !== "complete") {
      console.log("⚠️ Paiement non confirmé");
      return res.json({ success: false, message: "Paiement non confirmé" });
    }

    const { draft_id, certificate_type, price } = session.metadata;
    if (!draft_id) {
      return res.status(400).json({ error: "Draft ID manquant dans metadata" });
    }

    const { data: draftData, error: draftError } = await supabase
      .from("certificate_drafts")
      .select("*")
      .eq("id", draft_id)
      .single();

    if (draftError || !draftData) {
      console.error("❌ Draft introuvable:", draftError);
      return res.status(404).json({ error: "Draft non trouvé" });
    }

    const customer = draftData.customer_data;
    if (!customer?.email) {
      return res
        .status(400)
        .json({ error: "Email client manquant dans draft" });
    }

    let { data: userProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", customer.email)
      .maybeSingle();

    let isNewGuestProfile = false;

    if (!userProfile) {
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: customer.email,
          email_confirm: true,
          user_metadata: {
            first_name: customer.first_name,
            last_name: customer.last_name,
          },
        });

      if (authError) {
        console.error("❌ Impossible de créer l'utilisateur Auth:", authError);
        return res
          .status(500)
          .json({ error: "Impossible de créer le compte utilisateur" });
      }

      const { data: newProfile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          postal_code: customer.postal_code,
          country: customer.country,
          is_guest: true,
        })
        .select()
        .single();

      if (profileError) {
        console.error("❌ Impossible de créer le profil:", profileError);
        return res.status(500).json({ error: "Impossible de créer le profil" });
      }

      userProfile = newProfile;
      isNewGuestProfile = true;
      console.log("✅ Profil invité créé avec ID Auth:", authData.user.id);
    }

    const objectTypeId = await resolveObjectField(
      draftData.object_type_id,
      "object_types",
      supabase,
    );
    const objectBrand = await resolveObjectField(
      draftData.object_brand,
      "object_brands",
      supabase,
    );
    const objectModel = await resolveObjectField(
      draftData.object_model,
      "object_models",
      supabase,
    );
    const objectReference = await resolveObjectField(
      draftData.object_reference,
      "object_references",
      supabase,
    );

    const { data: object, error: objectError } = await supabase
      .from("objects")
      .insert({
        type_id: objectTypeId,
        model: objectModel,
        brand: objectBrand,
        reference: objectReference,
        serial_number: draftData.object_serial_number,
        owner_id: userProfile.id,
      })
      .select()
      .single();

    if (objectError || !object) {
      console.error("❌ Impossible de créer l'objet:", objectError);
      return res
        .status(500)
        .json({ error: "Impossible de créer l'objet associé au certificat" });
    }

    await insertObjectPhoto(
      object.id,
      draftData.object_front_photo[0],
      "front",
    );

    const { data: certificate, error: certError } = await supabase
      .from("certificates")
      .insert({
        id: draft_id,
        object_id: object.id,
        created_by: draftData.created_by,
        customer_id: userProfile.id,
        certificate_type_id: draftData.certificate_type_id,
        payment_method_id: draftData.payment_method_id,
        pin_code: generateRandomPin(3, 4),
        status: "payment_confirmed",
      })
      .select()
      .single();

    if (certError || !certificate) {
      console.error("❌ Impossible de créer le certificat:", certError);
      return res
        .status(500)
        .json({ error: "Impossible de créer le certificat" });
    }

    await supabase.from("certificate_drafts").delete().eq("id", draft_id);

    await emailService.sendPaymentConfirmation({
      to: customer.email,
      customerName: `${customer.first_name} ${customer.last_name}`,
      certificateName: certificate_type,
      amount: price,
    });

    if (isNewGuestProfile) {
      try {
        const { data, error } = await supabase.auth.admin.generateLink({
          type: "magiclink",
          email: customer.email,
          options: {
            redirectTo: `${process.env.FRONTEND_URL}/set-password`,
          },
        });

        if (error) throw error;

        const magicLink = data?.properties?.action_link;

        if (magicLink) {
          await emailService.sendAccountInvitation({
            to: customer.email,
            customerName: `${customer.first_name} ${customer.last_name}`,
            inviteLink: magicLink,
          });
          console.log("📧 Email d'invitation envoyé à:", customer.email);
        }
      } catch (inviteError) {
        console.error("⚠️ Erreur envoi email d'invitation:", inviteError);
      }
    }

    console.log(
      `✅ Paiement vérifié et certificat créé pour draft ${draft_id}`,
    );
    return res.json({ success: true, session, certificate });
  } catch (error) {
    console.error("❌ Erreur vérification paiement:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/cancel-checkout-session", async (req, res) => {
  const { draftId } = req.body;

  if (!draftId) {
    console.error("❌ Données manquantes:", {
      draftId,
    });
    return res.status(400).json({ error: "Données manquantes" });
  }

  try {
    const { data, error } = await supabase
      .from("certificate_drafts")
      .select()
      .eq("id", draftId)
      .maybeSingle();

    if (error || !data) {
      console.error(
        "❌ Impossible de récupérer le brouillon du certificat:",
        error,
      );
      return res
        .status(400)
        .json({ error: "Impossible de récupérer le brouillon du certificat" });
    }

    if (!data.stripe_session_id) {
      console.error("Pas de session Stripe associée:", draftId);
      return res
        .status(400)
        .json({ error: "Aucune session de paiement associée" });
    }

    try {
      await stripe.checkout.sessions.expire(data.stripe_session_id);
      console.log("Session Stripe expirée:", data.stripe_session_id);
    } catch (stripeError) {
      console.error("Erreur Stripe:", stripeError);

      if (stripeError.code !== "resource_missing") {
        return res
          .status(500)
          .json({ error: "Erreur lors de l'annulation de la session Stripe" });
      }
    }

    return res.json({
      success: true,
      message: "La session de paiement a été annulée avec succès",
    });
  } catch (error) {
    console.error("Erreur inattendue:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/create-checkout-session", async (req, res) => {
  const {
    draftId,
    customerData,
    objectTypeId,
    objectModel,
    objectBrand,
    objectReference,
    objectSerialNumber,
    objectFrontPhoto,
    certificateTypeId,
    partnerId,
    paymentMethodId,
    createdBy,
  } = req.body;

  console.log("📝 Création session checkout pour draft:", draftId);

  if (
    !draftId ||
    !customerData ||
    !objectTypeId ||
    !objectModel ||
    !objectBrand ||
    !objectReference ||
    !objectSerialNumber ||
    !certificateTypeId ||
    !partnerId ||
    !paymentMethodId ||
    !createdBy
  ) {
    console.error("❌ Données manquantes:", {
      draftId,
      customerData,
      objectTypeId,
      objectModel,
      objectBrand,
      objectReference,
      objectSerialNumber,
      certificateTypeId,
      paymentMethodId,
      createdBy,
    });
    return res.status(400).json({ error: "Données manquantes" });
  }

  const { data: certificateType, error: certificateTypeError } = await supabase
    .from("certificate_types")
    .select("name, price")
    .eq("id", certificateTypeId)
    .maybeSingle();

  if (certificateTypeError || !certificateType) {
    console.error("❌ Impossible de récupérer le type de certificat");
    return res
      .status(400)
      .json({ error: "Impossible de récupérer le type de certificat" });
  }

  try {
    const { data: newDraft, error: newDraftError } = await supabase
      .from("certificate_drafts")
      .upsert({
        id: draftId,
        object_type_id: objectTypeId,
        object_model: objectModel,
        object_brand: objectBrand,
        object_reference: objectReference,
        object_serial_number: objectSerialNumber,
        object_front_photo: objectFrontPhoto,
        certificate_type_id: certificateTypeId,
        partner_id: partnerId,
        payment_method_id: paymentMethodId,
        created_by: createdBy,
        payment_link_sent: true,
        customer_data: customerData,
      })
      .select()
      .single();

    if (newDraftError || !newDraft) {
      console.error("❌ Impossible de créer le draft:", newDraftError);
      return res.status(400).json({ error: "Impossible de créer le draft" });
    }

    const customerName = `${customerData.last_name} ${customerData.first_name}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: customerData.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: certificateType.name },
            unit_amount: Math.round(certificateType.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment`,
      metadata: {
        draft_id: draftId,
        customer_name: customerName,
        certificate_type: certificateType.name,
        price: certificateType.price,
      },
    });

    console.log("✅ Session Stripe créée:", session.id);

    await supabase
      .from("certificate_drafts")
      .update({
        stripe_session_id: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", draftId);

    try {
      await emailService.sendPaymentRequest({
        to: customerData.email,
        customerName,
        certificateName: certificateType.name,
        amount: certificateType.price,
        paymentUrl: session.url,
      });

      console.log(
        "📧 Email de demande de paiement envoyé à:",
        customerData.email,
      );
      res.json({ success: true, sessionUrl: session.url });
    } catch (emailError) {
      console.error("⚠️ Erreur envoi email:", emailError);
      res.json({
        success: true,
        sessionUrl: session.url,
        warning: "Session créée mais email non envoyé",
      });
    }
  } catch (error) {
    console.error("❌ Erreur création session:", error);
    res.status(500).json({
      error: "Échec création session",
      details: error.message,
    });
  }
});

app.get("/get-certificate/:id", async (req, res) => {
  const { id } = req.params;
  const pinCode = req.query.pin || null;

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  const token = authHeader.split(" ")[1];

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return res.status(401).json({ error: "Token invalide" });
  }

  try {
    const { data: certificate, error: certError } = await supabase
      .from("certificates")
      .select(
        `
        *,
        customer:profiles(*),
        type:certificate_types(*),
        object:objects(
          *,
          object_type:object_types(*),
          object_photos(*)
        ),
        inspection:certificate_inspections(*)
      `,
      )
      .eq("id", id)
      .single();

    if (certError || !certificate) {
      return res.status(404).json({ error: "Certificat introuvable" });
    }

    const isOwner =
      certificate.object?.owner_id === user.id ||
      certificate.customer_id === user.id;

    const pinIsValid =
      !isOwner &&
      pinCode &&
      certificate.pin_code &&
      certificate.pin_code === pinCode;

    const hasFullAccess = isOwner || pinIsValid;

    if (!hasFullAccess) {
      if (certificate.customer?.last_name) {
        certificate.customer.last_name = `${certificate.customer.last_name.charAt(0)}.`;
      }

      if (certificate.object?.serial_number) {
        const sn = certificate.object.serial_number;

        if (sn.length > 4) {
          certificate.object.serial_number = `${sn.slice(0, 2)}${"X".repeat(sn.length - 4)}${sn.slice(-2)}`;
        }
      }

      if (certificate.customer) {
        certificate.customer.email = null;
        certificate.customer.phone = null;
        certificate.customer.address = null;
        certificate.customer.vat_number = null;
      }
    }

    delete certificate.pin_code;

    return res.json({
      ...certificate,
      _access: hasFullAccess ? "full" : "masked",
    });
  } catch (error) {
    console.error("❌ Erreur get-certificate:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString(), env: env });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur actif sur le port ${PORT} (Mode: ${env})`);
});
