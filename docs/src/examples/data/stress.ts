import "allegro-ts/global";
import { screen } from "allegro-ts";

let num = 0;
const x: number[] = [];
const y: number[] = [];
const vx: number[] = [];
const vy: number[] = [];
let last_time = 0;
let buffer!: BITMAP;
let bmp!: BITMAP;

async function main() {
  allegro_init();
  install_keyboard();
  set_gfx_mode(GFX_AUTODETECT, 640, 480, 0, 0);
  bmp = await load_bitmap("assets/planet.png");
  buffer = create_bitmap(SCREEN_W.value, SCREEN_H.value);

  while (!key[KEY_ESC]) {
    clear_to_color(buffer, makecol(255, 255, 255));

    for (let c = 0; c < num; c++) {
      draw_sprite(buffer, bmp, x[c], y[c]);
      if (x[c] + vx[c] > SCREEN_W.value) {
        vx[c] = -abs(vx[c]);
      }
      if (y[c] + vy[c] > SCREEN_H.value) {
        vy[c] = -abs(vy[c]);
      }
      if (x[c] + vx[c] < -64) {
        vx[c] = abs(vx[c]);
      }
      if (y[c] + vy[c] < -64) {
        vy[c] = abs(vy[c]);
      }
      x[c] += vx[c];
      y[c] += vy[c];
    }

    x.push(rand() % SCREEN_W.value);
    y.push(rand() % SCREEN_H.value);
    vx.push(frand() * 2 - 1);
    vy.push(frand() * 2 - 1);
    num++;
    const msec = Date.now() - last_time;
    textprintf_ex(
      buffer,
      font,
      20,
      20,
      makecol(0, 0, 0),
      makecol(255, 255, 255),
      "Sprites: %i took %i msec (%.1f fps)",
      num,
      msec,
      1000 / msec,
    );
    blit(buffer, screen.value, 0, 0, 0, 0, SCREEN_W.value, SCREEN_H.value);
    last_time = Date.now();
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
