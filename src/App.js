import React, { Suspense } from "react";
import { Router } from "@reach/router";
import ErrorBoundary from "react-error-boundary";
import { LoadingMessage } from "./shared/components/pattern";
import Header from "./shared/components/Header";
import Helmet from "react-helmet";
import { createGlobalStyle } from "styled-components";
import { StylesProvider } from "@material-ui/core";
import { StoreProvider } from "./screens/home/components/Store";
import {SnackbarProvider} from 'notistack';

const GlobalStyles = createGlobalStyle`
body {
  background-color:#333;
}
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
    <div>
      <SnackbarProvider>
        <StoreProvider>
          <StylesProvider injectFirst>
            <GlobalStyles />
            <Helmet>
              <title>Cutlist Generator</title>
            </Helmet>
            <Header />
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense
                fallback={<LoadingMessage>Loading Application</LoadingMessage>}
              >
                <Router>
                  <Home path="/" />
                </Router>
              </Suspense>
            </ErrorBoundary>
          </StylesProvider>
        </StoreProvider>
      </SnackbarProvider>
    </div>
  );
}
