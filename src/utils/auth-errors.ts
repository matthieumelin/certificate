export const AUTH_ERRORS: Record<string, string> = {
  anonymous_provider_disabled: "Les connexions anonymes sont désactivées.",
  bad_code_verifier: "Erreur de vérification du code. Veuillez réessayer.",
  bad_json: "Données invalides. Veuillez réessayer.",
  bad_jwt: "Session invalide. Veuillez vous reconnecter.",
  bad_oauth_callback:
    "Erreur lors de la connexion avec le fournisseur. Veuillez réessayer.",
  bad_oauth_state: "Erreur d'authentification. Veuillez réessayer.",
  captcha_failed: "La vérification CAPTCHA a échoué. Veuillez réessayer.",
  conflict:
    "Une opération est déjà en cours. Veuillez patienter quelques instants.",
  email_address_invalid:
    "Adresse e-mail invalide. Veuillez utiliser une adresse e-mail valide.",
  email_address_not_authorized:
    "L'envoi d'e-mails à cette adresse n'est pas autorisé. Veuillez configurer un fournisseur SMTP personnalisé.",
  email_conflict_identity_not_deletable:
    "Impossible de dissocier cette identité. Veuillez contacter le support.",
  email_exists: "Cette adresse e-mail est déjà utilisée.",
  email_not_confirmed:
    "Veuillez confirmer votre adresse e-mail avant de vous connecter.",
  email_provider_disabled: "L'inscription par e-mail est désactivée.",
  flow_state_expired: "Votre session a expiré. Veuillez vous reconnecter.",
  flow_state_not_found: "Session introuvable. Veuillez vous reconnecter.",
  hook_payload_invalid_content_type:
    "Erreur de traitement. Veuillez réessayer.",
  hook_payload_over_size_limit:
    "Données trop volumineuses. Veuillez réessayer.",
  hook_timeout: "Le serveur ne répond pas. Veuillez réessayer ultérieurement.",
  hook_timeout_after_retry:
    "Le serveur ne répond pas. Veuillez réessayer plus tard.",
  identity_already_exists: "Cette identité est déjà associée à un compte.",
  identity_not_found: "Identité introuvable.",
  insufficient_aal:
    "Authentification supplémentaire requise. Veuillez compléter la vérification MFA.",
  invalid_credentials:
    "Identifiants incorrects. Veuillez vérifier votre e-mail et mot de passe.",
  invite_not_found: "L'invitation a expiré ou a déjà été utilisée.",
  manual_linking_disabled: "La liaison manuelle de comptes est désactivée.",
  mfa_challenge_expired:
    "Le code de vérification a expiré. Veuillez demander un nouveau code.",
  mfa_factor_name_conflict:
    "Un facteur d'authentification avec ce nom existe déjà.",
  mfa_factor_not_found: "Facteur d'authentification introuvable.",
  mfa_ip_address_mismatch:
    "Adresse IP différente détectée. Veuillez recommencer l'inscription.",
  mfa_phone_enroll_not_enabled:
    "L'inscription par téléphone n'est pas activée.",
  mfa_phone_verify_not_enabled:
    "La vérification par téléphone n'est pas activée.",
  mfa_totp_enroll_not_enabled: "L'authentification TOTP n'est pas activée.",
  mfa_totp_verify_not_enabled: "La vérification TOTP n'est pas activée.",
  mfa_verification_failed:
    "Code de vérification incorrect. Veuillez réessayer.",
  mfa_verification_rejected:
    "Vérification refusée. Veuillez contacter le support.",
  mfa_verified_factor_exists:
    "Un facteur de vérification existe déjà. Veuillez le désinscrire d'abord.",
  mfa_web_authn_enroll_not_enabled: "L'inscription WebAuthn n'est pas activée.",
  mfa_web_authn_verify_not_enabled:
    "La vérification WebAuthn n'est pas activée.",
  no_authorization: "Autorisation manquante. Veuillez vous reconnecter.",
  not_admin: "Accès non autorisé. Droits d'administrateur requis.",
  oauth_provider_not_supported:
    "Ce fournisseur d'authentification n'est pas pris en charge.",
  otp_disabled: "La connexion par code unique est désactivée.",
  otp_expired:
    "Le code de vérification a expiré. Veuillez demander un nouveau code.",
  over_email_send_rate_limit:
    "Trop d'e-mails envoyés. Veuillez patienter quelques minutes avant de réessayer.",
  over_request_rate_limit:
    "Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.",
  over_sms_send_rate_limit:
    "Trop de SMS envoyés. Veuillez patienter quelques minutes avant de réessayer.",
  phone_exists: "Ce numéro de téléphone est déjà utilisé.",
  phone_not_confirmed:
    "Veuillez confirmer votre numéro de téléphone avant de vous connecter.",
  phone_provider_disabled: "L'inscription par téléphone est désactivée.",
  provider_disabled: "Ce fournisseur d'authentification est désactivé.",
  provider_email_needs_verification:
    "Veuillez vérifier votre adresse e-mail pour continuer.",
  reauthentication_needed:
    "Veuillez vous reconnecter pour modifier votre mot de passe.",
  reauthentication_not_valid:
    "Code de vérification incorrect. Veuillez réessayer.",
  refresh_token_already_used: "Session invalide. Veuillez vous reconnecter.",
  refresh_token_not_found: "Session introuvable. Veuillez vous reconnecter.",
  request_timeout: "La demande a expiré. Veuillez réessayer.",
  same_password: "Le nouveau mot de passe doit être différent de l'ancien.",
  saml_assertion_no_email:
    "Aucune adresse e-mail trouvée. Veuillez vérifier la configuration du fournisseur.",
  saml_assertion_no_user_id:
    "Identifiant utilisateur manquant. Veuillez vérifier la configuration du fournisseur.",
  saml_entity_id_mismatch:
    "Erreur de configuration SAML. Veuillez contacter l'administrateur.",
  saml_idp_already_exists: "Ce fournisseur SAML existe déjà.",
  saml_idp_not_found: "Fournisseur SAML introuvable.",
  saml_metadata_fetch_failed:
    "Impossible de récupérer les métadonnées SAML. Veuillez vérifier l'URL.",
  saml_provider_disabled: "L'authentification SAML est désactivée.",
  saml_relay_state_expired: "La session a expiré. Veuillez vous reconnecter.",
  saml_relay_state_not_found: "Session introuvable. Veuillez vous reconnecter.",
  session_expired: "Votre session a expiré. Veuillez vous reconnecter.",
  session_not_found: "Session introuvable. Veuillez vous reconnecter.",
  signup_disabled: "Les inscriptions sont actuellement désactivées.",
  single_identity_not_deletable:
    "Impossible de supprimer la seule méthode de connexion. Ajoutez-en une autre d'abord.",
  sms_send_failed: "Échec de l'envoi du SMS. Veuillez réessayer.",
  sso_domain_already_exists: "Ce domaine SSO est déjà enregistré.",
  sso_provider_not_found:
    "Fournisseur SSO introuvable. Veuillez vérifier vos paramètres.",
  too_many_enrolled_mfa_factors:
    "Nombre maximum de facteurs d'authentification atteint.",
  unexpected_audience: "Erreur d'authentification. Veuillez vous reconnecter.",
  unexpected_failure:
    "Une erreur inattendue s'est produite. Veuillez réessayer.",
  user_already_exists: "Un compte avec ces informations existe déjà.",
  user_banned:
    "Votre compte est temporairement suspendu. Veuillez réessayer plus tard.",
  user_not_found: "Utilisateur introuvable.",
  user_sso_managed:
    "Ce compte est géré par SSO. Certaines informations ne peuvent pas être modifiées.",
  validation_failed:
    "Les informations fournies sont invalides. Veuillez vérifier vos données.",
  weak_password:
    "Le mot de passe est trop faible. Veuillez utiliser un mot de passe plus fort.",

  "user already registered": "Un compte avec cet email existe déjà.",
  "invalid login credentials":
    "Identifiants incorrects. Veuillez vérifier votre e-mail et mot de passe.",
  "invalid email": "Adresse e-mail invalide.",
  "password is too short":
    "Le mot de passe doit contenir au moins 6 caractères.",
  "email rate limit exceeded":
    "Trop d'e-mails envoyés. Veuillez patienter quelques minutes.",

  network_error:
    "Erreur de connexion. Veuillez vérifier votre connexion internet.",
  fetch_error: "Erreur de connexion au serveur. Veuillez réessayer.",
  timeout: "La requête a expiré. Veuillez réessayer.",
  unknown_error: "Une erreur inconnue s'est produite. Veuillez réessayer.",
  server_error: "Erreur serveur. Veuillez réessayer plus tard.",
} as const;

export type AuthErrorCode = keyof typeof AUTH_ERRORS;

export function getAuthErrorMessage(code: string | undefined): string {
  if (!code) return "Une erreur s'est produite. Veuillez réessayer.";

  const normalizedCode = code.toLowerCase().replace(/\s+/g, "_");

  if (AUTH_ERRORS[normalizedCode]) {
    return AUTH_ERRORS[normalizedCode];
  }

  if (AUTH_ERRORS[code.toLowerCase()]) {
    return AUTH_ERRORS[code.toLowerCase()];
  }

  if (AUTH_ERRORS[code]) {
    return AUTH_ERRORS[code];
  }

  return "Une erreur s'est produite. Veuillez réessayer.";
}
