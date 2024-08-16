import { Scenes } from "../core/scene";
import { game_events } from "../game";

let state = {
  width: 0,
  height: 0,
  font_size: 20,
  line_height: 20 + 20,
};

const main_menu = Scenes.create({
  name: "Main Menu",

  enter: () => {
    const [width, height] = love.graphics.getDimensions();
    state = {
      ...state,
      width,
      height,
    };
  },

  update(dt) {
    //
  },

  keypress: (key) => {
    if (key === "return") {
      game_events.emit("start");
    }
  },

  draw() {
    // todo
    love.graphics.setBackgroundColor(0.1, 0.1, 0.1);
    love.graphics.setColor(0.4, 0.5, 0.8);
    const y_offset = 100;
    const x_offset = 100;
    love.graphics.setNewFont(state.font_size);
    love.graphics.print("Press Enter to start", x_offset, y_offset);
    love.graphics.setNewFont(state.font_size * 0.75);
    love.graphics.print("Press Escape at any time to quit the game", x_offset, y_offset + state.line_height);
  },
});

export default main_menu;
