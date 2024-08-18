import { ECS } from "./core/ecs";
import { createSignal } from "./core/signal";
import { GridItem } from "./core/systems/grid";

export type GameEvents = {
  start: undefined;
  quit: undefined;
};

export const game_events = createSignal<GameEvents>();

export const player = ECS.create();

export type Base = {
  color: [number, number, number];
  base: [number, number];
  entity: unknown;
  spawn_rate: number;
};

export type LevelState = {
  width: number;
  height: number;
  grid_width: number;
  grid_height: number;
  player: Base;
  enemy: Base;
  offset: {
    x: number;
    y: number;
  };
  mouse: {
    x: number;
    y: number;
    dx: number;
    dy: number;
  };
  grid: {
    row_count: number;
    col_count: number;
    size: number;
    margin: number;
    margins: number;
  };
  highlighted?: GridItem;
};
