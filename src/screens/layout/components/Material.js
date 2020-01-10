import React from "react";
import PropTypes from "prop-types";
import { CardHeader, Card, CardContent, Typography } from "@material-ui/core";
import PartsSummary from "./PartsSummary";
import MaterialLayout from "./MaterialLayout";
import styled from "styled-components";

const TopPaddedHeader = styled(Typography)`
  margin-top: 10px;
`;

export default function Material({ material }) {
  return (
    <Card>
      <CardHeader
        title={material.name}
        subheader={`${material.bins.length} needed`}
      />
      <CardContent>
        <Typography variant="h6">Parts Summary</Typography>
        <PartsSummary parts={material.parts} />
        <TopPaddedHeader variant="h6">Parts Layout</TopPaddedHeader>
        <MaterialLayout
          width={material.width}
          height={material.height}
          bins={material.bins}
          name={material.name}
        />
      </CardContent>
    </Card>
  );
}

Material.propTypes = {
  material: PropTypes.shape({
    parts: PropTypes.array.isRequired,
    bins: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired
};
