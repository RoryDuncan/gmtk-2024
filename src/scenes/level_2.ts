import { Box, box_intersection } from "../core/aabb";
import console from "../core/console";
import { CollisionGroup, CollisionNotifier, ComponentRecord, ECS, QueriedComponentRecord } from "../core/ecs";
import { Scenes } from "../core/scene";
import { player, zoom_in, zoom_out } from "../game";

let state = {
  width: 0,
  height: 0,
  scale: {
    x: 1,
    y: 1,
  },
};

const level_1 = Scenes.create({
  name: "Level 2",

  enter: () => {
    const [width, height] = love.graphics.getDimensions();
    state = {
      ...state,
      width,
      height,
    };

    ECS.addComponent(player, {
      type: "character",
      w: 15,
      h: 15,
      x: 100,
      y: 100,
      draw(entity_record) {
        const { character } = entity_record;

        love.graphics.setColor(0.3, 0.5, 0.8);
        love.graphics.rectangle("fill", character.x, character.y, 10, 10);
      },
    });

    const entities = [];
    for (let i = 0, ii = math.floor((width * 2) / 10); i < ii; i++) {
      const entity = ECS.create();
      entities.push(entity);

      const scale_change = (0.5 + Math.random()) * (Math.random() > 0.65 ? 1 : -1);

      ECS.addComponent(entity, {
        type: "scalechange",
        x_scale: scale_change,
        y_scale: scale_change,
        is_touching_player: false,
      });

      const color: readonly [number, number, number] = [0.25 + (Math.random() - 0.25), 0.25 + (Math.random() - 0.25), 0.25 + Math.random() - 0.25];

      ECS.addComponent(entity, {
        type: "character",
        x: i * 10,
        y: 20 + math.random() * (height - 200),
        w: 2,
        h: 2,
        draw(entity_record) {
          const { character } = entity_record;

          love.graphics.setColor(...color);
          love.graphics.rectangle("fill", character.x, character.y, character.w, character.h);
        },
      });
    }

    ECS.addComponent(zoom_in, {
      type: "scalechange",
      x_scale: 0.5,
      y_scale: 0.5,
      is_touching_player: false,
    });

    ECS.addComponent(zoom_in, {
      type: "character",
      x: 200,
      y: 200,
      w: 50,
      h: 50,
      draw(entity_record) {
        const { character } = entity_record;

        love.graphics.setColor(0.9, 0.1, 0.1);
        love.graphics.rectangle("line", character.x, character.y, character.w, character.h);
      },
    });

    ECS.addComponent(zoom_out, {
      type: "scalechange",
      x_scale: -0.5,
      y_scale: -0.5,
      is_touching_player: false,
    });

    ECS.addComponent(zoom_out, {
      type: "character",
      x: 100,
      y: 200,
      w: 50,
      h: 50,
      draw(entity_record) {
        const { character, scalechange } = entity_record;

        love.graphics.setColor(0.1, 0.5, 0.9);
        love.graphics.rectangle("line", character.x, character.y, character.w, character.h);
      },
    });
  },

  update(dt) {
    const change = { x: 0, y: 0 };
    const amount = 2;
    if (love.keyboard.isDown("left")) {
      change.x -= amount;
    }
    if (love.keyboard.isDown("right")) {
      change.x += amount;
    }
    if (love.keyboard.isDown("up")) {
      change.y -= amount;
    }
    if (love.keyboard.isDown("down")) {
      change.y += amount;
    }

    const player_components = ECS.tap<"character">(player);

    if (change.x !== 0 || change.y !== 0) {
      player_components.character.x += change.x;
      player_components.character.y += change.y;
    }

    const box: Box = player_components.character;
    const zoomers = ECS.query("scalechange", "character");
    zoomers.filter((zoomer) => {
      const box2: Box = zoomer.character;
      if (box_intersection(box, box2)) {
        if (zoomer.entity === zoom_out) {
          state.scale.x = 1;
          state.scale.y = 1;
        } else if (zoomer.entity === zoom_in) {
          state.scale.x = 2;
          state.scale.y = 2;
        } else {
          state.scale.x += zoomer.scalechange.x_scale * dt;
          state.scale.y += zoomer.scalechange.y_scale * dt;
        }
      }
    });
  },

  keypress: (key) => {},

  draw() {
    love.graphics.setBackgroundColor(0.1, 0.1, 0.1);
    love.graphics.setColor(0.4, 0.5, 0.8);

    love.graphics.scale(state.scale.x, state.scale.y);
    const drawables = ECS.query("draw");
    drawables.forEach((d) => {
      d.draw.draw(d);
    });

    const characters = ECS.query("character");
    characters.forEach((d) => {
      d.character.draw(d);
    });
  },
});

export default level_1;
