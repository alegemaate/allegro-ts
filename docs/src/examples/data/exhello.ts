import "allegro-ts/global";
import { screen } from "allegro-ts";

async function main() {
  // Initialising allegro.js
  allegro_init();

  install_keyboard();

  // Selecting canvas element adn setting it up for display at 640x480
  set_gfx_mode(GFX_AUTODETECT_FULLSCREEN, 640, 480, 0, 0);

  // Clears the screen to white
  clear_to_color(screen.value, makecol(255, 255, 255));

  // Typoes 'Hello World!' message to the centre of the screen
  textout_centre_ex(
    screen.value,
    font,
    "Hello World!",
    SCREEN_W.value / 2,
    SCREEN_H.value / 2,
    makecol(0, 0, 0),
    makecol(255, 0, 0),
  );

  await readkey();

  return 0;
}
END_OF_MAIN();

// Start
export const run = () => {
  init_allegro_ts("canvas_id", main, {
    debug_element: "debug",
  });
};
