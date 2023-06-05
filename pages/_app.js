import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import "../styles/globals.css";
import MainLayout from "../src/components/main-layout";
import { ClerkProvider } from "@clerk/nextjs";
import { UserProvider } from "@/src/components/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache({
  key: "css",
  prepend: true,
});

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, plan } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ClerkProvider>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <UserProvider>
            <MainLayout>
              <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
              </QueryClientProvider>
            </MainLayout>
          </UserProvider>
        </ThemeProvider>
      </ClerkProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
