import React, { Component } from "react";
import * as Sentry from "@sentry/browser";
import PropTypes from "prop-types";
import { PrimaryButton } from "./shared/components/Buttons";

class SentryCapturingErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { eventId: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
  }

  render() {
    if (this.state.hasError) {
      //render fallback UI
      return (
        <PrimaryButton
          onClick={() =>
            Sentry.showReportDialog({ eventId: this.state.eventId })
          }
        >
          Report feedback
        </PrimaryButton>
      );
    }

    //when there's not an error, render children untouched
    return this.props.children;
  }
}

SentryCapturingErrorBoundary.propTypes = {
  children: PropTypes.node
};

export default SentryCapturingErrorBoundary;
