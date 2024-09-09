import { unseal } from "@hapi/iron";
import { parse } from "cookie";
import { GlobalConfig } from "features/GlobalConfig";
import { ThemeProvider } from "features/ThemeProvider";
import { AppContext, AppProps as NextAppProps } from "next/app";
import NextNprogress from "nextjs-progressbar";
import React from "react";
import {
  getSelectorsByUserAgent,
  isMobile as rddIsMobile
} from "react-device-detect";
import { Provider } from "react-redux";
import { wrapper } from "store";
import { setIsSessionLoading, setSession } from "store/sessionSlice";
import { setIsMobile } from "store/uiSlice";
import { setUserEmail } from "store/userSlice";
import {
  Session,
  TOKEN_NAME,
  devSession,
  getAuthToken,
  sealOptions
} from "utils/auth";
import { getEnv } from "utils/env";
import { isServer } from "utils/isServer";

interface AppProps {
  cookies?: string;
  session?: Session;
  pageProps: PageProps;
}

export interface PageProps {
  isMobile: boolean;
}

const App = ({
  Component,
  cookies,
  session,
  ...rest
}: NextAppProps & AppProps) => {
  console.log("🚀 ~ App ~ session:", session);
  const { store } = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <ThemeProvider cookies={cookies}>
        <GlobalConfig />
        <NextNprogress
          color="#29D"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow
        />
        <Component />
      </ThemeProvider>
    </Provider>
  );
};

App.getInitialProps = wrapper.getInitialAppProps(
  (store) =>
    async ({ Component, ctx }: AppContext) => {
      store.dispatch(setIsSessionLoading(true));
      const headers = ctx.req?.headers;
      const cookies = headers?.cookie;

      //#region browser
      let userAgent = headers?.["user-agent"];
      if (!isServer) {
        if (!userAgent) userAgent = navigator.userAgent;
      }
      //#endregion

      //#region device
      const isMobile =
        typeof userAgent === "string"
          ? getSelectorsByUserAgent(userAgent).isMobile
          : rddIsMobile;
      store.dispatch(setIsMobile(isMobile));
      //#endregion

      //#region email and session handling
      let email = ctx.query.email as string | undefined;
      let session: Session | undefined;
      let authToken: string | null = null;

      if (devSession && getEnv() === "development") {
        const user = devSession.user;
        if (user) {
          email = user.email;

          const isAdmin =
            typeof email === "string" &&
            typeof process.env.NEXT_PUBLIC_ADMIN_EMAILS === "string"
              ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").includes(email)
              : false;

          session = {
            user: {
              ...user,
              isAdmin
            }
          };
        }
      } else {
        if (typeof cookies === "string" && cookies.includes(TOKEN_NAME)) {
          const cookie = parse(cookies);
          authToken = getAuthToken(cookie);

          if (authToken) {
            const user = await unseal(
              authToken,
              process.env.SECRET,
              sealOptions
            );

            if (user) {
              const isAdmin =
                typeof process.env.NEXT_PUBLIC_ADMIN_EMAILS === "string"
                  ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").includes(
                      user.email
                    )
                  : false;

              session = {
                user: {
                  ...user,
                  isAdmin
                }
              };

              email = user.email;
            }
          }
        }
      }

      if (typeof email === "string") {
        store.dispatch(setUserEmail(email));
      }

      if (session) {
        store.dispatch(setSession({ ...session, [TOKEN_NAME]: authToken }));
      }
      store.dispatch(setIsSessionLoading(false));
      //#endregion

      //#region page
      let pageProps: AppProps["pageProps"] = { isMobile };

      if (Component.getInitialProps)
        pageProps = {
          ...pageProps,
          ...(await Component.getInitialProps(ctx))
        };
      //#endregion

      return { cookies, session, pageProps };
    }
);

export default App;
