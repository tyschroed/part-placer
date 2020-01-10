import * as muiColors from "@material-ui/core/colors";

const excludedColors = ["blueGrey", "red", "brown", "grey", "common"];
const colors = Object.entries(muiColors)
  .filter(([key]) => !excludedColors.includes(key))
  .map(([, values]) => values);

export const materialColor = muiColors.blueGrey[200];

export default function getPartColor(partId) {
  const color = colors[partId - 1];
  return {
    fill: color[200],
    text: color[900],
    stroke: "#444444"
  };
}
