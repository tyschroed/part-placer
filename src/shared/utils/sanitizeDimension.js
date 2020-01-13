export default function sanitizeDimension(dimension) {
  return dimension
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/‘/g, "'")
    .replace(/’/g, "'");
}
