import { ECS } from "./core/ecs";
import { createSignal } from "./core/signal";

export type GameEvents = {
  start: undefined;
  quit: undefined;
};

export const game_events = createSignal<GameEvents>();

export const player = ECS.create();
