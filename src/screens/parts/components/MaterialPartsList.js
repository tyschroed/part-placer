import React, { useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Grid
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import PropTypes from "prop-types";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import { useStore } from "../../../shared/context/Store";
import { Formik, Form, Field, FieldArray } from "formik";
import DimensionField from "../../../shared/components/DimensionField";
import {
  SecondaryButton,
  PrimaryButton
} from "../../../shared/components/Buttons";
import styled from "styled-components";
import { useSnackbar } from "notistack";
import dimensionsParser from "../../../shared/utils/dimensionsParser";

const CenteredGridItem = styled(Grid)`
  align-self: center;
`;

const DenseCard = styled(Card)`
  & .MuiCardContent-root {
    padding-top: 0px;
  }
`;

export default function MaterialCutList({
  id,
  name,
  width,
  height,
  onEditMaterial,
  parts
}) {
  const { deleteMaterial, updateParts } = useStore();
  const { enqueueSnackbar } = useSnackbar();
  const firstInput = useRef(null);
  useEffect(() => {
    if (firstInput.current) {
      //ref will refer to the full MUI field, so need to get just the input
      firstInput.current.querySelector("input").focus();
    }
  }, []);
  const createPart = id => {
    return {
      name: `Part ${id}`,
      dimensions: { width: "", height: "" },
      quantity: 1,
      id,
      isNew: true
    };
  };
  let initialTouched;
  let initialParts = parts;
  if (!parts.length) {
    initialParts = [createPart(1)];
    initialTouched = {
      parts: [
        {
          name: true
        }
      ]
    };
  }

  return (
    <Formik
      initialValues={{
        parts: initialParts
      }}
      initialTouched={initialTouched}
      validate={values => {
        const errors = { parts: [] };
        let hasErrors = false;
        const materialDimensions = [
          dimensionsParser(width),
          dimensionsParser(height)
        ];
        const materialShortSide = Math.min(...materialDimensions);
        const materialLongSide = Math.max(...materialDimensions);
        values.parts.forEach((part, idx) => {
          errors.parts.push({});
          const partDimensions = [
            dimensionsParser(part.dimensions.width),
            dimensionsParser(part.dimensions.height)
          ];
          const shortSide = Math.min(...partDimensions);
          const longSide = Math.max(...partDimensions);
          if (shortSide > materialShortSide || longSide > materialLongSide) {
            hasErrors = true;
            errors.parts[idx] = {
              dimensions: {
                width: "Exceeds material dimensions",
                height: "Exceeds material dimensions"
              }
            };
          }
        });
        return hasErrors ? errors : undefined;
      }}
      onSubmit={(values, { setSubmitting, resetForm, setFieldTouched }) => {
        const processedParts = values.parts.map(part => {
          return {
            ...part,
            quantity: parseInt(part.quantity, 10)
          };
        });
        updateParts(id, processedParts);
        setSubmitting(false);
        resetForm({ values });
        setFieldTouched("parts", false);
        enqueueSnackbar("Changes saved", { variant: "success" });
      }}
    >
      {({ values, dirty, touched }) => (
        <Form>
          <FieldArray name="parts">
            {({ push, remove }) => (
              <DenseCard>
                <CardHeader
                  title={name}
                  subheader={`${width} x ${height}`}
                  action={
                    <>
                      <IconButton
                        title="Edit Material"
                        onClick={onEditMaterial}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <ConfirmationDialog
                        title={`Delete ${name}?`}
                        message="Delete this material?"
                      >
                        {confirmDialog => (
                          <IconButton
                            title="Delete Material"
                            onClick={confirmDialog(() => deleteMaterial(id))}
                            size="small"
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        )}
                      </ConfirmationDialog>
                    </>
                  }
                />
                <CardContent>
                  <Typography variant="h5">Parts</Typography>
                  <Grid container>
                    {values.parts.map((part, index) => (
                      <Grid data-testid="part-row" key={part.id} container>
                        <Grid style={{ minWidth: "130px" }} item xs>
                          <Field
                            innerRef={node => {
                              if (index === 0 && part.isNew) {
                                firstInput.current = node;
                              }
                            }}
                            label="Name"
                            fullWidth
                            validate={value => (value ? null : "Required")}
                            component={TextField}
                            type="text"
                            name={`parts.${index}.name`}
                            id={`${id}.parts.${index}.name`}
                            variant="standard"
                            margin="dense"
                          />
                        </Grid>
                        <Grid item xs>
                          <DimensionField
                            name={`parts.${index}.dimensions.width`}
                            id={`${id}.parts.${index}.dimensions.width`}
                            label="Width"
                            showHelperText={false}
                            variant="standard"
                            margin="dense"
                          />
                        </Grid>
                        <Grid item xs>
                          <DimensionField
                            name={`parts.${index}.dimensions.height`}
                            id={`${id}.parts.${index}.dimensions.height`}
                            showHelperText={false}
                            label="Height"
                            variant="standard"
                            margin="dense"
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <Field
                            label="Qty"
                            fullWidth
                            type="number"
                            validate={value => {
                              let errorMessage;
                              const number = parseInt(value, 0);
                              if (isNaN(number) || number <= 0) {
                                errorMessage = "Number Required";
                              }
                              return errorMessage;
                            }}
                            variant="standard"
                            margin="dense"
                            component={TextField}
                            name={`parts.${index}.quantity`}
                            id={`${id}.parts.${index}.quantity`}
                          />
                        </Grid>
                        <CenteredGridItem item xs={1}>
                          <IconButton
                            data-testid="remove-part"
                            onClick={() => {
                              remove(index);
                            }}
                            aria-label="Remove this item"
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </CenteredGridItem>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
                <CardActions>
                  <PrimaryButton
                    type="submit"
                    fullWidth
                    disabled={!dirty && !touched.parts}
                  >
                    Save Changes
                  </PrimaryButton>
                  <SecondaryButton
                    fullWidth
                    data-testid="add-part"
                    onClick={() => push(createPart(values.parts.length + 1))}
                  >
                    Add Part
                  </SecondaryButton>
                </CardActions>
              </DenseCard>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  );
}
MaterialCutList.propTypes = {
  name: PropTypes.string.isRequired,
  remove: PropTypes.func,
  width: PropTypes.string,
  height: PropTypes.string,
  parts: PropTypes.array,
  onEditMaterial: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired
};
