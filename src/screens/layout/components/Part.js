import React from "react";
import getPartColor from "../colors";
import PropTypes from "prop-types";

const labelFont = "Arial";
const labelFontSize = 1000;
// padding applied between edges of part label and box
const labelPadding = 4;

const renderedTextSize = string => {
  var svgNS = "http://www.w3.org/2000/svg";
  const el = document.createElementNS(svgNS, "text");
  const sizingContainer = document.createElementNS(svgNS, "svg");
  document.querySelector("body").append(sizingContainer);
  el.setAttributeNS(null, "font-family", labelFont);
  el.setAttributeNS(null, "font-size", labelFontSize);
  const textNode = document.createTextNode(string);
  el.appendChild(textNode);
  sizingContainer.appendChild(el);
  var bBox = el.getBBox();
  el.remove();
  sizingContainer.remove();
  return {
    width: bBox.width + labelPadding,
    height: bBox.height + labelPadding
  };
};

export default function Part({ part }) {
  const getTextAlignment = part => {
    const transformations = [];
    const alignment = {
      x: part.x + part.width / 2,
      y: part.y + part.height / 2,
      transform: null
    };
    const textSize = renderedTextSize(part.item.name);
    const rotate = () => {
      transformations.push(`rotate(-90, ${alignment.x}, ${alignment.y})`);
    };
    const scale = factor => {
      let xTranslated = (1 - factor) * alignment.x;
      let yTranslated = (1 - factor) * alignment.y;
      transformations.push(`translate(${xTranslated}, ${yTranslated})`);
      transformations.push(`scale(${factor})`);
    };
    const percentDiff = (textValue, containerValue) =>
      (textValue - containerValue) / textValue;

    const widthPercentOff = Math.max(
      percentDiff(textSize.width, part.width),
      percentDiff(textSize.height, part.height)
    );
    const rotatedPercentOff = Math.max(
      percentDiff(textSize.width, part.height),
      percentDiff(textSize.height, part.width)
    );
    // if rotating requires less scaling do that, otherwise just scale horizontally to fit
    if (rotatedPercentOff < widthPercentOff) {
      rotate();
      scale(1 - rotatedPercentOff, "y");
    } else {
      scale(1 - widthPercentOff);
    }
    if (transformations.length) {
      alignment.transform = transformations.join(" ");
    }
    return alignment;
  };
  const color = getPartColor(part.item.id);
  return (
    <g>
      <rect
        fill={color.fill}
        x={part.x}
        y={part.y}
        stroke={color.stroke}
        width={part.width}
        height={part.height}
      />
      <text
        {...getTextAlignment(part)}
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily={labelFont}
        fontSize={labelFontSize}
        fill={color.text}
      >
        {part.item.name}
      </text>
    </g>
  );
}
export const partPropType = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired
  }).isRequired
}).isRequired;

Part.propTypes = {
  part: partPropType
};
