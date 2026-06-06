import React from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import "./root.scss";

export { ErrorBoundary } from "~/components";

export function Layout({ children }: { children: React.ReactNode }) {
  // const navigation = useNavigation();
  return (
    <html lang={import.meta.env.VITE_PUBLIC_LOCALE}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
      // css={
      //   navigation.state === "loading" &&
      //   css`
      //     overscroll-behavior: contain;
      //     overflow: hidden !important;
      //   `
      // }
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: import.meta.env.VITE_PUBLIC_TITLE },
    {
      name: "description",
      content:
        import.meta.env.LOCALE === "fr"
          ? "Partagez des citations"
          : "Share quotes",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { name: "theme-color", content: "#000000" },
    //{ name: "mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    {
      name: "apple-mobile-web-app-title",
      content: import.meta.env.VITE_PUBLIC_TITLE,
    },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Griffy&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap",
  },
  { rel: "manifest", href: "/manifest.json" },
  {
    rel: "apple-touch-icon",
    sizes: "120x120",
    href: "/icons/apple-touch-icon_120.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/icons/apple-touch-icon_180.png",
  },
  //{ rel: "apple-touch-startup-image", href: "/splash/" },
];

export default function Root(props) {
  return <Outlet />;
}
