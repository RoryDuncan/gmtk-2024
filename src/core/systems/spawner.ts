import { ECS, Entity } from "../ecs";
import { Milliseconds } from "../types";
import { create_interval_system } from "./intervals";

export const create_spawner = (spawn_rate: Milliseconds, owned_by: Entity) => {
  let spawns = [];
  const interval_system = create_interval_system(spawn_rate / 1000);

  interval_system.on("interval", () => {
    const spawn_entity = ECS.create();
    const component = {};
    spawns.push(spawn_entity);
  });

  return {
    ...interval_system,

    clear: () => {},
  };
};
