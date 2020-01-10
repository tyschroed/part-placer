import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import ReactGA from "react-ga";

if (process.env.REACT_APP_ENABLE_ANALYTICS) {
  ReactGA.initialize(process.env.REACT_APP_ANALYTICS_TRACKING_ID);
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
