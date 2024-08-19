import { Base, LevelState } from "../../game";
import console from "../console";
import { ECS, Entity, TradeUnitComponent } from "../ecs";
import { Milliseconds, Seconds } from "../types";
import { get_direction_on_grid, random_item } from "../utils";
import { create_interval_system } from "./intervals";
import { GameTime } from "./timer";

export const create_trade_system = () => {
  let bases: Base[] = [];
  let base_lookup: Map<Entity, Base> = new Map();
  const max_trade_units = 2;
  const current_move_delay: Milliseconds = 500 / 1000;
  const spawn_rate = 1;

  const start = (_bases: Base[]) => {
    bases = _bases;
    base_lookup.clear();
    bases.forEach((base) => {
      base_lookup.set(base.entity, base);
    });
  };

  const update = (dt: number) => {
    const all_units = ECS.query("tradeunit");

    const idle_units = all_units.filter(
      (record) => record.tradeunit.target_city === undefined,
    );

    // handle units that don't have a target yet
    if (idle_units.length > 0) {
      console.log(`Handling ${idle_units.length} idle units`);
      idle_units.forEach((record) => {
        const options = bases.filter(
          (a) => a.entity !== record.tradeunit.home_city,
        );

        if (options.length === 0) {
          console.error("Available cities to trade with are depleted or 0.");
        }

        const target_city = random_item(options);

        if (target_city === undefined) {
          console.log("random_item incorrectly indexing");
        }

        record.tradeunit.target_city = target_city.entity;
      });
    }

    const log = (i: number, ...msg: any[]) => {
      if (i === 0) {
        console.log(...msg);
      }
    };

    // handle moving trade units
    all_units.forEach((record, i) => {
      const target_base = bases.find(
        (base) => base.entity === record.tradeunit.target_city,
      );

      if (target_base === undefined) {
        console.log("Missing the target_base for entity", record.tradeunit);
      } else if (target_base !== undefined) {
        const [normalized_x, normalized_y] = get_direction_on_grid(
          record.tradeunit.position,
          target_base.position,
        );

        // update move ticks
        record.tradeunit.move_delay -= dt;
        // log(i, record.tradeunit.move_delay, dt);

        if (record.tradeunit.move_delay <= 0) {
          record.tradeunit.move_delay = current_move_delay;
          // only move cardinally for now?
          if (normalized_x !== 0) {
            record.tradeunit.position = [
              record.tradeunit.position[0] + normalized_x,
              record.tradeunit.position[1],
            ];
            // console.log(
            //   `Moving ${record.entity} to ${record.tradeunit.position.join(", ")}`,
            // );
          } else if (normalized_y !== 0) {
            record.tradeunit.position = [
              record.tradeunit.position[0],
              record.tradeunit.position[1] + normalized_y,
            ];
            console.log(
              `Moving ${record.entity} to ${record.tradeunit.position.join(", ")}`,
            );
          }
        }
      }
    });
  };

  const create_trade_city = (city: Base) => {
    const interval_system = create_interval_system(spawn_rate);

    const get_units = () =>
      ECS.query("tradeunit").filter(
        (ent) => ent.tradeunit.home_city === city.entity,
      );

    interval_system.on("interval", () => {
      const trade_units = get_units();

      if (trade_units.length < max_trade_units) {
        const entity = ECS.create();

        const unit: TradeUnitComponent = {
          type: "tradeunit",
          has_goods: false,
          home_city: city.entity,
          color: city.color,
          target_city: undefined,
          position: [...city.position],
          move_delay: current_move_delay,
        };

        ECS.addComponent(entity, unit);
      }
    });

    return {
      ...interval_system,
      get_units,
    };
  };

  return {
    set_bases: start,
    create_trade_city,
    update,
  };
};
