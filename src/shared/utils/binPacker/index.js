import GetSplitImplementation, { SPLIT_STRATEGIES } from "./splitStrategies";
import GetSelectionImplementation, {
  SELECTION_STRATEGIES
} from "./selectionStrategies";
import GetSortImplementation, { SORT_STRATEGIES } from "./sortStrategies";
import debugLib from "debug";
const debug = debugLib("binPacker");
export { SORT_STRATEGIES, SPLIT_STRATEGIES, SELECTION_STRATEGIES };

export default function BinPacker(
  { binHeight, binWidth, items },
  {
    selectionStrategy = null,
    splitStrategy = null,
    sortStrategy = null,
    kerfSize = 0,
    allowRotation = true
  } = {}
) {
  return Object.keys(SELECTION_STRATEGIES)
    .filter(s => selectionStrategy === null || s === selectionStrategy)
    .reduce((merged, selectionStrategy) => {
      Object.keys(SPLIT_STRATEGIES)
        .filter(s => splitStrategy === null || s === splitStrategy)
        .forEach(splitStrategy => {
          Object.keys(SORT_STRATEGIES)
            .filter(s => sortStrategy === null || s === sortStrategy)
            .forEach(sortStrategy => {
              merged.push({
                splitStrategy,
                selectionStrategy,
                sortStrategy,
                sortOrder: "asc"
              });
              merged.push({
                splitStrategy,
                selectionStrategy,
                sortStrategy,
                sortOrder: "desc"
              });
            });
        });
      return merged;
    }, [])
    .map(({ splitStrategy, selectionStrategy, sortStrategy, sortOrder }) =>
      PackStrategy({
        binWidth,
        binHeight,
        items,
        splitStrategy,
        selectionStrategy,
        sortStrategy,
        sortOrder,
        kerfSize,
        allowRotation
      })
    )
    .reduce((bestCompressed, packResult) => {
      const {
        splitStrategy,
        sortStrategy,
        selectionStrategy,
        sortOrder,
        packedItems
      } = packResult;
      debug(
        `Result for split strategy: ${splitStrategy}, selection strategy: ${selectionStrategy}, sortStrategy: ${sortStrategy}, sortOrder: ${sortOrder} - ${packedItems.length} bin(s)`
      );
      if (!bestCompressed || packedItems.length < bestCompressed) {
        return packedItems;
      } else {
        return bestCompressed;
      }
    }, null);
}

function PackStrategy({
  binHeight,
  binWidth,
  items,
  selectionStrategy,
  splitStrategy,
  sortStrategy,
  sortOrder,
  kerfSize,
  allowRotation
} = {}) {
  debug(
    `Executing! split strategy: ${splitStrategy}, selection strategy: ${selectionStrategy}, sortStrategy: ${sortStrategy}, sortOrder: ${sortOrder}`
  );
  let binCount = 0;
  const freeRectangles = [];

  const createBin = () => {
    binCount++;
    freeRectangles.push({
      width: binWidth,
      height: binHeight,
      x: 0,
      y: 0,
      bin: binCount,
      id: "root"
    });
  };
  const splitFunction = GetSplitImplementation(splitStrategy);
  const selectionFunction = GetSelectionImplementation(selectionStrategy);
  const sortFunction = GetSortImplementation(sortStrategy, sortOrder);

  const sortedItems = [...items].sort(sortFunction);

  const rotateItem = item => {
    return { ...item, height: item.width, width: item.height };
  };

  const splitRectangle = ({ rectangle, item }) => {
    return splitFunction(rectangle, item, kerfSize).filter(
      r => r.width !== 0 && r.height !== 0
    );
  };

  const getSelectionOption = item => {
    const rectangle = selectionFunction(freeRectangles, item);
    if (!rectangle) {
      return null;
    }
    const splitRectangles = splitRectangle({ rectangle, item });
    return {
      rectangle,
      splitRectangles,
      item
    };
  };

  const selectRectangleOption = item => {
    const originalOption = getSelectionOption(item);
    let rotatedOption = null;
    let rotatedItem;
    if (allowRotation) {
      rotatedItem = rotateItem(item);
      rotatedOption = getSelectionOption(rotatedItem);
    }
    if (originalOption === null && rotatedOption === null) {
      debug(`No free rectangles found for`, item);
      return null;
    } else if (originalOption === null) {
      debug(`Original item didn't fit, using rotated`, item);
      return rotatedOption;
    } else if (rotatedOption === null) {
      debug(`Rotated item didn't fit, using original option`, item);
      return originalOption;
    } else {
      const getBiggestSplitRectangle = ({ splitRectangles }) =>
        Math.max(...splitRectangles.map(split => split.height * split.width));

      const originalMax = getBiggestSplitRectangle(originalOption);
      const rotatedMax = getBiggestSplitRectangle(rotatedOption);
      debug(`Original max area ${originalMax}, rotated max area ${rotatedMax}`);
      if (
        getBiggestSplitRectangle(originalOption) >=
        getBiggestSplitRectangle(rotatedOption)
      ) {
        debug(`Going with original placement option`);
        return originalOption;
      } else {
        debug(`Going with rotated placement option`);
        return rotatedOption;
      }
    }
  };

  const packedItems = sortedItems
    .map((item, idx) => {
      debug("packing item", item);
      let selectedOption = selectRectangleOption(item);
      if (!selectedOption) {
        createBin();
        selectedOption = selectRectangleOption(item);
      }
      if (!selectedOption) {
        throw new Error(
          `item at index ${idx} with dimensions ${item.width}x${item.height} exceeds bin dimensions of ${binWidth}x${binHeight}`
        );
      }
      const { rectangle, splitRectangles } = selectedOption;
      debug("selected rectangle", rectangle);
      const { width, height, ...otherItemProps } = selectedOption.item;
      const packedItem = {
        item: otherItemProps,
        width,
        height,
        x: rectangle.x,
        y: rectangle.y,
        bin: rectangle.bin
      };
      debug("packed item", packedItem);
      freeRectangles.splice(rectangle.index, 1, ...splitRectangles);
      debug("free rectangles post split", freeRectangles);
      return packedItem;
    })
    .reduce((bins, item) => {
      if (bins.length >= item.bin) {
        bins[item.bin - 1].push(item);
      } else {
        bins.push([item]);
      }
      return bins;
    }, []);

  return {
    sortStrategy,
    sortOrder,
    packedItems,
    splitStrategy,
    selectionStrategy
  };
}
