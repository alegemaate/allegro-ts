/*
 *    Example program for the Allegro library, by Shawn Hargreaves.
 *
 *    This program demonstrates how to load and display a bitmap
 *    file.  You have to use this example from the command line to
 *    specify as first parameter a graphic file in one of Allegro's
 *    supported formats.  If the file is loaded successfully,
 *    it will be displayed until you press a key.
 */
import "allegro-ts/global";
import { screen } from "allegro-ts";

async function main() {
  const argv = ["", "assets/man.png"];
  let the_image: BITMAP | null = null;
  let the_palette!: RGB;

  if (allegro_init() != 0) return 1;

  install_keyboard();

  if (set_gfx_mode(GFX_AUTODETECT, 320, 200, 0, 0) != 0) {
    if (set_gfx_mode(GFX_SAFE, 320, 200, 0, 0) != 0) {
      set_gfx_mode(GFX_TEXT, 0, 0, 0, 0);
      allegro_message("Unable to set any graphic mode\n%s\n", allegro_error);
      return 1;
    }
  }

  /* read in the bitmap file */
  the_image = await load_bitmap(argv[1] as string, the_palette);
  if (!the_image) {
    set_gfx_mode(GFX_TEXT, 0, 0, 0, 0);
    allegro_message("Error reading bitmap file '%s'\n", argv[1] as string);
    return 1;
  }

  /* select the bitmap palette */
  set_palette(the_palette);

  /* blit the image onto the screen */
  blit(
    the_image,
    screen.value,
    0,
    0,
    (SCREEN_W.value - the_image.w) / 2,
    (SCREEN_H.value - the_image.h) / 2,
    the_image.w,
    the_image.h,
  );

  /* destroy the bitmap */
  destroy_bitmap(the_image);

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
