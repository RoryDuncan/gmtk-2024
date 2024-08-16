import { Scenes } from "./core/scene";

import console from "./core/console";
import { GameTime } from "./core/systems/timer";
import main_menu from "./scenes/main_menu";

love.load = async () => {
  console.log("Loading !");
  Scenes.switch(main_menu);
};

love.update = (dt: number) => {
  GameTime.update(dt);
  Scenes.update(dt);
};

love.keypressed = (key: string) => Scenes.keypress(key);

love.draw = () => {
  Scenes.draw();
  love.graphics.setColor(1, 1, 0, 1);
};

love.conf = (config) => {
  config.console = true;
};
