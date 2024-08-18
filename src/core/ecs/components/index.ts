import { Milliseconds, Seconds } from "../../types";
import type { ComponentRecord, QueriedComponentRecord } from "../ecs";

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
  type: "spawn";
};
