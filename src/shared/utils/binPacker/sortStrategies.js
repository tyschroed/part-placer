// implementations based off of http://pds25.egloos.com/pds/201504/21/98/RectangleBinPack.pdf

const area = rectangle => rectangle.height * rectangle.width;
const perimeter = rectangle => rectangle.height * 2 + rectangle.width * 2;

const sides = rectangle => ({
  short: Math.min(rectangle.width, rectangle.height),
  long: Math.max(rectangle.width, rectangle.height)
});

const sortImplementations = {
  Area: (a, b) => {
    return area(a) < area(b) ? -1 : 1;
  },
  ShortSide: (a, b) => {
    const aSides = sides(a);
    const bSides = sides(b);

    if (aSides.short === bSides.short) {
      return aSides.long < bSides.long ? -1 : 1;
    } else {
      return aSides.short < bSides.short ? -1 : 1;
    }
  },
  LongSide: (a, b) => {
    const aSides = sides(a);
    const bSides = sides(b);

    if (aSides.long === bSides.long) {
      return aSides.short < bSides.short ? -1 : 1;
    } else {
      return aSides.long < bSides.long ? -1 : 1;
    }
  },
  Perimeter: (a, b) => {
    return perimeter(a) < perimeter(b) ? -1 : 1;
  },
  Differences: (a, b) => {
    return Math.abs(a.width - a.height) < Math.abs(b.width - b.height) ? -1 : 1;
  },
  Ratio: (a, b) => {
    return a.width / a.height < b.width / b.height ? -1 : 1;
  }
};

export const SORT_STRATEGIES = Object.keys(sortImplementations).reduce(
  (acc, imp) => {
    acc[imp] = imp;
    return acc;
  },
  {}
);

export default function GetSplitImplementation(strategy, order = "asc") {
  switch (order) {
    case "asc":
      return sortImplementations[strategy];
    case "desc":
      return (a, b) => sortImplementations[strategy](a, b) * -1;
    default:
      throw new Error(`Unknown sort order ${order}, expected 'asc' or 'desc'.`);
  }
}
