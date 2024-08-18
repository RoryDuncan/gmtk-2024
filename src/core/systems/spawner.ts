import { Base } from "../../game";
import { ECS, Entity, SpawnUnitComponent } from "../ecs";
import { Milliseconds } from "../types";
import { create_interval_system } from "./intervals";

export const create_spawner = (spawn_rate: Milliseconds, owner: Base) => {
  let spawns: Entity[] = [];
  const interval_system = create_interval_system(spawn_rate / 1000);

  interval_system.on("interval", () => {
    const spawn_entity = ECS.create();
    const component: SpawnUnitComponent = {
      type: "spawnunit",
      owned_by: owner.entity,
      x: owner.base[0],
      y: owner.base[1],
    };

    ECS.addComponent(spawn_entity, component);
    ECS.addComponent(spawn_entity, {
      type: "draw",
      draw(entity_record) {},
    });

    spawns.push(spawn_entity);
  });

  return {
    ...interval_system,

    clear: () => {
      spawns.forEach((entity: Entity) => {
        ECS.removeComponent(entity, "spawnunit");
      });

      spawns = [];
    },
  };
};
