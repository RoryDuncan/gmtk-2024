import console from "../console";
import { ECS, Entity, GameTimeComponent } from "../ecs";
import {
  createSignal,
  createSignalMap,
  SignalMany,
  type Signal,
} from "../signal";
import { Milliseconds, Seconds } from "../types";
import { GameTime } from "./timer";

export type IntervalEventMap = {
  start: undefined;
  stop: undefined;
  interval: undefined;
};
export type IntervalSystem = Omit<SignalMany<IntervalEventMap>, "emit"> & {
  /**
   *
   * @param new_interval
   * @param reset Whether the next
   * @returns
   */
  set_interval: (new_interval: Seconds, reset?: boolean) => void;

  toggle: (state: boolean) => void;

  start: () => void;
  stop: () => void;
};

export const create_interval_system = (
  initial_interval?: Seconds,
): IntervalSystem => {
  let interval: Seconds = initial_interval ?? 0;
  const signal = createSignalMap<IntervalEventMap>();
  let last_emitted = GameTime.get_elapsed();
  let target_time = last_emitted + interval;

  const entity = ECS.create();

  const component: GameTimeComponent = {
    type: "gametime",
    update(elapsedTime, dt) {
      if (interval <= 0) {
        return;
      }

      if (elapsedTime >= target_time) {
        signal.emit("interval");
        last_emitted = target_time + dt;
        target_time = target_time + interval;
      }
    },
  };

  const interval_system: IntervalSystem = {
    ...signal,

    start: () => {
      interval_system.toggle(true);
      signal.emit("start");
    },
    stop: () => {
      interval_system.toggle(false);
      signal.emit("stop");
    },

    toggle: (state) => {
      if (state) {
        last_emitted = GameTime.get_elapsed();
        target_time = last_emitted + interval;
        ECS.addComponent(entity, component);
      } else {
        ECS.removeComponent(entity, "gametime");
      }
    },

    set_interval: (rate, reset = true) => {
      interval = rate;
      if (reset === true) {
        target_time = GameTime.get_elapsed() + interval;
      }
    },
  };

  return interval_system;
};
