import React from "react";
import styled from "styled-components";
import { Link } from "@reach/router";
import { Paper, Button } from "@material-ui/core";
import PropTypes from "prop-types";

export const Text = styled.span`
  font-family: Arial, Helvetica, sans-serif;
`;

export const RouterLink = styled(Link)`
  text-decoration: none;
`;

export const VerticallyCenteredContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const PaddedPaper = styled(Paper)`
  padding: ${props => props.paddingamount || 20}px;
`;

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
