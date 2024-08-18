import { Base } from "../../game";
import console from "../console";
import { ECS, Entity, SpawnUnitComponent } from "../ecs";
import { Milliseconds } from "../types";
import { create_interval_system } from "./intervals";

export const create_spawner = (owner: Base) => {
  const interval_system = create_interval_system(owner.spawn_rate);
  const movement_system = create_interval_system(owner.spawn_rate * 3);
  let units: Entity[] = [];

  movement_system.on("interval", () => {
    const components = ECS.query("spawnunit");
    components.forEach((c) => {
      const change = math.random() >= 0.5 ? 1 : -1;
      if (math.random() > 0.5) {
        c.spawnunit.x += change;
      } else {
        c.spawnunit.y += change;
      }
    });
  });

  interval_system.on("interval", () => {
    const spawn_entity = ECS.create();
    const component: SpawnUnitComponent = {
      type: "spawnunit",
      owned_by: owner.entity,
      x: owner.base[0],
      y: owner.base[1],
    };

    ECS.addComponent(spawn_entity, component);

    units.push(spawn_entity);
  });

  return {
    ...interval_system,

    start: () => {
      movement_system.start();
      interval_system.start();
    },

    stop: () => {
      movement_system.stop();
      interval_system.stop();
    },

    clear: () => {
      units.forEach((entity) => ECS.removeComponent(entity, "spawnunit"));
      units = [];
    },
  };
};
