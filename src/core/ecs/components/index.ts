import { LevelState } from "../../../game";
import { GridPosition } from "../../systems/grid";
import { Milliseconds, Seconds } from "../../types";
import type { ComponentRecord, Entity, QueriedComponentRecord } from "../ecs";

export * from "./collider";

export type GameTimeComponent = {
  type: "gametime";
  update: (elapsedTime: Seconds, dt: Milliseconds) => void;
};

export type PositionComponent = {
  type: "position";
  x: number;
  y: number;
};

export type DrawComponent = {
  type: "draw";
  draw: (entity_record: ComponentRecord) => void;
};

export type IntervalComponent = {
  type: "interval";
  spawn_rate: number;
};

export type TradeUnitComponent = {
  type: "tradeunit";
  position: GridPosition;
  home_city: Entity;
  target_city: Entity;
  has_goods: boolean;
  color: readonly [number, number, number];
  move_delay: number;
};

export type GridItemComponent = {
  type: "griditem";
  row: number;
  col: number;
  segments: number;
};
