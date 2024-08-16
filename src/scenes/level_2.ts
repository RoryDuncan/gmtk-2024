import console from "../core/console";
import { Scenes } from "../core/scene";

let state = {
  width: 0,
  height: 0,
};

function move_window_like_character() {}

const level_1 = Scenes.create({
  name: "Level 2",

  enter: () => {
    console.log("Entering Level 1");
    const [width, height] = love.graphics.getDimensions();
    state = {
      ...state,
      width,
      height,
    };
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
