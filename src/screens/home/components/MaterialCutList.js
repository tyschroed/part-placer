import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Grid
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import PropTypes from "prop-types";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import { useStore } from "./Store";
import { Formik, Form, Field, FieldArray } from "formik";
import DimensionField from "./DimensionField";
import styled from "styled-components";
import { useSnackbar } from "notistack";

const CenteredGridItem = styled(Grid)`
    align-self: center;
`

export default function MaterialCutList({
  id,
  name,
  width,
  height,
  onEditMaterial,
  parts
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { deleteMaterial, updateParts } = useStore();
  const {enqueueSnackbar} = useSnackbar();
  const firstInput = useRef(null);
  useEffect(() => {
    if (firstInput.current) {
      //ref will refer to the full MUI field, so need to get just the input
      firstInput.current.querySelector("input").focus();
    }
  }, []);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const createPart = id => {
    return {
      name: `Part ${id}`,
      dimensions: { width: "", height: "" },
      quantity: 1,
      id
    };
  };
  let initialParts = parts.length ? parts : [createPart(1)];
  const closeOnSelect = cb => {
    return event => {
      handleClose();
      if (cb) {
        cb(event);
      }
    };
  };

  return (
    <Formik
      initialValues={{
        parts: initialParts
      }}
      onSubmit={(values, { setSubmitting }) => {
        const processedParts = values.parts.map(part => {
            return {
                ...part,
                quantity: parseInt(part.quantity, 10)
            }
        })
        updateParts(id, processedParts);
        setSubmitting(false);
        enqueueSnackbar('Changes saved', {variant : 'success'})
      }}
    >
      {({ values }) => (
        <Form>
          <FieldArray name="parts">
            {({ push, remove }) => (
              <Card>
                <CardHeader
                  title={name}
                  subheader={`${width} x ${height}`}
                  action={
                    <>
                      <IconButton title='More actions' onClick={handleClick}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="material-actions-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={closeOnSelect(onEditMaterial)}>
                          Edit Material
                        </MenuItem>
                        <ConfirmationDialog
                          title={`Delete ${name}?`}
                          message="Delete this material?"
                        >
                          {confirmDialog => (
                            <MenuItem
                              onClick={closeOnSelect(
                                confirmDialog(() => deleteMaterial(id))
                              )}
                            >
                              Delete Material
                            </MenuItem>
                          )}
                        </ConfirmationDialog>
                      </Menu>
                    </>
                  }
                />
                <CardContent>
                  <Typography variant="h5">Parts</Typography>
                  <Grid container>
                    {values.parts.map((part, index) => (
                      <Grid data-testid='part-row' key={part.id} container>
                        <Grid item xs>
                          <Field
                            innerRef={node => {
                              if (index === 0) {
                                firstInput.current = node;
                              }
                            }}
                            label="Name"
                            fullWidth
                            validate={value => (value ? null : "Required")}
                            component={TextField}
                            type="text"
                            name={`parts.${index}.name`}
                            id={`parts.${index}.name`}
                            variant="standard"
                            margin="dense"
                          />
                        </Grid>
                        <Grid item xs>
                          <DimensionField
                            name={`parts.${index}.dimensions.width`}
                            label="Width"
                            showHelperText={false}
                            variant="standard"
                            margin="dense"
                          />
                        </Grid>
                        <Grid item xs>
                          <DimensionField
                            name={`parts.${index}.dimensions.height`}
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
                            type="text"
                            name={`parts.${index}.quantity`}
                            id={`parts.${index}.quantity`}
                          />
                        </Grid>
                        <CenteredGridItem item xs={1} >
                            <IconButton data-testid="remove-part" onClick={() => {remove(index)}} aria-label="Remove this item">
                                <DeleteForeverIcon />
                            </IconButton>
                        </CenteredGridItem>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="primary" type="submit" disabled={!values.parts} >
                    Save Changes
                  </Button>
                  <Button
                    data-testid="add-part"
                    variant="contained"
                    color="primary"
                    onClick={() => push(createPart(values.parts.length + 1))}
                  >
                    Add Part
                  </Button>
                </CardActions>
              </Card>
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
