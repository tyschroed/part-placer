import React from "react";
import Part, { partPropType } from "./Part";
import { Grid } from "@material-ui/core";
import { materialColor } from "../colors";
import PropTypes from "prop-types";

export default function MaterialLayout({ bins, width, height }) {
  return (
    <>
      {bins.map((bin, index) => (
        <Grid key={index} item xs={12}>
          <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
            <rect width={width} height={height} fill={materialColor}></rect>
            {bin.map(part => (
              <Part
                key={`${part.item.id}-${part.item.instanceNumber}`}
                part={part}
              />
            ))}
          </svg>
        </Grid>
      ))}
    </>
  );
}

MaterialLayout.propTypes = {
  bins: PropTypes.arrayOf(PropTypes.arrayOf(partPropType).isRequired)
    .isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};
