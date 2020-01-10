const selectionImplementations = {
  BEST_SHORT_SIDE_FIT: (freeRectangles, itemToPlace) => {
    const { width, height } = itemToPlace;
    const [rect] = freeRectangles
      .map((freeRect, rectIndex) => ({
        shortSideLeftover: Math.min(
          freeRect.width - width,
          freeRect.height - height
        ),
        rectangleIndex: rectIndex
      }))
      .filter(r => r.shortSideLeftover >= 0)
      .sort((a, b) => (a.shortSideLeftover > b.shortSideLeftover ? 1 : -1));
    if (!rect) {
      return null;
    }
    return {
      ...freeRectangles[rect.rectangleIndex],
      index: rect.rectangleIndex
    };
  },
  BEST_LONG_SIDE_FIT: (freeRectangles, itemToPlace) => {
    const { width, height } = itemToPlace;
    const [rect] = freeRectangles
      .map((freeRect, rectIndex) => ({
        longSideLeftover: Math.max(
          freeRect.width - width,
          freeRect.height - height
        ),
        rectangleIndex: rectIndex
      }))
      .filter(r => r.longSideLeftover >= 0)
      .sort((a, b) => (a.longSideLeftover > b.longSideLeftover ? 1 : -1));
    if (!rect) {
      return null;
    }
    return {
      ...freeRectangles[rect.rectangleIndex],
      index: rect.rectangleIndex
    };
  },
  BEST_AREA_FIT: (freeRectangles, itemToPlace) => {
    const [rect] = freeRectangles
      .map((freeRect, rectIndex) => ({
        fits:
          freeRect.width >= itemToPlace.width &&
          freeRect.height >= itemToPlace.height,
        area: freeRect.width * freeRect.height,
        rectangleIndex: rectIndex
      }))
      .filter(r => r.fits)
      .sort((a, b) => (a.area > b.area ? 1 : -1));
    if (!rect) {
      return null;
    }
    return {
      ...freeRectangles[rect.rectangleIndex],
      index: rect.rectangleIndex
    };
  }
};

export const SELECTION_STRATEGIES = Object.keys(
  selectionImplementations
).reduce((acc, imp) => {
  acc[imp] = imp;
  return acc;
}, {});

export default function GetSelectionImplementation(strategy) {
  return selectionImplementations[strategy];
}
