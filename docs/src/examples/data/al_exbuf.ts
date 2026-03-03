/*
 *    Example program for the Allegro library, by Shawn Hargreaves.
 *
 *    This program demonstrates the use of double buffering.
 *    It moves a circle across the screen, first just erasing and
 *    redrawing directly to the screen, then with a double buffer.
 */
import "allegro-ts/global";
import { screen } from "allegro-ts";

async function main() {
  let buffer: BITMAP | null = null;
  let c: number;

  if (allegro_init() != 0) return 1;
  install_timer();
  install_keyboard();

  if (set_gfx_mode(GFX_AUTODETECT, 320, 200, 0, 0) != 0) {
    if (set_gfx_mode(GFX_SAFE, 320, 200, 0, 0) != 0) {
      set_gfx_mode(GFX_TEXT, 0, 0, 0, 0);
      allegro_message("Unable to set any graphic mode\n%s\n", allegro_error);
      return 1;
    }
  }

  set_palette(desktop_palette);

  /* allocate the memory buffer */
  buffer = create_bitmap(SCREEN_W.value, SCREEN_H.value);

  /* First without any buffering...
   * Note use of the global retrace_counter to control the speed. We also
   * compensate screen size (GFX_SAFE) with a virtual 320 screen width.
   */
  clear_keybuf();
  c = retrace_count.value + 32;
  while (retrace_count.value - c <= 320 + 32) {
    acquire_screen();
    clear_to_color(screen.value, makecol(255, 255, 255));
    circlefill(
      screen.value,
      ((retrace_count.value - c) * SCREEN_W.value) / 320,
      SCREEN_H.value / 2,
      32,
      makecol(0, 0, 0),
    );
    textprintf_ex(screen.value, font, 0, 0, makecol(0, 0, 0), -1, "No buffering (%s)", gfx_driver.name);
    release_screen();

    if (keypressed()) break;

    await rest(10);
  }

  /* and now with a double buffer... */
  clear_keybuf();
  c = retrace_count.value + 32;
  while (retrace_count.value - c <= 320 + 32) {
    clear_to_color(buffer, makecol(255, 255, 255));
    circlefill(buffer, ((retrace_count.value - c) * SCREEN_W.value) / 320, SCREEN_H.value / 2, 32, makecol(0, 0, 0));
    textprintf_ex(buffer, font, 0, 0, makecol(0, 0, 0), -1, "Double buffered (%s)", gfx_driver.name);
    blit(buffer, screen.value, 0, 0, 0, 0, SCREEN_W.value, SCREEN_H.value);

    if (keypressed()) break;

    await rest(10);
  }

  destroy_bitmap(buffer);

  return 0;
}
END_OF_MAIN();

// Start
export const run = () => {
  init_allegro_ts("canvas_id", main, {
    debug_element: "debug",
  });
};
