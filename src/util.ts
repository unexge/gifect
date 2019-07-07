export const mapToRange = (
  x: number,
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number,
): number => ((x - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;
