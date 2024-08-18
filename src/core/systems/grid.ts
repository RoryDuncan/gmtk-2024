import { Point } from "../aabb";
import { ECS, Entity } from "../ecs";

export type GridItem = {
  row: number;
  col: number;
  segments: number;
  owned_by: unknown;
  entity: Entity;
};

export type GridPosition = [number, number];

export type GridConfig = {
  row_count: number;
  col_count: number;
  size: number;
  margin: number;
  margins: number;
};

export const create_grid_system = (config?: GridConfig) => {
  let grid: GridItem[] = [];
  let iterator: GridPosition[] = [];

  let grid_rows_count: number;
  let grid_cols_count: number;
  let grid_size: number;
  let grid_margin: number;
  let total_grid_block_width: number;
  let total_grid_block_height: number;
  let margins: number;

  const recalculate = (config: GridConfig) => {
    grid_rows_count = config.row_count;
    grid_cols_count = config.col_count;
    grid_size = config.size;
    grid_margin = config.margin;
    margins = config.margins;

    [total_grid_block_width, total_grid_block_height] = get_dimensions();

    generate_grid();
  };

  const get_dimensions = (): readonly [width: number, height: number] => {
    return [
      grid_rows_count * (grid_size + grid_margin * margins),
      grid_cols_count * (grid_size + grid_margin * margins),
    ];
  };

  const get_iterator = () => iterator;

  const get_hovered_grid_item = (
    offset: Point,
    x: number,
    y: number,
  ): GridItem | undefined => {
    // offset the translation that happens
    const projection = {
      x: x - offset.x,
      y: y - offset.y,
    };

    if (projection.x < 0 || projection.y < 0) {
      return undefined;
    }

    if (
      projection.x > total_grid_block_width ||
      projection.y > total_grid_block_height
    ) {
      return undefined;
    }

    const row_index = math.floor(
      projection.x / (grid_margin * margins + grid_size),
    );
    const col_index = math.floor(
      projection.y / (grid_margin * margins + grid_size),
    );

    return grid.find(
      (item) => item.col === col_index && item.row === row_index,
    );
  };

  const calc_grid_location = (
    row_index: number,
    col_index: number,
  ): readonly [row_x: number, row_y: number] => {
    return [
      (grid_margin * margins + grid_size) * row_index,
      (grid_margin * margins + grid_size) * col_index,
    ];
  };

  const generate_grid = () => {
    grid = [];
    iterator = [];

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
        iterator.push([row_index, col_index]);

        ECS.addComponent(item.entity, {
          type: "griditem",
          row: row_index,
          col: col_index,
          is_highlighted: false,
          draw(entity_record, state) {
            let color: readonly [number, number, number] = [
              154 / 255,
              194 / 255,
              105 / 255,
            ];
            const [x, y] = calc_grid_location(item.row, item.col);

            if (entity_record.entity === state.highlighted?.entity) {
              color = [199 / 255, 232 / 255, 158 / 255];
            }

            if (is_grid_item(state.player.base, item.row, item.col)) {
              color = state.player.color;
            } else if (is_grid_item(state.enemy.base, item.row, item.col)) {
              color = state.enemy.color;
            }

            love.graphics.setColor(...color);
            // love.graphics.rectangle("fill", x, y, grid_size, grid_size);
            const radius = grid_size / 2;
            love.graphics.circle(
              "fill",
              x + radius,
              y + radius,
              grid_size / 2,
              item.segments,
            );
          },
        });
      }
    }
  };

  const is_grid_item = ([x, y]: [number, number], row: number, col: number) => {
    return x === row && y === col;
  };

  const generate_bases = (): readonly [
    player: GridPosition,
    enemy: GridPosition,
  ] => {
    const end_col = grid_cols_count - 1;
    const end_row = grid_rows_count - 1;
    const left_half = Math.round(end_row / 2);

    const player_base: GridPosition = [
      math.random(0, left_half),
      math.random(0, end_col),
    ];
    const enemy_base: GridPosition = [
      math.random(left_half, end_row),
      math.random(0, end_col),
    ];
    return [player_base, enemy_base];
  };

  if (config !== undefined) {
    recalculate(config);
  }

  return {
    get_iterator,
    is_grid_item,
    get_dimensions,
    recalculate,
    get_hovered_grid_item,
    generate_grid,
    generate_bases,
    calc_grid_location,
  };
};
