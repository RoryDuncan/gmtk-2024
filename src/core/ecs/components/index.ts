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

export type CharacterComponent = {
  type: "character";
  draw: (entity_record: ComponentRecord & QueriedComponentRecord<"character">) => void;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type VelocityComponent = {
  type: "velocity";
  dx: number;
  dy: number;
};

export type ShootComponent = {
  type: "shoot";
  shoot: () => void;
};

export type DrawComponent = {
  type: "draw";
  draw: (entity_record: ComponentRecord) => void;
};

export type ScaleChangeComponent = {
  type: "scalechange";
  x_scale: number;
  y_scale: number;
  is_touching_player: boolean;
};
