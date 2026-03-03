# Introduction

**allegro-ts** is a TypeScript library that faithfully re-implements the [Allegro 4](https://liballeg.org/) C game programming API for the browser. It renders via the HTML5 Canvas 2D API and uses the Web Audio API for sound.

If you have experience with Allegro 4 in C/C++, the API will feel immediately familiar. If you're new to both, allegro-ts is a great way to dip your toes into game development.

## What it provides

- **Graphics** — `set_gfx_mode`, `create_bitmap`, `load_bitmap`, drawing to `screen`
- **Primitives** — `line`, `rect`, `circle`, `triangle`, `floodfill`, and more
- **Sprites** — `draw_sprite`, `rotate_sprite`, `stretch_sprite`, flip and pivot variants
- **Fonts & Text** — `load_font`, `textout_ex`, `textprintf_ex` and alignment variants
- **Keyboard** — `install_keyboard`, `key[]` array, `readkey()`
- **Mouse** — `install_mouse`, `mouse_x/y/b`, cursor control
- **Timer** — `install_timer`, `install_int`, `rest()`
- **Sound** — `install_sound`, `load_sample`, `play_sample`
- **MIDI** — `load_midi`, `play_midi`
- **Color** — `makecol`, `getr/g/b/a`
- **Math** — `rand`, `frand`, `abs`, `fix_to_rad`

## Design goals

allegro-ts aims for **API compatibility** with Allegro 4 rather than pixel-perfect emulation. Most functions behave identically; a small number are stubs for compatibility but do nothing (e.g. `lock_bitmap`, `vsync`).

## Relationship to allegro.js

This project is based on [allegro.js](https://github.com/TheSos/allegrojs) — an earlier JavaScript port — but has been rewritten in TypeScript with a modern module structure, stricter types, and an ES module build.
