# Quick Start

This guide walks through setting up a minimal allegro-ts program that opens a window, loads a bitmap, and runs a game loop.

## 1. HTML

```html
<!doctype html>
<html>
  <body style="background:#000;margin:0">
    <canvas id="game"></canvas>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

## 2. Main entry point

```ts
import {
  init_allegro_ts,
  set_gfx_mode,
  install_keyboard,
  install_mouse,
  install_timer,
  install_sound,
  GFX_AUTODETECT_WINDOWED,
  DIGI_AUTODETECT,
  MIDI_AUTODETECT,
  screen,
  makecol,
  clear_to_color,
  textprintf_centre_ex,
  font,
  SCREEN_W,
  SCREEN_H,
  key,
  KEY_ESC,
  rest,
} from "allegro-ts";

async function main(): Promise<number> {
  // 1. Set up the graphics mode
  set_gfx_mode(GFX_AUTODETECT_WINDOWED, 320, 240, 0, 0);

  // 2. Install subsystems
  install_timer();
  install_keyboard();
  install_mouse();
  install_sound(DIGI_AUTODETECT, MIDI_AUTODETECT, null);

  // 2. Game loop
  while (!key[KEY_ESC]) {
    clear_to_color(screen, makecol(0, 0, 0));

    textprintf_centre_ex(
      screen,
      font,
      SCREEN_W / 2,
      SCREEN_H / 2,
      makecol(255, 255, 255),
      -1,
      "Hello, allegro-ts!",
    );

    await rest(16); // ~60fps
  }

  return 0;
}

// Attach to canvas and boot on window load
init_allegro_ts("game", main);
```

## Lifecycle overview

```
init_allegro_ts("canvas-id", main)
  └─► window.load fires
        └─► main() called
              ├─► set_gfx_mode(...)   ← sizes canvas, sets SCREEN_W/H
              ├─► install_*()         ← hook input/audio
              ├─► load_bitmap(...)    ← load assets asynchronously
              └─► game loop
```

## Loading assets

Assets are loaded asynchronously. Ensure you await the `Promise` returned by loading functions to access the loaded assets.

```ts
const player = await load_bitmap("assets/player.png");
const jump = await load_sample("assets/jump.wav");

// player.w, player.h, player.ready === true here
draw_sprite(screen, player, 100, 100);
```
