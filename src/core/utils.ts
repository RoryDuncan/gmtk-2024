export const clamp = (min: number, current: number, max: number): number => {
  return Math.min(Math.max(current, min), max);
};

export const random_rgb = (): readonly [number, number, number] => {
  return [math.random(), math.random(), math.random()];
};
