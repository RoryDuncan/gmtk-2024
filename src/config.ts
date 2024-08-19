import type { Config } from "love";

love.conf = (config: Config) => {
  config.window.title = "GTMK 2024";
  config.console = true;
  config.window.resizable = true;
};
