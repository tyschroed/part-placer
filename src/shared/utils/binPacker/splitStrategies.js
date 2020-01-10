import debugLib from "debug";
const debug = debugLib("binPacker");

// implementations based off of http://pds25.egloos.com/pds/201504/21/98/RectangleBinPack.pdf

const splitRectangle = rectangle => ({ ...rectangle, splitFrom: rectangle.id });
const split_horizontally = (rectangle, item, kerfSize) => {
  debug(`splitting ${rectangle.id} horizontally`);
  const rectangle1 = {
    ...splitRectangle(rectangle),
    x: rectangle.x + item.width + kerfSize,
    width: rectangle.width - item.width - kerfSize,
    height: item.height,
    id: "sh-r1"
  };
  const rectangle2 = {
    ...splitRectangle(rectangle),
    y: rectangle.y + item.height + kerfSize,
    height: rectangle.height - item.height - kerfSize,
    id: "sh-r2"
  };

  return [rectangle1, rectangle2];
};

const split_vertically = (rectangle, item, kerfSize) => {
  debug(`splitting ${rectangle.id} vertically`);
  const rectangle1 = {
    ...splitRectangle(rectangle),
    y: rectangle.y + item.height + kerfSize,
    width: item.width,
    height: rectangle.height - item.height - kerfSize,
    id: "sh-r1"
  };
  const rectangle2 = {
    ...splitRectangle(rectangle),
    x: rectangle.x + item.width + kerfSize,
    y: rectangle.y,
    width: rectangle.width - item.width - kerfSize,
    id: "sh-r2"
  };
  return [rectangle1, rectangle2];
};

const splitImplementations = {
  SAS: (rectangle, item, kerfSize) => {
    if (rectangle.width < rectangle.height) {
      return split_horizontally(rectangle, item, kerfSize);
    } else {
      return split_vertically(rectangle, item, kerfSize);
    }
  },
  LAS: (rectangle, item, kerfSize) => {
    if (rectangle.width > rectangle.height) {
      return split_horizontally(rectangle, item, kerfSize);
    } else {
      return split_vertically(rectangle, item, kerfSize);
    }
  },
  SLAS: (rectangle, item, kerfSize) => {
    if (rectangle.width - item.width < rectangle.height - item.height) {
      return split_horizontally(rectangle, item, kerfSize);
    } else {
      return split_vertically(rectangle, item, kerfSize);
    }
  },
  LLAS: (rectangle, item, kerfSize) => {
    if (rectangle.width - item.width >= rectangle.height - item.height) {
      return split_horizontally(rectangle, item, kerfSize);
    } else {
      return split_vertically(rectangle, item, kerfSize);
    }
  }
};

export const SPLIT_STRATEGIES = Object.keys(splitImplementations).reduce(
  (acc, imp) => {
    acc[imp] = imp;
    return acc;
  },
  {}
);

export default function GetSplitImplementation(strategy) {
  return splitImplementations[strategy];
}
