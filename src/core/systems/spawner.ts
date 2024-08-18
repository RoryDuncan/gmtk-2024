import { Base } from "../../game";
import console from "../console";
import { ECS, Entity, SpawnUnitComponent } from "../ecs";
import { Milliseconds } from "../types";
import { create_interval_system } from "./intervals";

export const create_spawner = (owner: Base) => {
  const interval_system = create_interval_system(owner.spawn_rate);
  // const movement_system = create_interval_system(owner.spawn_rate / 500);
  let units: Entity[] = [];

  // movement_system.on("interval", () => {
  //   const components = ECS.query("spawnunit");
  //   components.forEach((c) => {
  //     // c.spawnunit.x += 1;
  //   });
  // });

  interval_system.on("interval", () => {
    console.log(
      "spawning unit for",
      owner.entity,
      "every",
      owner.spawn_rate,
      "seconds",
    );
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

    clear: () => {
      units.forEach((entity) => ECS.removeComponent(entity, "spawnunit"));
      units = [];
    },
  };
};
