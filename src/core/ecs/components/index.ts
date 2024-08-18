import { LevelState } from "../../../game";
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

export type SpawnUnitComponent = {
  type: "spawnunit";
  x: number;
  y: number;
  owned_by: Entity;
};

export type GridItemComponent = {
  type: "griditem";
  row: number;
  col: number;
  is_highlighted: boolean;
  draw: (entity_record: ComponentRecord, state: LevelState) => void;
};
