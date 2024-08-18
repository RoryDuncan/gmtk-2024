import { Box, box_intersection, Point, point_intersection } from "../core/aabb";
import console from "../core/console";
import {
  CollisionGroup,
  CollisionNotifier,
  ComponentRecord,
  ECS,
  Entity,
  QueriedComponentRecord,
} from "../core/ecs";
import { Scenes } from "../core/scene";

import { create_grid_system, GridConfig, GridItem } from "../core/systems/grid";
import { create_interval_system } from "../core/systems/intervals";
import { create_spawner } from "../core/systems/spawner";
import { GameTime } from "../core/systems/timer";
import { clamp } from "../core/utils";
import { Base, LevelState } from "../game";

math.randomseed(os.time());

let state: LevelState = {
  width: 0,
  height: 0,
  grid_width: 0,
  grid_height: 0,
  player: {
    color: [0.5, 0.5, 0.8],
    base: [0, 0],
    entity: ECS.create(),
    spawn_rate: 1,
  },
  enemy: {
    color: [0.8, 0.2, 0.3],
    base: [0, 0] as [number, number],
    entity: ECS.create(),
    spawn_rate: 1,
  },
  offset: {
    x: 0,
    y: 0,
  },
  mouse: {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
  },
  grid: {
    row_count: 12,
    col_count: 8,
    size: 48,
    margin: 1,
    margins: 1,
  },
  highlighted: undefined,
};

const grid_system = create_grid_system();

function draw_bg() {
  love.graphics.setBackgroundColor(0.1, 0.1, 0.1);
  love.graphics.setColor(0.4, 0.5, 0.8);
}

function draw_ui() {
  love.graphics.setColor(0.2, 0.6, 0.6);

  love.graphics.print(
    `mouse: ${state.mouse.x} x ${state.mouse.y}`,
    state.width - 120,
    state.height - 20,
  );
  love.graphics.print(
    `offset: ${state.offset.x} x ${state.offset.y}`,
    state.width - 240,
    state.height - 20,
  );
  if (state.highlighted) {
    love.graphics.print(
      `item: ${state.highlighted.row}, ${state.highlighted.col}`,
      20,
      state.height - 20,
    );
  }
}

const main_game = Scenes.create({
  name: "main_game",

  enter: () => {
    const [width, height] = love.graphics.getDimensions();

    grid_system.recalculate(state.grid);
    const [grid_width, grid_height] = grid_system.get_dimensions();
    [state.player.base, state.enemy.base] = grid_system.generate_bases();

    state = {
      ...state,
      width,
      height,
      grid_width,
      grid_height,
      offset: {
        x: width / 2 - grid_width / 2,
        y: height / 2 - grid_height / 2,
      },
    };

    const player_spawner = create_spawner(state.player);
    const enemy_spawner = create_spawner(state.enemy);

    // player_spawner.on("interval", () => {
    //   console.log("Spawning unit for player");
    // });

    // enemy_spawner.on("interval", () => {
    //   console.log("Spawning unit for enemy");
    // });

    // GameTime.wait(1000).then(() => {
    //   console.log("spawners starting");
    //   player_spawner.start();
    //   enemy_spawner.start();
    // });
  },

  update(dt) {
    const change = { x: 0, y: 0 };
    const amount = 10;
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

    if (change.x !== 0 || change.y !== 0) {
      state.offset.x += change.x;
      state.offset.y += change.y;

      const clamp_margin = state.grid.size;
      state.offset.x = clamp(
        clamp_margin,
        state.offset.x,
        state.width - state.grid_width - clamp_margin,
      );
      state.offset.y = clamp(
        5,
        state.offset.y,
        state.height - state.grid_height - clamp_margin,
      );
    }
  },

  keypressed: (key) => {},
  mousemoved: (x, y, dx, dy, istouch) => {
    state.mouse = {
      x,
      y,
      dx,
      dy,
    };

    const item = grid_system.get_hovered_grid_item(state.offset, x, y);
    state.highlighted = item;
  },

  draw() {
    draw_bg();

    const grid_layer = ECS.query("griditem");
    const drawables = ECS.query("draw");

    love.graphics.push();
    love.graphics.translate(state.offset.x, state.offset.y);

    grid_layer.forEach((d) => d.griditem.draw(d, state));
    drawables.forEach((d) => d.draw.draw(d));

    love.graphics.pop();
    draw_ui();
  },
});

export default main_game;
