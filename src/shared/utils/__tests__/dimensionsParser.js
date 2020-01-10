import dimensionsParser, { unitConversions } from "../dimensionsParser";

const CM_TO_INCHES = 2.54;

test("parse feet to inches", () => {
  const result = dimensionsParser("1'");
  expect(result).toBe(12);
});

test("assume default dimension of inches", () => {
  const result = dimensionsParser("1");
  expect(result).toBe(1);
});

test("disregard whitespace between parts", () => {
  const result = dimensionsParser("1'6\"");
  expect(result).toBe(18);
});
test("fractions should convert", () => {
  const result = dimensionsParser("1 1/2'");
  expect(result).toBe(18);
});

test("mix of units with fractions should convert", () => {
  const result = dimensionsParser("1' 1/2\"");
  expect(result).toBe(12.5);
});

test("allow whitespace between parts", () => {
  const result = dimensionsParser("1' 6\"");
  expect(result).toBe(18);
});

test("convert centimeters to inches", () => {
  const result = dimensionsParser("4cm");
  expect(result).toBe(4 * unitConversions.cm);
});

test("convert meters to inches", () => {
  const result = dimensionsParser("4m");
  expect(result).toBe(4 * unitConversions.m);
});

test("Allow curly quotes", () => {
  const result = dimensionsParser("1‘ 6“");
  expect(result).toBe(18);
});

test("invalid unit should throw", () => {
  const invalidDimension = () => {
    dimensionsParser("4lol");
  };
  expect(invalidDimension).toThrow("Unknown unit");
});
