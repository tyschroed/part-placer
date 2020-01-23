import React from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";
import getPartColor from "../colors";
import StopRoundedIcon from "@material-ui/icons/StopRounded";
import { VerticallyCenteredContainer } from "shared/components/pattern";

export default function PartsSummary({ parts }) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Part</TableCell>
          <TableCell>Dimensions</TableCell>
          <TableCell>Quantity</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {parts.map(part => (
          <TableRow key={part.id} data-testid="part-row">
            <TableCell>
              <VerticallyCenteredContainer>
                <StopRoundedIcon htmlColor={getPartColor(part.id).fill} />
                <span>{part.name}</span>
              </VerticallyCenteredContainer>
            </TableCell>
            <TableCell>
              {part.dimensions.width} x {part.dimensions.height}
            </TableCell>
            <TableCell>{part.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

PartsSummary.propTypes = {
  parts: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
};
