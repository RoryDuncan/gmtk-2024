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

import { create_trade_system } from "../core/systems/trade";
import { clamp, random_rgb } from "../core/utils";
import type { Base, LevelState } from "../game";

math.randomseed(os.time());

let state: LevelState = {
  width: 0,
  height: 0,
  grid_width: 0,
  grid_height: 0,
  player: {
    // color: [0.5, 0.5, 0.8],
    // base: [0, 0],
    entity: ECS.create(),
    spawn_rate: 1.5,
  },
  bases: [],
  // enemy: {
  //   color: [0.8, 0.2, 0.3],
  //   base: [0, 0] as [number, number],
  //   entity: ECS.create(),
  //   spawn_rate: 1,
  // },
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

let stop_trade_systems: (() => void)[] = [];

const grid_system = create_grid_system();
const trade_system = create_trade_system();

function draw_bg() {
  love.graphics.setBackgroundColor(0.1, 0.1, 0.1);
  love.graphics.setColor(0.4, 0.5, 0.8);
}

function draw_ui() {
  love.graphics.setColor(0.2, 0.6, 0.6);

  love.graphics.print(
    `${ECS.query("tradeunit").length} units`,
    state.width - 120,
    0,
  );

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

function generate_bases(count: number) {
  state.bases = [];

  const base_locations = new Set<string>();
  while (base_locations.size < count) {
    const grid_position = grid_system.generate_random_position();

    const [x, y] = grid_position;

    const key = `${x}${y}`;

    if (!base_locations.has(key)) {
      console.log("Generating base at ", grid_position);
      base_locations.add(key);
      state.bases.push({
        color: random_rgb(),
        entity: ECS.create(),
        position: grid_position,
        units: [],
      });
    }
  }

  base_locations.clear();
}

const restart_trade = (max_bases: number = 2) => {
  if (stop_trade_systems.length > 0) {
    stop_trade_systems.forEach((cb) => cb());
  }

  generate_bases(max_bases);
  trade_system.set_bases(state.bases);
  stop_trade_systems = state.bases.map((city) => {
    const city_trader = trade_system.create_trade_city(city);
    city_trader.start();
    return () => city_trader.stop();
  });
};

const main_game = Scenes.create({
  name: "main_game",

  enter: () => {
    const [width, height] = love.graphics.getDimensions();

    grid_system.recalculate(state.grid);
    const [grid_width, grid_height] = grid_system.get_dimensions();

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

    restart_trade(3);
  },

  update(dt) {
    trade_system.update(dt);

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

  keypressed: (key) => {
    // for testing
    // if (key === "=") {
    //   console.log("restarting trade with more bases");
    //   restart_trade(state.bases.length + 1);
    // } else if (key === "-" && state.bases.length > 2) {
    //   console.log("restarting trade with less bases");
    //   restart_trade(state.bases.length - 1);
    // }
  },
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
    // const bases = ECS.query("base");
    const tradeunits = ECS.query("tradeunit");

    love.graphics.push();
    love.graphics.translate(state.offset.x, state.offset.y);

    grid_layer.forEach((item) => {
      let color: readonly [number, number, number] = [
        154 / 255,
        194 / 255,
        105 / 255,
      ];
      const [x, y] = grid_system.calc_grid_location(
        item.griditem.row,
        item.griditem.col,
      );

      if (item.entity === state.highlighted?.entity) {
        color = [199 / 255, 232 / 255, 158 / 255];
      }

      // if (is_grid_item(state.player.base, item.row, item.col)) {
      //   color = state.player.color;
      // } else if (is_grid_item(state.enemy.base, item.row, item.col)) {
      //   color = state.enemy.color;
      // }

      love.graphics.setColor(...color);
      love.graphics.rectangle("fill", x, y, state.grid.size, state.grid.size);
      // const radius = state.grid.size / 2;
      // love.graphics.circle(
      //   "fill",
      //   x + radius,
      //   y + radius,
      //   state.grid.size / 2,
      //   item.griditem.segments,
      // );
    });

    state.bases.forEach((base) => {
      const [x, y, size] = grid_system.calc_grid_location(...base.position);
      love.graphics.setColor(...base.color);
      love.graphics.rectangle("fill", x, y, size, size);
    });

    tradeunits.forEach((trade_unit) => {
      love.graphics.setColor(...trade_unit.tradeunit.color);
      const [x, y] = grid_system.calc_grid_location(
        ...trade_unit.tradeunit.position,
      );
      love.graphics.circle(
        "fill",
        x + state.grid.size / 2,
        y + state.grid.size / 2,
        3,
      );
    });

    drawables.forEach((d) => d.draw.draw(d));

    // const player_units = units.filter(
    //   (unit) => unit.spawnunit.owned_by === state.player.entity,
    // );
    // const enemy_units = units.filter(
    //   (unit) => unit.spawnunit.owned_by === state.enemy.entity,
    // );

    // grid_system.get_iterator().forEach(([grid_x, grid_y]) => {
    //   const player_on_tile = player_units.filter(
    //     (unit) => unit.spawnunit.x === grid_x && unit.spawnunit.y === grid_y,
    //   );
    //   const enemy_on_tile = enemy_units.filter(
    //     (unit) => unit.spawnunit.x === grid_x && unit.spawnunit.y === grid_y,
    //   );
    //   const [x, y] = grid_system.calc_grid_location(grid_x, grid_y);

    //   love.graphics.setColor(...state.enemy.color);
    //   enemy_on_tile.forEach((unit, i) => {
    //     // todo: wrap row around
    //     love.graphics.rectangle(
    //       "fill",
    //       x + i * 5,
    //       state.grid.size + y - 10,
    //       4,
    //       4,
    //     );
    //   });

    //   love.graphics.setColor(...state.player.color);
    //   player_on_tile.forEach((unit, i) => {
    //     love.graphics.rectangle("fill", x + i * 5, y + 10, 4, 4);
    //   });
    // });

    love.graphics.pop();
    draw_ui();
  },
});

export default main_game;
