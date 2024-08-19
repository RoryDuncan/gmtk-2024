import console from "./console";
import { GridPosition } from "./systems/grid";

export const clamp = (min: number, current: number, max: number): number => {
  return Math.min(Math.max(current, min), max);
};

export const random_rgb = (): readonly [number, number, number] => {
  return [math.random(), math.random(), math.random()];
};

export const random_item = <T>(list: T[]): (typeof list)[number] => {
  if (list.length === 1) {
    return list[0];
  } else {
    const index = Math.floor(math.random(0, list.length - 1));
    if (list[index] === undefined) {
      console.log("Generated index", index, "of", list.length);
    }
    return list[index];
  }
};

export const get_distance_on_grid = (
  current: GridPosition,
  target: GridPosition,
): GridPosition => {
  const [current_x, current_y] = current;
  const [target_x, target_y] = target;

  // Calculate the difference in x and y
  const dx = target_x - current_x;
  const dy = target_y - current_y;

  return [dx, dy];
};

export const get_direction_on_grid = (
  current: GridPosition,
  target: GridPosition,
): GridPosition => {
  const [dx, dy] = get_distance_on_grid(current, target);

  // Normalize the direction to -1, 0, or 1
  const direction_x = dx === 0 ? 0 : dx > 0 ? 1 : -1;
  const direction_y = dy === 0 ? 0 : dy > 0 ? 1 : -1;

  return [direction_x, direction_y];
};
