import { Scenes } from "../core/scene";
import { game_events } from "../game";

let state = {
  width: 0,
  height: 0,
};

const level_1 = Scenes.create({
  name: "Level 1",

  enter: () => {
    const [width, height] = love.graphics.getDimensions();
    state = {
      ...state,
      width,
      height,
    };
  },

  update(dt) {},

  keypress: (key) => {},

  draw() {
    // todo
  },
});

export default level_1;
