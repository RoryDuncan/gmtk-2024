import { Box, box_intersection, Point, point_intersection } from "../core/aabb";
import console from "../core/console";
import { CollisionGroup, CollisionNotifier, ComponentRecord, ECS, Entity, QueriedComponentRecord } from "../core/ecs";
import { Scenes } from "../core/scene";
import { createCollisionSystem } from "../core/systems/collisions";
import { create_interval_system } from "../core/systems/intervals";
import { GameTime } from "../core/systems/timer";
import { clamp } from "../core/utils";

math.randomseed(os.time());

type GridItem = {
  row: number;
  col: number;
  segments: number;
  owned_by: unknown;
  entity: Entity;
};

let state = {
  width: 0,
  height: 0,
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
  highlighted: undefined as GridItem | undefined,
};

const [grid_rows_count, grid_cols_count] = [12, 8];
const grid: GridItem[] = [];
const grid_size = 48;
const grid_margin = 1;

const margins = 1;
const total_grid_block_width = grid_rows_count * (grid_size + grid_margin * margins);
const total_grid_block_height = grid_cols_count * (grid_size + grid_margin * margins);

type Base = {
  color: [number, number, number];
  base: [number, number];
  entity: unknown;
  spawn_rate: number;
};

const player: Base = {
  color: [0.5, 0.5, 0.8],
  base: [0, 0] as [number, number],
  entity: ECS.create(),
  spawn_rate: 1,
};

const enemy: Base = {
  color: [0.8, 0.2, 0.3],
  base: [grid_rows_count, grid_cols_count] as [number, number],
  entity: ECS.create(),
  spawn_rate: 1,
};

const main_game = Scenes.create({
  name: "main_game",

  enter: () => {
    const [width, height] = love.graphics.getDimensions();
    state = {
      ...state,
      width,
      height,
      offset: {
        x: width / 2 - total_grid_block_width / 2,
        y: height / 2 - total_grid_block_height / 2,
      },
    };

    // generate grid
    generate_grid();
    generate_bases();

    const player_spawner = create_interval_system(enemy.spawn_rate);
    const enemy_spawner = create_interval_system(enemy.spawn_rate);

    player_spawner.on("interval", () => {
      console.log("Spawning unit for player");
    });

    enemy_spawner.on("interval", () => {
      console.log("Spawning unit for enemy");
    });

    GameTime.wait(1000).then(() => {
      console.log("spawners starting");
      player_spawner.start();
      enemy_spawner.start();
    });
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

      const clamp_margin = grid_size;
      state.offset.x = clamp(clamp_margin, state.offset.x, state.width - total_grid_block_width - clamp_margin);
      state.offset.y = clamp(5, state.offset.y, state.height - total_grid_block_height - clamp_margin);
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

    const item = get_hovered_grid_item(x, y);
    state.highlighted = item;

    love.mousereleased;
  },

  draw() {
    love.graphics.setBackgroundColor(0.1, 0.1, 0.1);
    love.graphics.setColor(0.4, 0.5, 0.8);

    const drawables = ECS.query("draw");
    // console.log(`there are ${drawables.length} drawables`);
    love.graphics.push();
    love.graphics.translate(state.offset.x, state.offset.y);
    drawables.forEach((d) => {
      d.draw.draw(d);
    });
    love.graphics.pop();
    love.graphics.print(`mouse: ${state.mouse.x} x ${state.mouse.y}`, state.width - 120, state.height - 20);
    love.graphics.print(`offset: ${state.offset.x} x ${state.offset.y}`, state.width - 240, state.height - 20);
    if (state.highlighted) {
      love.graphics.print(`item: ${state.highlighted.row}, ${state.highlighted.col}`, 20, state.height - 20);
    }
  },
});

function get_hovered_grid_item(x: number, y: number) {
  // offset the translation that happens
  const projection = {
    x: x - state.offset.x,
    y: y - state.offset.y,
  };

  if (projection.x < 0 || projection.y < 0) {
    return undefined;
  }

  if (projection.x > total_grid_block_width || projection.y > total_grid_block_height) {
    return undefined;
  }

  const row_index = math.floor(projection.x / (grid_margin * margins + grid_size));
  const col_index = math.floor(projection.y / (grid_margin * margins + grid_size));

  return grid.find((item) => item.col === col_index && item.row === row_index);

  // const box: Box = {
  //   x: state.offset.x,
  //   y: state.offset.y,
  //   w: state.offset.x + total_grid_block_width,
  //   h: state.offset.y + total_grid_block_height,
  // };

  // const point: Point = { x, y };
  // if (point_intersection(point, box)) {

  // }
}

function calc_grid_location(row_index: number, col_index: number): readonly [row_x: number, row_y: number] {
  return [(grid_margin * margins + grid_size) * row_index, (grid_margin * margins + grid_size) * col_index];
}

function generate_grid() {
  for (let row_index = 0; row_index < grid_rows_count; row_index++) {
    for (let col_index = 0; col_index < grid_cols_count; col_index++) {
      const item: GridItem = {
        row: row_index,
        col: col_index,
        segments: 5 + Math.floor(Math.random() * 3),
        owned_by: null,
        entity: ECS.create(),
      };

      grid.push(item);

      ECS.addComponent(item.entity, {
        type: "draw",
        draw(entity_record) {
          let color: readonly [number, number, number] = [154 / 255, 194 / 255, 105 / 255];
          const [x, y] = calc_grid_location(item.row, item.col);

          if (entity_record.entity === state.highlighted?.entity) {
            color = [199 / 255, 232 / 255, 158 / 255];
          }

          if (is_grid_item(player.base, item.row, item.col)) {
            color = player.color;
          } else if (is_grid_item(enemy.base, item.row, item.col)) {
            color = enemy.color;
          }

          love.graphics.setColor(...color);
          // love.graphics.rectangle("fill", x, y, grid_size, grid_size);
          const radius = grid_size / 2;
          love.graphics.circle("fill", x + radius, y + radius, grid_size / 2, item.segments);
        },
      });
    }
  }
}

function generate_bases() {
  const end_col = grid_cols_count - 1;
  const end_row = grid_rows_count - 1;
  const left_half = Math.round(end_row / 2);

  player.base = [math.random(0, left_half), math.random(0, end_col)];
  enemy.base = [math.random(left_half, end_row), math.random(0, end_col)];
}

function is_grid_item([x, y]: [number, number], row: number, col: number) {
  return x === row && y === col;
}

export default main_game;
