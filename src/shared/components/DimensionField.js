import React from "react";
import { Field } from "formik";
import { TextField } from "formik-material-ui";
import { ParseDimension } from "parse-dimension";
import PropTypes from "prop-types";

export default function DimensionField({
  name,
  showHelperText = true,
  label,
  ...props
}) {
  const validate = value => {
    let error;
    if (!value) {
      error = "Required";
    } else {
      try {
        ParseDimension(value);
      } catch (err) {
        error = "Invalid dimension";
      }
    }
    return error;
  };
  return (
    <Field
      label={label}
      variant="filled"
      component={TextField}
      type="text"
      fullWidth
      name={name}
      validate={validate}
      helperText={showHelperText ? `e.g. 4'10", 11cm` : null}
      {...props}
    />
  );
}

DimensionField.propTypes = {
  name: PropTypes.string,
  showHelperText: PropTypes.bool,
  label: PropTypes.string
};
