import { Base } from "../../game";
import console from "../console";
import { ECS, Entity, SpawnUnitComponent } from "../ecs";
import { Milliseconds } from "../types";
import { create_interval_system } from "./intervals";

export const create_spawner = (
  owner: Entity,
  spawn_rate: number,
  max_spawns: number,
) => {
  const interval_system = create_interval_system(spawn_rate);
  const movement_system = create_interval_system(spawn_rate * 3);
  let units: Entity[] = [];

  interval_system.on("interval", () => {
    const spawn_entity = ECS.create();
    const component: SpawnUnitComponent = {
      type: "spawnunit",
      owned_by: owner,
      x: 0,
      y: 0,
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
