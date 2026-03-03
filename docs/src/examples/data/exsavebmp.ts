import "allegro-ts/global";
import { screen } from "allegro-ts";

async function main() {
  allegro_init();
  set_gfx_mode(GFX_AUTODETECT, 640, 480, 0, 0);
  install_mouse();
  install_keyboard();

  while (!key[KEY_ESC]) {
    clear_to_color(screen.value, makecol(0, 0, 0));

    polygon(
      screen.value,
      6,
      [50, 50, 100, 100, 100, 150, 50, 200, 5, 150, mouse_x.value, mouse_y.value],
      makecol(255, 0, 0),
    );

    textout_ex(screen.value, font, "Click to Save", 0, 0, makecol(0, 0, 0), makecol(255, 255, 255));

    if (mouse_b.value & 1) {
      save_bitmap("exsavebmp.png", screen.value);
      while (mouse_b.value & 1) {
        await rest(10);
      }
    }

    await rest(16);
  }

  return 0;
}
END_OF_MAIN();

// Start
export const run = () => {
  init_allegro_ts("canvas_id", main, {
    debug_element: "debug",
  });
};
