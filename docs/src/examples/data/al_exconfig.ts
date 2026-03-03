/*
 *    Example program for the Allegro library, by Lennart Steinke.
 *
 *    This is a very simple program showing how to use the Allegro
 *    configuration (ini file) routines. A first look at the example
 *    shows nothing more than a static graphic and the wait for
 *    a key press. However, the way this graphic is displayed is
 *    configured through a custom exconfig.ini file which is loaded
 *    manually. From this file the example obtains parameters like
 *    fullscreen/windowed mode, a specific graphic resolution to set
 *    up, which graphic to show, how to blit it on the screen, etc.
 */

import "allegro-ts/global";
import { screen } from "allegro-ts";

async function main() {
  let w: number;
  let h: number;
  let bpp: number;
  let windowed: number;
  let data;

  let title = "";
  let filename = "";
  let r: number;
  let g: number;
  let b: number;

  let background: BITMAP | null = null;
  let display: number;
  const pal: RGB = {
    r: 0,
    g: 0,
    b: 0,
  };
  let x: number;
  let y: number;

  /* you should always do this at the start of Allegro programs */
  if (allegro_init() != 0) return 1;
  /* set up the keyboard handler */
  install_keyboard();

  /* save the current ini file, then set the program specific one */
  push_config_state();
  await set_config_file("assets/exconfig.ini");

  /* the gfx mode is stored like this:
   *    640  480 16
   * the get_config_argv() function returns a pointer to a char
   * array, and stores the size of the char array in an int
   */
  data = get_config_argv("graphics", "mode");
  if (data.length != 3) {
    /* We expect only 3 parameters */
    allegro_message("Found %i parameters in graphics.mode instead of the 3 expected.\n", data.length);
    w = 320;
    h = 200;
    bpp = 8;
  } else {
    w = parseInt(data[0], 10);
    h = parseInt(data[1], 10);
    bpp = parseInt(data[2], 10);
  }

  /* Should we use a windowed mode?
   * In the config file this is stored as either FALSE or TRUE.
   * So we need to read a string and see what it contains.
   * If the entry is not found, we use "FALSE" by default
   */
  if (ustricmp(get_config_string("graphics", "windowed", "FALSE"), "FALSE") == 0) windowed = GFX_AUTODETECT_FULLSCREEN;
  else windowed = GFX_AUTODETECT_WINDOWED;

  /* the title string
   * The string returned is stored inside of the config system
   * and would be lost if we call pop_config_state(), so we create
   * a copy of it.
   */
  title = ustrdup(get_config_string("content", "headline", "<no headline>"));

  /* the title color
   * once again this is stored as three ints in one line
   */
  data = get_config_argv("content", "headercolor");
  if (data.length != 3) {
    /* We expect only 3 parameters */
    allegro_message("Found %i parameters in content.headercolor instead of the 3 expected.\n", data.length);
    r = g = b = 255;
  } else {
    r = parseInt(data[0], 10);
    g = parseInt(data[1], 10);
    b = parseInt(data[2], 10);
  }

  /* The image file to read
   * The string returned is stored inside of the config system
   * and would be lost if we call pop_config_state(), so we create
   * a copy of it.
   */
  filename = ustrdup(get_config_string("content", "image", "assets/mysha.png"));

  /* and it's tiling mode */
  display = get_config_int("content", "display", 0);
  if (display < 0 || display > 2) {
    allegro_message("content.display must be within 0..2\n");
    display = 0;
  }

  /* restore the old config file */
  pop_config_state();

  /* set the graphics mode */
  set_color_depth(bpp);
  if (set_gfx_mode(windowed, w, h, 0, 0) != 0) {
    allegro_message("Unable to set mode %ix%i with %ibpp\n", w, h, bpp);
  }

  /* Clear the screen */
  clear_bitmap(screen.value);

  /* load the image */
  background = await load_bitmap(filename, pal);

  if (background.context) {
    set_palette(pal);

    switch (display) {
      case 0 /* stretch */:
        stretch_blit(background, screen.value, 0, 0, background.w, background.h, 0, 0, SCREEN_W.value, SCREEN_H.value);
        break;

      case 1 /* center */:
        blit(
          background,
          screen.value,
          0,
          0,
          (SCREEN_W.value - background.w) / 2,
          (SCREEN_H.value - background.h) / 2,
          background.w,
          background.h,
        );
        break;

      case 2 /* tile */:
        for (y = 0; y < SCREEN_H.value; y += background.h)
          for (x = 0; x < SCREEN_W.value; x += background.w)
            blit(background, screen.value, 0, 0, x, y, background.w, background.h);
        break;
    }
  } else {
    textprintf_centre_ex(
      screen.value,
      font,
      SCREEN_W.value / 2,
      SCREEN_H.value / 2,
      makecol(r, g, b),
      -1,
      "%s not found",
      filename,
    );
  }

  textout_ex(screen.value, font, title, SCREEN_W.value / 2, 20, makecol(r, g, b), -1);

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
