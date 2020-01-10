import React from "react";
import PropTypes from "prop-types";
import { PaddedPaper } from "./pattern";
import { LinearProgress, Typography } from "@material-ui/core";
import styled from "styled-components";

const CenteredTypography = styled(Typography)`
  text-align: center;
`;

export default function LoadingIndicator({ children, message }) {
  return (
    <PaddedPaper>
      <LinearProgress />
      <CenteredTypography color="textPrimary" variant="h4">
        {message || children}
      </CenteredTypography>
    </PaddedPaper>
  );
}

LoadingIndicator.propTypes = {
  children: PropTypes.node,
  message: PropTypes.string
};
