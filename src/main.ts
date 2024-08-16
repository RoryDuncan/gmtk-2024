import { Scenes } from "./core/scene";

import console from "./core/console";
import { GameTime } from "./core/systems/timer";
import main_menu from "./scenes/main_menu";
import { game_events } from "./game";
import level_1 from "./scenes/level_1";

love.load = () => {
  console.log("Loading!");
  Scenes.switch(main_menu);

  game_events.on("quit", () => {
    love.event.quit();
  });

  game_events.on("start", () => {
    console.log("Switching to level 1");
    Scenes.switch(level_1);
  });
};

love.update = (dt: number) => {
  GameTime.update(dt);
  Scenes.update(dt);
};

love.keypressed = (key: string) => {
  console.log("keypress", key);
  Scenes.keypress(key);

  if (key === "escape") {
    console.log("quiting");
    game_events.emit("quit");
  }
};

love.draw = () => {
  Scenes.draw();
  love.graphics.setColor(1, 1, 0, 1);
};

// love.conf = (config) => {
//   print("hello?");
//   console.log("oy?");
//   config.console = true;
//   config.window.title = "GMTK 2024";
// };
