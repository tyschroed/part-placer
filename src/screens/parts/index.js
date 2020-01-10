import React from "react";
import { Grid, Grow, Hidden, Fade } from "@material-ui/core";
import Material from "./components/Material";
import EditMaterial from "./components/EditMaterial";
import { useStore } from "../../shared/components/Store";
import ActionBar from "../../shared/components/ActionBar";
import { RouterLink } from "../../shared/components/pattern";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ConfirmationDialog from "../../shared/components/ConfirmationDialog";
import {
  SecondaryButton,
  PrimaryButton
} from "../../shared/components/Buttons";
import styled from "styled-components";
import PropTypes from "prop-types";
import Welcome from "./components/Welcome";

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
