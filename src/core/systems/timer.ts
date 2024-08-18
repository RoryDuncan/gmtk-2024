import console from "../console";
import { ECS, type EntityComponentManager } from "../ecs/index";
import type { Milliseconds, Seconds } from "../types";

export type GameTimer = {
  get_elapsed: () => Milliseconds;
  update: (dt: Milliseconds) => void;
  wait: (time: Milliseconds) => Promise<void>;
  create_throttle: (
    time: Milliseconds,
    callback: CallableFunction,
  ) => readonly [execute: CallableFunction, cancel: CallableFunction];
};

type PendingTimer = {
  time: Milliseconds;
  start: Milliseconds;
  target: Milliseconds;
  resolve: () => void;
};

let elapsedTime: Seconds = 0;
let timers: PendingTimer[] = [];

export const GameTime: GameTimer = {
  get_elapsed: () => elapsedTime,

  update(dt) {
    elapsedTime += dt;

    if (timers.length > 0) {
      timers = timers.filter((timer) => {
        if (elapsedTime >= timer.target) {
          timer.resolve();
          return false;
        }
        return true;
      });
    }

    const items = ECS.query("gametime");

    items.forEach((item) => item.gametime.update(elapsedTime, dt));
  },

  wait: async (time) => {
    const seconds = time / 1000;
    const start = elapsedTime;
    const target = start + seconds;

    if (target <= start) {
      return Promise.resolve();
    }

    await new Promise<void>((resolve) => {
      timers.push({
        time,
        start,
        target,
        resolve,
      });
    });
  },

  create_throttle: (time, callback) => {
    const seconds = time / 1000;
    let last_called = elapsedTime;
    const execute = () => {};
    const cancel = () => {};
    return [execute, cancel];
  },
};
