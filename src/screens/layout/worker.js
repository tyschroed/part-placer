import binPacker from "../../shared/utils/binPacker";

export function pack({ binHeight, binWidth, items }, { kerfSize }) {
  return binPacker(
    {
      binHeight,
      binWidth,
      items
    },
    { kerfSize }
  );
}
