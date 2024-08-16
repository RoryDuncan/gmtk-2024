import console from "../core/console";
import { Scenes } from "../core/scene";
import { game_events } from "../game";

let state = {
  width: 0,
  height: 0,
  window: {
    x: 0,
    y: 0,
    display: 0,
    width: 0,
    height: 0,
  },
};

function move_window_like_character() {}

const level_1 = Scenes.create({
  name: "Level 1",

  enter: () => {
    console.log("Entering Level 1");
    const [width, height] = love.graphics.getDimensions();
    state = {
      ...state,
      width,
      height,
    };

    const [x, y, display] = love.window.getPosition();

    state.window.x = x;
    state.window.y = y;
    state.window.width = width;
    state.window.height = height;
    state.window.display = display;
  },

  update(dt) {
    // const [safe_x, safe_y, width, height] = love.window.getSafeArea();
    // console.log("window:", state.window.x, state.window.y);
    love.window.setTitle(`GMTK 2024: ${state.window.x}, ${state.window.y}`);

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
      state.window.x += Math.round(change.x);
      state.window.y += Math.round(change.y);
      love.window.setPosition(state.window.x, state.window.y, state.window.display);
    }
  },

  keypress: (key) => {},

  draw() {
    love.graphics.setBackgroundColor(0.1, 0.1, 0.1);
    love.graphics.setColor(0.4, 0.5, 0.8);
    // todo
  },
});

export default level_1;
