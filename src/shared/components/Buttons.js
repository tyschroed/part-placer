import React from "react";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";

export function PrimaryButton({ children, ...props }) {
  return (
    <Button variant="contained" color="primary" {...props}>
      {children}
    </Button>
  );
}
PrimaryButton.propTypes = { children: PropTypes.node };

export function SecondaryButton({ children, ...props }) {
  return (
    <Button variant="contained" {...props}>
      {children}
    </Button>
  );
}
SecondaryButton.propTypes = { children: PropTypes.node };
