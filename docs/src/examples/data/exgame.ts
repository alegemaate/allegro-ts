import "allegro-ts/global";
import { screen } from "allegro-ts";

//bitmap objects
let man!: BITMAP;
let apple!: BITMAP;
let bg!: BITMAP;

// munching soudn evffect
let munch!: SAMPLE;

// apple position
let apple_x = 200,
  apple_y = 200;

// player position
let player_x = 100,
  player_y = 100;

// score
let score = 0;

// distance formula
function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// rendering function
function draw() {
  // draw background
  blit(bg, screen.value, 0, 0, 0, 0, SCREEN_W.value, SCREEN_H.value);

  // draw player
  draw_sprite(screen.value, man, player_x, player_y);

  // draw the apple
  draw_sprite(screen.value, apple, apple_x, apple_y);

  // print out current score
  textout_ex(screen.value, font, "Score: " + score, 10, 30, makecol(255, 255, 255), makecol(0, 0, 0));
}

// update gaem logic
function update() {
  // check for keypresses and move the player accordingly
  if (key[KEY_UP]) player_y -= 4;
  if (key[KEY_DOWN]) player_y += 4;
  if (key[KEY_LEFT]) player_x -= 4;
  if (key[KEY_RIGHT]) player_x += 4;

  // if player is touching the apple...
  if (distance(player_x, player_y, apple_x, apple_y) < 20) {
    // play muching sound
    play_sample(munch);

    // move apple to a new spot, making it look like it's
    // a breand new apple
    apple_x = rand() % (SCREEN_W.value - 32);
    apple_y = rand() % (SCREEN_H.value - 32);

    // increase score
    score++;
  }
}

async function main() {
  allegro_init();
  set_gfx_mode(GFX_AUTODETECT, 640, 480, 0, 0);
  install_mouse();
  install_keyboard();
  install_sound(DIGI_AUTODETECT, MIDI_AUTODETECT, null);

  man = await load_bmp("assets/man.png");
  apple = await load_bmp("assets/apple.png");
  bg = await load_bmp("assets/grass.jpg");
  munch = await load_sample("assets/munch.mp3");

  while (!key[KEY_ESC]) {
    update();
    draw();
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
