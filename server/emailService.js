import nodemailer from "nodemailer";
import { emailTemplates } from "./emailTemplates.js";

class EmailService {
  constructor(config) {
    if (!config.host || !config.port || !config.user || !config.pass) {
      throw new Error("Configuration SMTP incomplète");
    }

    // Création du transporteur nodemailer
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465, // true pour le port 465, false pour les autres
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    this.senderEmail = config.senderEmail;
    this.allowedDomains = config.allowedDomains || [];

    // Vérifier la connexion au démarrage
    this.transporter.verify((error, success) => {
      if (error) {
        console.error("❌ Erreur de connexion SMTP:", error);
      } else {
        console.log("✅ Serveur SMTP prêt à envoyer des emails");
      }
    });
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isDomainAllowed(email) {
    if (this.allowedDomains.length === 0) return true;

    const domain = email.split("@")[1];
    return this.allowedDomains.includes(domain);
  }

  async sendEmail({ to, subject, html, attachments = [] }) {
    try {
      if (!this.isValidEmail(to)) {
        throw new Error(`Adresse email invalide: ${to}`);
      }

      if (!this.isDomainAllowed(to)) {
        throw new Error(`Domaine non autorisé: ${to}`);
      }

      if (!subject || subject.trim().length === 0) {
        throw new Error("Le sujet de l'email est requis");
      }

      if (!html || html.trim().length === 0) {
        throw new Error("Le contenu de l'email est requis");
      }

      if (html.length > 500000) {
        throw new Error("Le contenu de l'email est trop volumineux");
      }

      const mailOptions = {
        from: this.senderEmail,
        to,
        subject,
        html,
        attachments: attachments.map((att) => ({
          filename: att.filename,
          content: att.content,
        })),
      };

      const result = await this.transporter.sendMail(mailOptions);

      console.log(
        `✅ Email envoyé avec succès à ${to} (ID: ${result.messageId})`
      );
      return { success: true, id: result.messageId };
    } catch (error) {
      console.error(`❌ Erreur envoi email à ${to}:`, error.message);
      throw error;
    }
  }

  async sendPaymentRequest({
    to,
    customerName,
    certificateName,
    amount,
    paymentUrl,
  }) {
    const template = emailTemplates.paymentRequest({
      customerName,
      certificateName,
      amount,
      paymentUrl,
    });

    return this.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
    });
  }

  async sendPaymentConfirmation({ to, customerName, certificateName, amount }) {
    const template = emailTemplates.paymentConfirmation({
      customerName,
      certificateName,
      amount,
    });

    return this.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
    });
  }

  async sendCertificate({
    to,
    customerName,
    certificateName,
    certificateDetailsLink,
  }) {
    const template = emailTemplates.certificateDelivery({
      customerName,
      certificateName,
      certificateDetailsLink,
    });

    return this.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
    });
  }

  async sendInauthenticItemAlert({
    to,
    customerName,
    certificateType,
    certificateDetailsLink = "",
    objectModel,
    objectBrand,
    objectReference,
    suspectPoints = [],
    expertComment = "",
  }) {
    const template = emailTemplates.inauthenticItemAlert({
      customerName,
      certificateType,
      objectBrand,
      objectModel,
      objectReference,
      suspectPoints,
      expertComment,
      certificateDetailsLink,
    });

    return this.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
    });
  }

  async sendAccountInvitation({ to, customerName, inviteLink }) {
    const template = emailTemplates.accountCreation({
      customerName,
      inviteLink,
    });

    return this.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
    });
  }
}

export default EmailService;
