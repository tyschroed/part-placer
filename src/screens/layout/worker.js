import binPacker from "../../shared/utils/binPacker";

export function pack(
  { binHeight, binWidth, items },
  { kerfSize, allowRotation }
) {
  return binPacker(
    {
      binHeight,
      binWidth,
      items
    },
    { kerfSize, allowRotation }
  );
}
