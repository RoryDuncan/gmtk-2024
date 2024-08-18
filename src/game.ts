import { ECS, Entity } from "./core/ecs";
import { createSignal, createSignalMap } from "./core/signal";
import { GridItem, GridPosition } from "./core/systems/grid";

export type GameEvents = {
  start: undefined;
  quit: undefined;
};

export const game_events = createSignalMap<GameEvents>();

export const player = ECS.create();

export type Base = {
  color: readonly [number, number, number];
  position: GridPosition;
  entity: Entity;
  units: Entity[];
};

export type Player = {
  entity: Entity;
  spawn_rate: number;
};

export type LevelState = {
  width: number;
  height: number;
  grid_width: number;
  grid_height: number;
  player: Player;
  bases: Base[];
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
