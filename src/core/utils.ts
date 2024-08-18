export const clamp = (min: number, current: number, max: number): number => {
  return Math.min(Math.max(current, min), max);
};
