import React, { Suspense } from "react";
import { Router } from "@reach/router";
import ErrorBoundary from "react-error-boundary";
import { LoadingMessage } from "./shared/components/pattern";
import Header from "./shared/components/Header";
import Helmet from "react-helmet";
import styled, { createGlobalStyle } from "styled-components";
import { StylesProvider, Container } from "@material-ui/core";
import { StoreProvider } from "./screens/home/components/Store";
import { SnackbarProvider } from "notistack";
import Footer from "./shared/components/Footer";

const GlobalStyles = createGlobalStyle`
body {
  background-color:#333;
}
#root {
  display:flex;
  min-height:100vh;
  flex-direction:column;
}
`;
const ContentContainer = styled.div`
  flex: 1;
`;

const Home = React.lazy(() => import("./screens/home"));

function ErrorFallback({ error }) {
  return (
    <>
      <p>There was an error</p>
      <pre style={{ maxWidth: 700 }}>{JSON.stringify(error, null, 2)}</pre>
    </>
  );
}
export default function App() {
  return (
    <>
      <SnackbarProvider>
        <StoreProvider>
          <StylesProvider injectFirst>
            <GlobalStyles />
            <Helmet>
              <title>Cutlist Generator</title>
            </Helmet>
            <Header />
              <ContentContainer>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Suspense
                    fallback={
                      <LoadingMessage>Loading Application</LoadingMessage>
                    }
                  >
                    <Router>
                      <Home path="/" />
                    </Router>
                  </Suspense>
                </ErrorBoundary>
              </ContentContainer>
            <Footer />
          </StylesProvider>
        </StoreProvider>
      </SnackbarProvider>
    </>
  );
}
