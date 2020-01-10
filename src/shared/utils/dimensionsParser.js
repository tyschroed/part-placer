export const unitConversions = {
  in: 1,
  '"': 1,
  "“": 1, // curly quote
  "”": 1, // curly quote
  ft: 12,
  "'": 12,
  "‘": 12, // curly quote
  "’": 12, // curly quote
  m: 39.37,
  cm: 0.3937,
  mm: 0.03937
};
const dimensionRegex = new RegExp(
  `([0-9./]+)(${Object.keys(unitConversions).join("|")})`,
  "i"
);

export default dimensionValue => {
  const dimensionComponents = dimensionValue
    .split(dimensionRegex)
    .filter(p => p.trim() !== "")
    .map(p => p.toLowerCase())
    .reduce((acc, p) => {
      if (isNaN(p)) {
        if (p.indexOf("/") > 0) {
          const [numerator, denominator] = p.split("/");
          const convertedNumerator = parseFloat(numerator);
          const convertedDenominator = parseFloat(denominator);
          if (isNaN(convertedNumerator)) {
            throw new Error(`Invalid numerator ${numerator}`);
          }
          if (isNaN(convertedDenominator)) {
            throw new Error(`Invalid denominator ${denominator}`);
          }
          if (convertedDenominator === 0) {
            throw new Error(`Divide by zero error`);
          }
          const value = convertedNumerator / convertedDenominator;
          // if prev value exists, add to it . e.g. if raw value was 2 1/2", 2 will exist as a value, and we should add 1/2 to 2.
          if (acc.length > 0 && !acc[acc.length - 1].units) {
            const prev = acc[acc.length - 1];
            prev.value += value;
          } else {
            acc.push({ value, units: null });
          }
        } else {
          if (!(p in unitConversions)) {
            throw new Error(
              `Unknown unit of ${p} provided. Supported units: ${Object.keys(
                unitConversions
              ).join(",")}`
            );
          }
          if (acc.length > 0) {
            const lastValue = acc[acc.length - 1];
            if (lastValue.units) {
              throw new Error(
                `Value of ${lastValue} already has units of ${lastValue.units}`
              );
            } else {
              lastValue.units = p;
            }
          }
        }
      } else {
        acc.push({ value: parseFloat(p), units: null });
      }
      return acc;
    }, []);

  return dimensionComponents.reduce((total, { value, units }) => {
    if (!units) {
      // assume we're already in inches
      total += value;
    } else {
      total += value * unitConversions[units];
    }
    return total;
  }, 0);
};
