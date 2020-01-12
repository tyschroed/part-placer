import React, { useEffect, useState } from "react";
import { Grid, Portal, Button, Fade, Hidden } from "@material-ui/core";
import { useStore } from "../../shared/components/Store";
import styled from "styled-components";
import { navigate } from "@reach/router";
import dimensionsParser from "../../shared/utils/dimensionsParser";
import Material from "./components/Material";
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from "workerize-loader!./worker";
import {
  RouterLink,
  VerticallyCenteredContainer
} from "../../shared/components/pattern";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PrintIcon from "@material-ui/icons/Print";
import PropTypes from "prop-types";
import { Form, Formik } from "formik";
import DimensionField from "../../shared/components/DimensionField";
import ActionBar from "../../shared/components/ActionBar";
import LoadingIndicator from "../../shared/components/LoadingIndicator";
import {
  PrimaryButton,
  SecondaryButton
} from "../../shared/components/Buttons";
import { useAnalytics } from "../../shared/components/Analytics";

const KerfEntry = styled(DimensionField)`
  width: 100px;
  margin-left: 20px;
  margin-right: 10px;
`;

function KerfForm({ onChange, value }) {
  return (
    <Formik
      initialValues={{ value }}
      onSubmit={(values, { setSubmitting }) => {
        onChange(values.value);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <VerticallyCenteredContainer>
            <KerfEntry
              showHelperText={false}
              margin="dense"
              name="value"
              variant="standard"
              label="Blade Kerf"
            />

            <SecondaryButton disabled={isSubmitting} type="submit">
              Update <Hidden xsDown>Kerf</Hidden>
            </SecondaryButton>
          </VerticallyCenteredContainer>
        </Form>
      )}
    </Formik>
  );
}
KerfForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};

function Layout({ headerRef }) {
  const { state } = useStore();
  const [layouts, setLayouts] = useState(null);
  const [kerfSize, setKerfSize] = useState('1/8"');
  const { pageview, event } = useAnalytics();
  const handleKerfChange = newKerf => {
    setKerfSize(newKerf);
    event({ category: "Layout", action: "Kerf Changed" });
  };
  useEffect(() => {
    if (state.materials.length === 0) {
      navigate("/");
    } else {
      pageview("/layout");
    }
  }, [state.materials, pageview]);

  useEffect(() => {
    const MULTIPLIER = 1000;
    const convertedKerfSize = dimensionsParser(kerfSize) * MULTIPLIER;
    const convertAndScaleDimension = dimension =>
      Math.ceil(dimensionsParser(dimension) * MULTIPLIER);

    Promise.all(
      state.materials.map(async material => {
        let instance = worker();
        const inputs = {
          ...material,
          width: convertAndScaleDimension(material.dimensions.width),
          height: convertAndScaleDimension(material.dimensions.height),
          convertedParts: material.parts.reduce((acc, part) => {
            const convertedPart = {
              name: part.name,
              id: part.id,
              dimensions: part.dimensions,
              height: convertAndScaleDimension(part.dimensions.height),
              width: convertAndScaleDimension(part.dimensions.width)
            };
            for (let i = 0; i < part.quantity; i++) {
              acc.push({ ...convertedPart, instanceNumber: i + 1 });
            }
            return acc;
          }, [])
        };
        inputs.bins = await instance.pack(
          {
            binHeight: inputs.height,
            binWidth: inputs.width,
            items: inputs.convertedParts
          },
          { kerfSize: convertedKerfSize }
        );
        return inputs;
      })
    ).then(transformedMaterials => {
      event({ category: "Layout", action: "Layout Generated" });
      setLayouts(transformedMaterials);
    });
  }, [state.materials, kerfSize, event]);

  return (
    <Grid container spacing={3}>
      <Portal container={headerRef.current}>
        <Fade in>
          <RouterLink to="/">
            <Button size="small" variant="contained">
              <ArrowBackIcon />
              Parts <Hidden xsDown>Configuration</Hidden>
            </Button>
          </RouterLink>
        </Fade>
      </Portal>

      {layouts ? (
        <>
          <Grid item xs={12}>
            <ActionBar>
              <PrimaryButton onClick={() => window.print()}>
                <PrintIcon />
                &nbsp;Print
              </PrimaryButton>
              <KerfForm onChange={handleKerfChange} value={kerfSize} />
            </ActionBar>
          </Grid>
          {layouts.map(material => (
            <Grid key={material.id} item xs={12} lg={6}>
              <Material material={material} />
            </Grid>
          ))}
        </>
      ) : (
        <Grid item xs={12}>
          <LoadingIndicator message="Calculating layouts" />
        </Grid>
      )}
    </Grid>
  );
}

Layout.propTypes = {
  headerRef: PropTypes.shape({ current: PropTypes.any }).isRequired
};

export default Layout;
