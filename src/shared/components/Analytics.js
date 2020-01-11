import React from "react";
import ReactGA from "react-ga";

const AnalyticsContext = React.createContext();

export function AnalyticsProvider(props) {
  let enabled = false;
  if (process.env.REACT_APP_ENABLE_ANALYTICS) {
    enabled = true;
    ReactGA.initialize(process.env.REACT_APP_ANALYTICS_TRACKING_ID);
  }

  return (
    <AnalyticsContext.Provider
      value={{ reactGA: ReactGA, enabled }}
      {...props}
    />
  );
}

export function useAnalytics() {
  const { reactGA, enabled } = React.useContext(AnalyticsContext);
  if (!reactGA) {
    throw new Error("useAnalytics must be called with a AnalyticsProvider");
  }

  return {
    pageview: page => enabled && reactGA.pageview(page),
    event: ({ category, action }) =>
      enabled && reactGA.event({ category, action })
  };
}
