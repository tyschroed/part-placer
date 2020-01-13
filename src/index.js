import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import * as Sentry from "@sentry/browser";

window.env = process.env;
if (process.env.REACT_APP_SENTRY_RELEASE) {
  Sentry.init({
    dsn: "https://b78fcee4986a4f269690bcd801daf5ff@sentry.io/1880175",
    release: process.env.REACT_APP_SENTRY_RELEASE,
    environment: process.env.NODE_ENV
  });
}

window.installPrompt = undefined;
window.addEventListener("beforeinstallprompt", e => {
  window.installPrompt = e;
});

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
