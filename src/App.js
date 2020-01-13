import React, { Suspense, useRef, useEffect, useState } from "react";
import { Router, navigate } from "@reach/router";
import Header from "./shared/components/Header";
import { createGlobalStyle } from "styled-components";
import { StylesProvider } from "@material-ui/core";
import { StoreProvider } from "./shared/context/Store";
import { AnalyticsProvider } from "./shared/context/Analytics";
import LoadingIndicator from "./shared/components/LoadingIndicator";
import { SnackbarProvider } from "notistack";
import PropTypes from "prop-types";
import SentryCapturingErrorBoundary from "./SentryCapturingErrorBoundary";

const GlobalStyles = createGlobalStyle`
body {
  background-color:#333;
  overflow-x:hidden;
}
@media print {
  .MuiAppBar-root {
    display: none;
  }
  .pp-action-bar {
    display: none;
  }
}
`;

const Parts = React.lazy(() => import("./screens/parts"));
const Layout = React.lazy(() => import("./screens/layout"));
const About = React.lazy(() => import("./screens/about"));

function ErrorFallback({ error }) {
  return (
    <>
      <p>There was an error</p>
      <pre style={{ maxWidth: 700 }}>{JSON.stringify(error, null, 2)}</pre>
    </>
  );
}
ErrorFallback.propTypes = { error: PropTypes.object.isRequired };

function atou(b64) {
  return decodeURIComponent(escape(atob(b64)));
}

export default function App() {
  const headerRef = useRef();
  let initialState;
  var urlParams = new URLSearchParams(window.location.search);
  const serializedState = urlParams.get("share");
  if (serializedState) {
    initialState = { ...JSON.parse(atou(serializedState)), shared: true };
  }

  const [sharedState] = useState(initialState);

  useEffect(() => {
    if (initialState) {
      navigate("/");
    }
  }, [initialState]);

  return (
    <>
      <SnackbarProvider>
        <StoreProvider value={sharedState}>
          <AnalyticsProvider>
            <StylesProvider injectFirst>
              <GlobalStyles />
              <Header ref={headerRef} />
              <SentryCapturingErrorBoundary>
                <Suspense
                  fallback={<LoadingIndicator message="Loading Application" />}
                >
                  <Router>
                    <Parts path="/" />
                    <Layout headerRef={headerRef} path="/layout" />
                    <About path="/about" />
                  </Router>
                </Suspense>
              </SentryCapturingErrorBoundary>
            </StylesProvider>
          </AnalyticsProvider>
        </StoreProvider>
      </SnackbarProvider>
    </>
  );
}
