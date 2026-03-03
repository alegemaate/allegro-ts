import "allegro-ts/global";
import { screen } from "allegro-ts";

// Globally declared bitmap object
async function main() {
  // Initialises allegro.js
  allegro_init();
  install_keyboard();

  // Installs graphics at given canvas in 640x480 resolution
  set_gfx_mode(0, 640, 480, 0, 0);

  // Loads an image into the bitmap object
  const logo = await load_bmp("assets/allegro.png");

  // renders the loaded image on the screen
  stretch_blit(logo, screen.value, 0, 0, logo.w, logo.h, 0, 0, SCREEN_W.value, SCREEN_H.value);

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
