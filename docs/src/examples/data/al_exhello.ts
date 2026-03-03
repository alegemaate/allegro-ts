/*
 *    Example program for the Allegro library, by Shawn Hargreaves.
 *
 *    This is a very simple program showing how to get into graphics
 *    mode and draw text onto the screen.
 */

import "allegro-ts/global";
import { screen } from "allegro-ts";

async function main(): Promise<number> {
  /* you should always do this at the start of Allegro programs */
  if (allegro_init() != 0) return 1;

  /* set up the keyboard handler */
  install_keyboard();

  /* set a graphics mode sized 320x200 */
  if (set_gfx_mode(GFX_AUTODETECT, 320, 200, 0, 0) != 0) {
    if (set_gfx_mode(GFX_SAFE, 320, 200, 0, 0) != 0) {
      set_gfx_mode(GFX_TEXT, 0, 0, 0, 0);
      allegro_message("Unable to set any graphic mode\n%s\n", allegro_error);
      return 1;
    }
  }

  /* set the color palette */
  set_palette(desktop_palette);

  /* clear the screen to white */
  clear_to_color(screen.value, makecol(255, 255, 255));

  /* you don't need to do this, but on some platforms (eg. Windows) things
   * will be drawn more quickly if you always acquire the screen before
   * trying to draw onto it.
   */
  acquire_screen();

  /* write some text to the screen with black letters and transparent background */
  textout_centre_ex(screen.value, font, "Hello, world!", SCREEN_W.value / 2, SCREEN_H.value / 2, makecol(0, 0, 0), -1);

  /* you must always release bitmaps before calling any input functions */
  release_screen();

  /* wait for a key press */
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
