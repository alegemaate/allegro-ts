import "allegro-ts/global";
import { screen } from "allegro-ts";

async function main() {
  let mode = 0;

  allegro_init();
  set_gfx_mode(GFX_AUTODETECT, 640, 480, 0, 0);
  install_mouse();
  install_keyboard();

  while (!key[KEY_ESC]) {
    clear_to_color(screen.value, makecol(0, 0, 0));

    switch (mode) {
      case 0:
        putpixel(screen.value, mouse_x.value, mouse_y.value, makecol(255, 0, 0));
        textout_ex(screen.value, font, "putpixel", 0, 0, makecol(0, 0, 0), makecol(255, 255, 255));
        break;
      case 1:
        vline(screen.value, mouse_x.value, mouse_y.value, 0, makecol(255, 0, 0));
        textout_ex(screen.value, font, "vline", 0, 0, makecol(0, 0, 0), makecol(255, 255, 255));
        break;
      case 2:
        hline(screen.value, mouse_x.value, mouse_y.value, 0, makecol(255, 0, 0));
        textout_ex(screen.value, font, "hline", 0, 0, makecol(0, 0, 0), makecol(255, 255, 255));
        break;
      case 3:
        line(screen.value, mouse_x.value, mouse_y.value, 0, 0, makecol(255, 0, 0));
        textout_ex(screen.value, font, "line", 0, 0, makecol(0, 0, 0), makecol(255, 255, 255));
        break;
      case 4:
        triangle(screen.value, mouse_x.value, mouse_y.value, 0, 0, SCREEN_W.value, SCREEN_H.value, makecol(255, 0, 0));
        textout_ex(screen.value, font, "triangle", 0, 0, makecol(0, 0, 0), makecol(255, 255, 255));
        break;
      case 5:
        polygon(
          screen.value,
          6,
          [50, 50, 100, 100, 100, 150, 50, 200, 5, 150, mouse_x.value, mouse_y.value],
          makecol(255, 0, 0),
        );
        textout_ex(screen.value, font, "polygon", 0, 0, makecol(0, 0, 0), makecol(255, 255, 255));
        break;
      case 6:
        rect(screen.value, mouse_x.value, mouse_y.value, 10, 10, makecol(255, 0, 0));
        textout_ex(screen.value, font, "rect", 0, 0, makecol(0, 0, 0), makecol(255, 255, 255));
        break;
      case 7:
        rectfill(screen.value, mouse_x.value, mouse_y.value, 10, 10, makecol(255, 0, 0));
        textout_ex(screen.value, font, "rectfill", 0, 0, makecol(0, 0, 0), makecol(255, 255, 255));
        break;
      case 8:
        circle(screen.value, mouse_x.value, mouse_y.value, 10, makecol(255, 0, 0));
        textout_ex(screen.value, font, "circle", 0, 0, makecol(0, 0, 0), makecol(255, 255, 255));
        break;
      case 9:
        circlefill(screen.value, mouse_x.value, mouse_y.value, 10, makecol(255, 0, 0));
        textout_ex(screen.value, font, "circlefill", 0, 0, makecol(0, 0, 0), makecol(255, 255, 255));
        break;
      case 10:
        ellipse(screen.value, mouse_x.value, mouse_y.value, 10, 5, makecol(255, 0, 0));
        textout_ex(screen.value, font, "ellipse", 0, 0, makecol(0, 0, 0), makecol(255, 255, 255));
        break;
      case 11:
        ellipsefill(screen.value, mouse_x.value, mouse_y.value, 10, 5, makecol(255, 0, 0));
        textout_ex(screen.value, font, "ellipsefill", 0, 0, makecol(0, 0, 0), makecol(255, 255, 255));
        break;
      case 12:
        arc(screen.value, mouse_x.value, mouse_y.value, -21, 43, 50, makecol(255, 0, 0));
        textout_ex(screen.value, font, "arc", 0, 0, makecol(0, 0, 0), makecol(255, 255, 255));
        break;
      case 13:
        spline(screen.value, [1, 3, 60, 80, 70, 90, mouse_x.value, mouse_y.value], makecol(255, 0, 0));
        textout_ex(screen.value, font, "spline", 0, 0, makecol(0, 0, 0), makecol(255, 255, 255));
        break;
      default:
        break;
    }

    if (keypressed()) {
      mode = (mode + 1) % 14;
      clear_keybuf();
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
