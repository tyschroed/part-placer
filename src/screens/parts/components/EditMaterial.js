import React from "react";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import DimensionField from "../../../shared/components/DimensionField";
import { PrimaryButton } from "../../../shared/components/Buttons";
import {
  CardContent,
  Card,
  makeStyles,
  Grid,
  CardActions
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useStore } from "../../../shared/components/Store";

const useStyles = makeStyles({
  field: {
    marginBottom: 10
  }
});

export default function EditMaterial({
  onEditComplete = () => {},
  id,
  width = "8'",
  height = "4'",
  name = ""
}) {
  const classes = useStyles();
  const { materialChanged } = useStore();
  const validate = form => {
    const errors = {};
    if (!form.name) {
      errors.name = "Material name is required.";
    }
    return errors;
  };
  return (
    <Formik
      initialValues={{ id, name, dimensions: { width, height } }}
      validate={validate}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        materialChanged(values);
        setSubmitting(false);
        onEditComplete();
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form style={{ width: "100%" }}>
          <Card style={{ width: "100%" }}>
            <CardContent>
              <Field
                label="Material Name"
                fullWidth
                variant="filled"
                component={TextField}
                className={classes.field}
                type="text"
                name="name"
                id={`${id}-material-name`}
              />
              <Grid container>
                <Grid item xs>
                  <DimensionField
                    name="dimensions.width"
                    className={classes.field}
                    label="Width"
                    id={`${id}-material-width`}
                  />
                </Grid>
                &nbsp;
                <Grid item xs>
                  <DimensionField
                    name="dimensions.height"
                    id={`${id}-material-height`}
                    label="Height"
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <PrimaryButton
                data-testid="create-material"
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {id ? "Update Material" : "Create Material"}
              </PrimaryButton>
            </CardActions>
          </Card>
        </Form>
      )}
    </Formik>
  );
}

EditMaterial.propTypes = {
  onMaterialChange: PropTypes.func,
  onEditComplete: PropTypes.func,
  width: PropTypes.string,
  height: PropTypes.string,
  id: PropTypes.number,
  name: PropTypes.string
};
