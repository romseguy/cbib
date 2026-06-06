import { Button } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import {
  BackButton,
  Flex,
  Input,
  useToast,
  useToggleModal,
} from "~/components";
import client from "~/lib/supabase/client";
import { i18n, localize } from "~/utils";
import { FakeDash, Slot } from "./ui/slot";
import { useDispatch } from "react-redux";
import { setState } from "~/store";
import { OTPInput } from "input-otp";

function ForgottenPassword({
  i18n,
  redirectTo,
  setAuthView = (string) => {},
  showLinks = false,
}: {
  i18n: any;
  redirectTo?: string;
  setAuthView?: (string: any) => void;
  showLinks?: boolean | undefined;
  onSuccess: () => void;
}) {
  const showToast = useToast();
  const labels = i18n?.forgotten_password;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  useEffect(() => {
    if (error) showToast(error, true);
  }, [error]);
  useEffect(() => {
    if (message) showToast(message);
  }, [message]);

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const { error } = await client().auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) setError(error.message);
    else setMessage(i18n?.forgotten_password?.confirmation_text as string);
    setLoading(false);
  };

  return (
    <form id="auth-forgot-password" onSubmit={handlePasswordReset}>
      <Flex direction="column" gap="3">
        <Flex>
          <BackButton
            onClick={() => {
              setAuthView("sign_in");
            }}
          />
        </Flex>

        <Flex direction="column" gap="3">
          <Input
            id="email"
            type="email"
            name="email"
            placeholder={labels?.email_input_placeholder}
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <Button loading={loading}>
            {loading ? labels?.loading_button_label : labels?.button_label}
          </Button>

          {showLinks && (
            <a
              href="#auth-sign-in"
              onClick={(e) => {
                e.preventDefault();
                setAuthView("sign_in");
              }}
            >
              {i18n?.sign_in?.link_text}
            </a>
          )}
        </Flex>
      </Flex>
    </form>
  );
}

function EmailAuth({
  authView = "sign_in",
  setAuthView = (string) => {},
  defaultEmail = "",
  defaultPassword = "",
  redirectTo = "",
  additionalData = {},
  magicLink = true,
  i18n,
  passwordLimit = false,
  onBackClick,
  onSuccess,
}) {
  const showToast = useToast();
  const labels = i18n?.[authView];
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  useEffect(() => {
    if (error) showToast(error, true);
  }, [error]);
  useEffect(() => {
    if (message) showToast(message);
  }, [message]);
  useEffect(() => {
    setPassword(defaultPassword);
    if (authView !== "code") setEmail(defaultEmail);
  }, [authView]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    switch (authView) {
      case "sign_in":
        const res = await client().auth.signInWithPassword({
          email,
          password,
        });
        const { data: signInData, error: signInError } = res;
        if (signInError) setError("Identifiants incorrects");
        else onSuccess(signInData);
        break;
      case "sign_up":
        if (passwordLimit && password.length > 72) {
          setError(
            "Le mot de passe ne doit pas comporter plus de 72 caractères",
          );
          return;
        }
        let options: { emailRedirectTo: string; data?: object } = {
          emailRedirectTo: redirectTo,
        };
        if (additionalData) {
          options.data = additionalData;
        }
        const { data: signUpData, error: signUpError } =
          await client().auth.signUp({
            email,
            password,
            options,
          });
        if (signUpError) setError(signUpError.message);
        else onSuccess(signUpData);
        // Check if session is null -> email confirmation setting is turned on
        // else if (signUpUser && !signUpSession)
        //   setMessage(i18n?.sign_up?.confirmation_text as string);
        break;
      case "magic_link":
        const { error } = await client().auth.signInWithOtp({ email });
        if (error) setError(error.message);
        else {
          setAuthView("code");
          // setMessage(
          //   localize(
          //     "Vérifiez votre e-mail pour vous connecter au site",
          //     "Check your email for the login link",
          //   ),
          // );
          // onSuccess();
        }
        break;
    }
    setLoading(false);
  };

  return (
    <form
      id={authView === "sign_in" ? `auth-sign-in` : `auth-sign-up`}
      onSubmit={handleSubmit}
      autoComplete={"on"}
    >
      <Flex direction="column" gap="3">
        <BackButton
          onClick={(e) => {
            e.preventDefault();
            if (authView === "sign_in") onBackClick();
            else {
              setAuthView("sign_in");
            }
          }}
        />

        {authView === "code" ? (
          <>
            {localize(
              "Veuillez saisir le code qui vous a été envoyé par e-mail (vérifiez votre spam)",
              "Please input the code sent to you by email (check your spam)",
            )}
            <OTPInput
              maxLength={6}
              containerClassName="group flex items-center has-[:disabled]:opacity-30"
              onComplete={async (value) => {
                try {
                  const { data, error } = await client().auth.verifyOtp({
                    email,
                    type: "magiclink",
                    token: value,
                  });
                  if (!error) {
                    onSuccess(data);
                  }
                } catch (error) {}
              }}
              render={({ slots }) => {
                return (
                  <>
                    <Flex>
                      {slots.slice(0, 3).map((slot, idx) => (
                        <Slot key={idx} {...slot} />
                      ))}
                    </Flex>

                    <FakeDash />

                    <Flex>
                      {slots.slice(3).map((slot, idx) => (
                        <Slot key={idx} {...slot} />
                      ))}
                    </Flex>
                  </>
                );
              }}
            />
          </>
        ) : (
          <>
            <Flex direction="column" gap="3">
              <Input
                autoFocus
                id="email"
                type="email"
                name="email"
                value={email}
                placeholder={labels?.email_input_placeholder}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />

              {["sign_in", "sign_up"].includes(authView) && (
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder={labels?.password_input_placeholder}
                  defaultValue={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    authView === "sign_in" ? "current-password" : "new-password"
                  }
                />
              )}
            </Flex>

            <Button>
              {loading ? labels?.loading_button_label : labels?.button_label}
            </Button>
          </>
        )}

        {authView === "sign_in" && (
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setAuthView("sign_up");
            }}
          >
            {i18n?.sign_up?.link_text} {">"}
          </Button>
        )}

        {authView === "sign_in" && (
          <a
            href="#auth-forgot-password"
            onClick={(e) => {
              e.preventDefault();
              setAuthView("forgotten_password");
            }}
          >
            {i18n?.forgotten_password?.link_text}
          </a>
        )}

        {authView === "sign_in" && magicLink && (
          <a
            href="#auth-magic-link"
            onClick={(e) => {
              e.preventDefault();
              setAuthView("magic_link");
            }}
          >
            {i18n?.magic_link?.link_text}
          </a>
        )}
      </Flex>
    </form>
  );
}

const Login = (props) => {
  const dispatch = useDispatch();
  const toggleModal = useToggleModal();
  const [view, setView] = useState<string>("sign_in");

  return (
    <div id="login-page">
      {view === "forgotten_password" ? (
        <ForgottenPassword
          i18n={i18n}
          setAuthView={(viewName) => setView(viewName)}
          onSuccess={() => {
            toggleModal();
          }}
        />
      ) : (
        <EmailAuth
          authView={view}
          setAuthView={(viewName) => setView(viewName)}
          i18n={i18n}
          onBackClick={() => toggleModal()}
          onSuccess={(data) => {
            if (view === "sign_in" || view === "code" || view === "sign_up") {
              if (data.session) {
                const { user, ...token } = data.session;
                dispatch(
                  setState({
                    auth: { bearer: JSON.stringify(token), token, user },
                    modal: { isOpen: false },
                  }),
                );
              }
            } else toggleModal();
          }}
        />
      )}
    </div>
  );
};

export default Login;
