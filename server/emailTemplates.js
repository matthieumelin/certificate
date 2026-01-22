export const emailTemplates = {
  paymentRequest: ({ customerName, certificateName, amount, paymentUrl }) => ({
    subject: `Certificate - Paiement requis – ${certificateName}`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #000000; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ffffff; font-weight: 600; text-align: center; margin: 0 0 20px 0;">Votre certificat est prêt</h1>
          <p style="font-size: 16px; color: #ffffff;">Bonjour ${
            customerName.split(" ")[0]
          },</p>
          <p style="font-size: 16px; color: #ffffff; line-height: 1.6;">
            Nous avons bien reçu votre demande de certification :<br>
            <strong style="font-size: 18px; color: #03AB62;">${certificateName}</strong>
          </p>
          <p style="font-size: 16px; color: #ffffff;">
            Montant à régler : <strong style="font-size: 20px;">${amount.toFixed(
              2
            )} €</strong>
          </p>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${paymentUrl}" style="
              background: #03AB62;
              color: #000000;
              padding: 16px 40px;
              font-size: 18px;
              font-weight: 600;
              text-decoration: none;
              border-radius: 4px;
              display: inline-block;
            ">
              Payer maintenant
            </a>
          </div>

          <p style="color: #ffffff; font-size: 14px; text-align: center; line-height: 1.6;">
            Ce lien expire dans 24 heures.<br>
            Une fois le paiement effectué, votre certificat sera généré automatiquement.
          </p>

          <hr style="border: 0; border-top: 1px solid #333333; margin: 40px 0;">
          <p style="text-align: center; color: #999999; font-size: 12px;">
            Certificate • Cet email est automatique, merci de ne pas répondre.
          </p>
        </div>
      </div>
    `,
  }),

  paymentConfirmation: ({ customerName, certificateName, amount }) => ({
    subject: `Certificate - Paiement confirmé - ${certificateName}`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #000000; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ffffff; font-weight: 600; text-align: center; margin: 0 0 20px 0;">✅ Paiement confirmé</h1>
          <p style="font-size: 16px; color: #ffffff;">Bonjour ${
            customerName.split(" ")[0]
          },</p>
          <p style="font-size: 16px; color: #ffffff; line-height: 1.6;">
            Nous avons bien reçu votre paiement de <strong>${amount.toFixed(
              2
            )} €</strong> pour le certificat :<br>
            <strong style="font-size: 18px; color: #03AB62;">${certificateName}</strong>
          </p>
          <p style="font-size: 16px; color: #ffffff; line-height: 1.6;">
            Votre certificat est en cours de génération et vous sera envoyé dans les prochaines minutes.
          </p>

          <hr style="border: 0; border-top: 1px solid #333333; margin: 40px 0;">
          <p style="text-align: center; color: #999999; font-size: 12px;">
            Certificate • Cet email est automatique, merci de ne pas répondre.
          </p>
        </div>
      </div>
    `,
  }),

  certificateDelivery: ({
    customerName,
    certificateName,
    certificateDetailsLink,
  }) => ({
    subject: `Certificate - Votre certificat - ${certificateName}`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #000000; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ffffff; font-weight: 600; text-align: center; margin: 0 0 20px 0;">Votre certificat est prêt !</h1>
          <p style="font-size: 16px; color: #ffffff;">Bonjour ${
            customerName.split(" ")[0]
          },</p>
          <p style="font-size: 16px; color: #ffffff; line-height: 1.6;">
            Félicitations ! Votre certificat <strong style="color: #03AB62;">${certificateName}</strong> est maintenant disponible.
          </p>
          
          ${
            certificateDetailsLink
              ? `
          <div style="margin-top: 32px;">
            <a href="${certificateDetailsLink}" style="
              background: #03AB62;
              color: #000000;
              border-radius: 4px;
              padding: 10px 20px;
              display: inline-block;
              text-decoration: none;
              font-weight: 500;
            ">Récupérer mon certificat numérique</a>
          </div>
          `
              : ""
          }

          <hr style="border: 0; border-top: 1px solid #333333; margin: 40px 0;">
          <p style="text-align: center; color: #999999; font-size: 12px;">
            Certificate • Cet email est automatique, merci de ne pas répondre.
          </p>
        </div>
      </div>
    `,
  }),

  inauthenticItemAlert: ({
    customerName,
    certificateType,
    objectModel,
    objectBrand,
    objectReference,
    suspectPoints,
    expertComment,
    certificateDetailsLink,
  }) => ({
    subject: `Certificate - ⚠️ Résultat d'inspection - ${certificateType}`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #000000; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ffffff; font-weight: 600; margin: 0 0 20px 0;">Inspection visuelle</h2>

          <div style="margin-top: 20px;">
            <h3 style="color: #ffffff; font-weight: 600; margin: 0 0 10px 0;">Résultat de l'inspection</h3>
            <span style="color: #ef4444; font-weight: 500;">Pièce inauthentique</span>
          </div>

          <p style="margin-top: 20px; color: #ffffff; line-height: 1.6;">
            Cher/Chère ${customerName},<br /><br />
            Nous vous contactons suite à l'inspection de l'authenticité de l'objet <strong>${objectModel} ${objectBrand}</strong> que vous nous avez soumis sous la référence <strong>${objectReference}</strong>.<br /><br />
            Après une inspection visuelle approfondie, le résultat global de notre vérification indique une <strong>Pièce inauthentique</strong> (Contrefaçon présumée).
          </p>

          ${
            suspectPoints && suspectPoints.length > 0
              ? `
          <p style="margin-top: 20px; color: #ffffff; line-height: 1.6;">
            <span style="font-weight: 600;">L'analyse a soulevé des doutes significatifs sur l'authenticité de plusieurs éléments:</span><br /><br />
            ${suspectPoints.map((point) => `• ${point}`).join("<br />")}
          </p>
          `
              : ""
          }

          ${
            expertComment
              ? `
          <div style="margin-top: 20px;">
            <h3 style="color: #ffffff; font-weight: 600; margin: 0 0 10px 0;">Commentaire de l'expert</h3>
            <p style="color: #ffffff; line-height: 1.6; margin: 0;">${expertComment}</p>
          </div>
          `
              : ""
          }

          ${
            certificateDetailsLink
              ? `
          <div style="margin-top: 32px;">
            <a href="${certificateDetailsLink}" style="
              background: #03AB62;
              color: #000000;
              border-radius: 4px;
              padding: 10px 20px;
              display: inline-block;
              text-decoration: none;
              font-weight: 500;
            ">Voir les images</a>
          </div>
          `
              : ""
          }

          <p style="margin-top: 20px; color: #ffffff; line-height: 1.6;">
            Pour de plus amples informations n'hésitez pas à nous contacter via <span style="font-weight: 600;">info@c-ertificate.eu</span>
          </p>
        </div>
      </div>
    `,
  }),

  accountCreation: ({ customerName, inviteLink }) => ({
    subject: `Certificate - Bienvenue ${customerName.split(" ")[0]}`,
    html: `
    <div style="font-family: Arial, sans-serif; background: #000000; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ffffff; font-weight: 600; text-align: center; margin: 0 0 20px 0;">
          Bienvenue sur Certificate
        </h1>

        <p style="font-size: 16px; color: #ffffff;">
          Bonjour ${customerName.split(" ")[0]},
        </p>

        <p style="font-size: 16px; color: #ffffff; line-height: 1.6;">
          Votre certificat a été créé avec succès
        </p>

        <p style="font-size: 16px; color: #ffffff; line-height: 1.6;">
          Pour accéder à votre espace client et gérer l’ensemble de vos certificats,
          nous vous invitons à créer votre compte.
        </p>

        <div style="text-align: center; margin: 40px 0;">
          <a href="${inviteLink}" style="
            background: #03AB62;
            color: #000000;
            padding: 16px 40px;
            font-size: 18px;
            font-weight: 600;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
          ">
            Créer mon compte
          </a>
        </div>

        <p style="font-size: 14px; color: #ffffff; text-align: center; line-height: 1.6;">
          Une fois votre compte créé, vous pourrez consulter et gérer
          tous vos certificats à tout moment.
        </p>

        <hr style="border: 0; border-top: 1px solid #333333; margin: 40px 0;">

        <p style="text-align: center; color: #999999; font-size: 12px;">
          Certificate • Cet email est automatique, merci de ne pas répondre.
        </p>
      </div>
    </div>
  `,
  }),
};
