import React from "react";
import { Field } from "formik";
import { TextField } from "formik-material-ui";
import dimensionsParser from "../../../shared/utils/dimensionsParser";

export default function DimensionField({ name, showHelperText=true, label, ...props }) {
  const validate = (value) => {
    let error;
    if(!value) {
      error = 'Required';
    } else {
      try {
        dimensionsParser(value);
      } catch(err) {
          error = 'Invalid dimension'
      }
    }
    return error;
  }
  return (
      <Field
        label={label}
        variant="filled"
        component={TextField}
        type="text"
        name={name}
        validate={validate}
        id={`dimension-${name}`}
        helperText={showHelperText ? `e.g. 4'10", 11cm` : null}
        {...props}
      />
  );
}
