import { screen } from "./bitmap";
import { makecol } from "./color";
import { _error, log } from "./debug";
import { textprintf_centre_ex } from "./font";
import {
  GFX_AUTODETECT_WINDOWED,
  SCREEN_H,
  SCREEN_W,
  font,
  set_gfx_mode,
} from "./graphics";
import { _keyboard_loop } from "./keyboard";
import { scaleclamp } from "./math";
import { _mouse_loop, _mouse_loop_reset } from "./mouse";
import { clear_bitmap, clear_to_color, rectfill } from "./primitives";
import { _touch_loop } from "./touch";
import { BITMAP, CONFIG, MIDI, SAMPLE } from "./types";
import { rest } from "./timer";

// All downloadable objects
export const _downloadables: (BITMAP | CONFIG | MIDI | SAMPLE)[] = [];

// Performs some loop tasks, such as cleaning up pressed[] and released[]
export function _uberloop(): void {
  _mouse_loop();
  _keyboard_loop();
  _mouse_loop_reset();
  _touch_loop();
}

// Time when ready() was called
let _loader_init_time = 0;

// Holds the download complete handler function
const _bar_proc = loading_bar;

// Checks if everything has downloaded in intervals
export async function _progress_check(): Promise<void> {
  let loaded = false;
  while (!loaded) {
    const num_assets = _downloadables.length;
    const num_loaded = _downloadables.filter((down) => down.ready).length;

    _bar_proc(num_assets / num_loaded);

    if (num_loaded >= num_assets) {
      log(
        `Loading complete! Took ${(
          (Date.now() - _loader_init_time) /
          1000
        ).toFixed(1)} seconds!`,
      );
      clear_bitmap(screen);
      loaded = true;
    }

    // eslint-disable-next-line no-await-in-loop
    await rest(100);
  }
}

/**
 * Default loading bar rendering
 * This function is used by ready() to display a simple loading bar on screen. You need to manually specify a dummy function if you don't want loading screen.
 * @param progress - loading progress in 0.0 - 1.0 range
 */
export function loading_bar(progress: number): void {
  rectfill(screen, 5, SCREEN_H - 55, SCREEN_W - 10, 50, makecol(0, 0, 0));
  rectfill(
    screen,
    10,
    SCREEN_H - 50,
    SCREEN_W - 10,
    SCREEN_H - 10,
    makecol(255, 255, 255),
  );
  rectfill(
    screen,
    15,
    SCREEN_H - 45,
    SCREEN_W - 15,
    SCREEN_H - 15,
    makecol(0, 0, 0),
  );
  rectfill(
    screen,
    20,
    SCREEN_H - 40,
    scaleclamp(progress, 0, 1, 20, SCREEN_W - 20),
    SCREEN_H - 20,
    makecol(255, 255, 255),
  );
}

// Setup browser specific allegro functions
export function init_allegro_ts(
  canvas_id: string,
  main?: () => Promise<number>,
): void {
  // Get canvas from document
  const cv = document.getElementById(canvas_id) as
    | HTMLCanvasElement
    | undefined;
  if (!cv) {
    _error(`Can't find canvas with id ${canvas_id}`);
    return;
  }

  // Get context from document
  const ctx = cv.getContext("2d");
  if (!ctx) {
    throw new Error("Context not defined");
  }

  // Init screen with basic canvas
  screen.canvas = cv;
  screen.context = ctx;

  // Boot on load
  if (main) {
    window.addEventListener("load", () => {
      void boot(main);
    });
  }
}

// Start it up
async function boot(main: () => Promise<number>): Promise<void> {
  const code = await main();
  set_gfx_mode(GFX_AUTODETECT_WINDOWED, 320, 200, 0, 0);
  clear_to_color(screen, makecol(100, 100, 100));
  textprintf_centre_ex(
    screen,
    font,
    SCREEN_W / 2,
    SCREEN_H / 2,
    makecol(255, 255, 255),
    -1,
    "Program ended with code %i",
    code,
  );
}

/**
 * Installs a handler to check if everything has downloaded.
 * You should always wrap your loop() function around it, unless there is nothing external you need. load_bitmap() and load_sample() all require some time to process and the execution cannot be stalled for that, so all code you wrap in this hander will only get executed after everything has loaded making sure you can access bitmap properties and data and play samples right away.  Note that load_font() does not affect ready(), so you should always load your fonts first.
 * @param procedure - function to be called when everything has loaded.
 * @param bar - loading bar callback function, if omitted, equals to loading_bar() and renders a simple loading bar. it must accept one parameter, that is loading progress in 0.0-1.0 range.
 */
export async function allegro_ready(): Promise<void> {
  _loader_init_time = Date.now();
  log("Loader initialised!");
  return _progress_check();
}
