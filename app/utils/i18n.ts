import { localize } from "./utils";

export const user_badge_click = localize(
  "Si vous souhaitez envoyer un message à cet utilisateur, demandez son e-mail à " +
    import.meta.env.VITE_PUBLIC_EMAIL,
  "If you want to message this user, ask their email to " +
    import.meta.env.VITE_PUBLIC_EMAIL,
);

// auth
const variables = {
  email_label: localize("Adresse e-mail", "Email address"),
  password_label: localize("Mot de passe", "Password"),
  email_input_placeholder: localize(
    "Votre adresse e-mail",
    "Your email address",
  ),
  password_input_placeholder: localize("Votre mot de passe", "Your password"),
  button_label: localize("Connexion", "Login"),
  loading_button_label: localize("Chargement...", "Loading..."),
  //social_provider_text: localize("", ""),
  link_text: localize("link_text", ""),
};
export const i18n = {
  sign_in: variables,
  sign_up: {
    ...variables,
    button_label: localize("Créer le compte", "Create account"),
    link_text: localize("Créer un compte", "Create a new account"),
    confirmation_text: localize("Confirmer", "Confirm"),
  },
  magic_link: {
    ...variables,
    link_text: localize("Envoyer un mail de connexion", "Send a login email"),
    button_label: localize(
      "Envoyer un mail de connexion",
      "Send a login email",
    ),
  },
  forgotten_password: {
    ...variables,
    button_label: localize(
      "Envoyer un mail de récupération de mot de passe",
      "Send a password recovery email",
    ),
    link_text: localize("Mot de passe oublié ?", "Forgotten password?"),
  },
};
