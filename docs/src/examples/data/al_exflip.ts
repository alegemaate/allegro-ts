/*
 *    Example program for the Allegro library, by Shawn Hargreaves.
 *
 *    This program moves a circle across the screen, first with a
 *    double buffer and then using page flips.
 */

import "allegro-ts/global";
import { screen } from "allegro-ts";

async function main(): Promise<number> {
  let buffer: BITMAP;
  let page1: BITMAP, page2: BITMAP;
  let active_page: BITMAP;
  let c: number;

  if (allegro_init() != 0) return 1;
  install_timer();
  install_keyboard();

  /* Some platforms do page flipping by making one large screen that you
   * can then scroll, while others give you several smaller, unique
   * surfaces. If you use the create_video_bitmap() function, the same
   * code can work on either kind of platform, but you have to be careful
   * how you set the video mode in the first place. We want two pages of
   * 320x200 video memory, but if we just ask for that, on DOS Allegro
   * might use a VGA driver that won't later be able to give us a second
   * page of vram. But if we ask for the full 320x400 virtual screen that
   * we want, the call will fail when using DirectX drivers that can't do
   * this. So we try two different mode sets, first asking for the 320x400
   * size, and if that doesn't work, for 320x200.
   */
  if (set_gfx_mode(GFX_AUTODETECT, 320, 200, 0, 400) != 0) {
    if (set_gfx_mode(GFX_AUTODETECT, 320, 200, 0, 0) != 0) {
      if (set_gfx_mode(GFX_SAFE, 320, 200, 0, 0) != 0) {
        set_gfx_mode(GFX_TEXT, 0, 0, 0, 0);
        allegro_message("Unable to set any graphic mode\n%s\n", allegro_error);
        return 1;
      }
    }
  }

  set_palette(desktop_palette);

  /* allocate the memory buffer */
  buffer = create_bitmap(SCREEN_W.value, SCREEN_H.value);

  /* first with a double buffer... */
  clear_keybuf();
  c = retrace_count.value + 32;
  while (retrace_count.value - c <= SCREEN_W.value + 32) {
    clear_to_color(buffer, makecol(255, 255, 255));
    circlefill(buffer, retrace_count.value - c, SCREEN_H.value / 2, 32, makecol(0, 0, 0));
    textprintf_ex(buffer, font, 0, 0, makecol(0, 0, 0), -1, "Double buffered (%s)", gfx_driver.name);
    blit(buffer, screen.value, 0, 0, 0, 0, SCREEN_W.value, SCREEN_H.value);

    if (keypressed()) break;

    await rest(10);
  }

  destroy_bitmap(buffer);

  /* now create two video memory bitmaps for the page flipping */
  page1 = create_video_bitmap(SCREEN_W.value, SCREEN_H.value);
  page2 = create_video_bitmap(SCREEN_W.value, SCREEN_H.value);

  if (!page1 || !page2) {
    set_gfx_mode(GFX_TEXT, 0, 0, 0, 0);
    allegro_message("Unable to create two video memory pages\n");
    return 1;
  }

  active_page = page2;

  /* do the animation using page flips... */
  clear_keybuf();
  for (c = -32; c <= SCREEN_W.value + 32; c++) {
    clear_to_color(active_page, makecol(255, 255, 255));
    circlefill(active_page, c, SCREEN_H.value / 2, 32, makecol(0, 0, 0));
    textprintf_ex(active_page, font, 0, 0, makecol(0, 0, 0), -1, "Page flipping (%s)", gfx_driver.name);
    show_video_bitmap(active_page);

    if (active_page == page1) active_page = page2;
    else active_page = page1;

    if (keypressed()) break;

    await rest(10);
  }

  destroy_bitmap(page1);
  destroy_bitmap(page2);

  return 0;
}

END_OF_MAIN();

// Start
export const run = () => {
  init_allegro_ts("canvas_id", main, {
    debug_element: "debug",
  });
};
