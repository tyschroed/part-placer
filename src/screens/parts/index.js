import React, { useEffect } from "react";
import { Grid, Grow, Hidden, Fade } from "@material-ui/core";
import Material from "./components/Material";
import EditMaterial from "./components/EditMaterial";
import {
  ActionBar,
  RouterLink,
  ConfirmationDialog,
  SecondaryButton,
  PrimaryButton
} from "shared/components";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import styled from "styled-components";
import PropTypes from "prop-types";
import Welcome from "./components/Welcome";
import { useAnalytics, useStore } from "shared/context";
function CardWrapper({ children }) {
  return (
    <Grid item xs={12} sm={12} lg={6} xl={4}>
      {children}
    </Grid>
  );
}
CardWrapper.propTypes = { children: PropTypes.node.isRequired };

const PaddedButton = styled(SecondaryButton)`
  margin-left: 10px;
`;

function Parts() {
  const { state, resetState } = useStore();
  const { pageview } = useAnalytics();
  useEffect(() => {
    pageview("/");
  });
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ActionBar>
          <RouterLink to="/layout">
            <PrimaryButton disabled={state.materials.length === 0} fullWidth>
              Generate <Hidden smDown>Cutlist</Hidden>
              <ArrowForwardIcon />
            </PrimaryButton>
          </RouterLink>
          <ConfirmationDialog
            title={`Are you sure?`}
            message="Remove all materials and parts?"
          >
            {confirmDialog => (
              <Fade in={state.materials.length > 0}>
                <PaddedButton onClick={confirmDialog(() => resetState())}>
                  Reset Materials
                </PaddedButton>
              </Fade>
            )}
          </ConfirmationDialog>
        </ActionBar>
      </Grid>
      {state.showWelcome && (
        <CardWrapper>
          <Welcome />
        </CardWrapper>
      )}
      {state.materials.map(material => (
        <Grow key={material.id} in={true}>
          <CardWrapper>
            <Material
              id={material.id}
              name={material.name}
              parts={material.parts}
              width={material.dimensions.width}
              height={material.dimensions.height}
            />
          </CardWrapper>
        </Grow>
      ))}
      <CardWrapper>
        <EditMaterial />
      </CardWrapper>
    </Grid>
  );
}

export default Parts;
