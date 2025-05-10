import {
  Box,
  BoxProps,
  HStack,
  List,
  ListItem,
  useColorMode,
  VStack
} from "@chakra-ui/react";
import Head from "next/head";
import { ReactNode } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useSelector } from "react-redux";
import { css } from "twin.macro";
import { ContactLink, Link } from "features/common";
import { PageProps } from "pages/_app";
import { selectScreenHeight } from "store/uiSlice";
import { ServerError } from "utils/errors";
import { capitalize } from "utils/string";
import { breakpoints, rainbowBorder } from "./theme";

export interface LayoutProps extends PageProps, BoxProps {
  mainContainer?: boolean;
  pageTitle?: string;
}

export const Layout = ({
  children,
  isMobile,
  mainContainer = true,
  pageTitle,
  ...props
}: React.PropsWithChildren<LayoutProps>) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const screenHeight = useSelector(selectScreenHeight);
  const title = `${
    pageTitle ? capitalize(pageTitle) : "Merci de patienter..."
  } – ${process.env.NEXT_PUBLIC_SHORT_URL}`;
  //const main = (c: ReactNode) => (mainContainer ? <Box as="main">{c}</Box> : c);
  const main = (c: ReactNode) =>
    mainContainer ? (
      <VStack
        css={css`
          background-color: ${isDark ? "#2D3748" : "#FAFAFA"};

          @media (min-width: ${breakpoints["2xl"]}) {
            margin: 0 auto;
            min-height: ${screenHeight}px;
            width: 1180px;
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            ${rainbowBorder(isDark)}
          }
        `}
      >
        <VStack
          css={css`
            align-items: start;
            background-color: #cffffe;
            width: 1156px;
          `}
        >
          <header>
            <HStack
              css={css`
                border-bottom: 12px solid black;
                a {
                  border-right: 12px solid black;
                  padding-left: 6px;
                  padding-right: 12px;
                }
              `}
            >
              <HStack>
                <Link href="/">Home</Link>
              </HStack>
              <HStack>
                <Link href="/books">Books</Link>
                <Link href="/cassiopaea_experiment">Cassiopaea Experiment</Link>
              </HStack>
            </HStack>
          </header>
        </VStack>

        <VStack
          css={css`
            background: linear-gradient(
              to bottom,
              #cffffe 0%,
              #cffffe 25%,
              #fafafa 50%,
              #fafafa 75%,
              #fafafa 100%
            );
            height: 100%;
            width: 1156px;
            margin: 0 !important;
          `}
        >
          <main>{c}</main>
        </VStack>
      </VStack>
    ) : (
      <main>c</main>
    );

  const page = (c: ReactNode) => main(c);

  const Fallback = ({
    error,
    resetErrorBoundary,
    ...props
  }: FallbackProps & { error: ServerError }) => {
    return page(
      <>
      An error occured, the app is still under development !
      </>
    );
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1"
        />
        <title>{title}</title>
      </Head>

      <ErrorBoundary fallbackRender={Fallback}>{page(children)}</ErrorBoundary>
    </>
  );
};
