import { Scenes } from "./core/scene";

import console from "./core/console";
import { GameTime } from "./core/systems/timer";
import main_menu from "./scenes/main_menu";
import { game_events } from "./game";
import level_1 from "./scenes/level_1";
import level_2 from "./scenes/level_2";

love.load = () => {
  Scenes.switch(level_2);

  game_events.on("quit", () => {
    love.event.quit();
  });

  game_events.on("start", () => {
    Scenes.switch(level_2);
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
    game_events.emit("quit");
  }
};

love.draw = () => {
  Scenes.draw();
  love.graphics.setColor(1, 1, 0, 1);
};

love.conf = (config) => {
  print("hello?");
  console.log("oy?");
  config.console = true;
  config.window.title = "GMTK 2024";
  config.window.resizable = true;
};
