import { ComponentType, ECS, Entity } from "../ecs";
import { create_interval_system } from "./intervals";

export const create_spawner = (
  spawn_rate: number,
  on_spawn_attempt: (entity: Entity) => ComponentType | undefined,
  on_spawn_cleanup: () => void,
) => {
  let units: Entity[] = [];
  const interval_system = create_interval_system(spawn_rate);

  interval_system.on("interval", () => {
    const spawn_entity = ECS.create();
    const component = on_spawn_attempt(spawn_entity);

    if (component === undefined) {
      return;
    }

    ECS.addComponent(spawn_entity, component);
    units.push(spawn_entity);
  });

  return {
    ...interval_system,
    clear: () => {
      on_spawn_cleanup();
      units = [];
    },
  };
};
