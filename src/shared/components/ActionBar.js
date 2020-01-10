import React from "react";
import { PaddedPaper, VerticallyCenteredContainer } from "./pattern";
import { Typography, Hidden } from "@material-ui/core";
import styled from "styled-components";
import PropTypes from "prop-types";

const ActionHeading = styled(Typography)`
  display: inline-block;
  margin-right: 10px;
`;

export default function ActionBar({ children }) {
  return (
    <PaddedPaper className="pp-action-bar" paddingamount={10}>
      <VerticallyCenteredContainer>
        <Hidden smDown>
          <ActionHeading variant="h6">Actions:</ActionHeading>
        </Hidden>
        {children}
      </VerticallyCenteredContainer>
    </PaddedPaper>
  );
}

ActionBar.propTypes = { children: PropTypes.node };
