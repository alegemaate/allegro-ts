# Emscripten

**allegro-ts-emscripten** is a complete C header mapping of allegro-ts that lets you compile Allegro 4 C/C++ games to WebAssembly and run them in the browser, using allegro-ts as the backend runtime.

- [GitHub](https://github.com/alegemaate/allegro-ts-emscripten)
- [Live Examples](https://alegemaate.com/allegro-ts-emscripten/colortest)

## How it works

allegro-ts-emscripten provides a set of C headers that declare all Allegro 4 functions. The implementations call into allegro-ts via Emscripten's JavaScript interop layer. This means your existing Allegro 4 C code compiles with `emcc` just as it would with GCC, and allegro-ts handles all the actual rendering, input, and audio in the browser.

```
C source ──emcc──▶ WebAssembly ──Emscripten──▶ allegro-ts ──▶ HTML5 Canvas
```

## Prerequisites

- [Emscripten SDK](https://emscripten.org/docs/getting_started/downloads.html) installed and activated (`emsdk activate latest`)
- CMake ≥ 3.10
- Make (or Ninja)
- Node.js (for serving the output)

## Setup

Clone the repository and initialise the allegro-ts submodule:

```sh
git clone https://github.com/alegemaate/allegro-ts-emscripten.git
cd allegro-ts-emscripten
```

Run the setup script to produce a flattened copy of the allegro-ts library that Emscripten can consume:

```sh
./setup.sh
```

This generates the C headers and JS glue into a `lib/` directory that the CMake build picks up automatically.

## Building the examples

```sh
cd examples
emcmake cmake -G "Unix Makefiles" .
make
```

Replace `"Unix Makefiles"` with `"Ninja"` if you prefer Ninja.

The compiled output (`.html`, `.js`, `.wasm`) lands in `examples/build/`.

## Running locally

WebAssembly files must be served over HTTP — opening them via `file://` will not work. Use any static file server:

```sh
npm i -g serve
cd examples/build
serve
```

Then open `http://localhost:3000` in your browser and navigate to any example.

## Examples

Seven demos are included and hosted live:

| Example                                                                   | Description                      |
| ------------------------------------------------------------------------- | -------------------------------- |
| [colortest](https://alegemaate.com/allegro-ts-emscripten/colortest)       | Color palette and `makecol`      |
| [exaccel](https://alegemaate.com/allegro-ts-emscripten/exaccel)           | Bitmap acceleration              |
| [exbmp](https://alegemaate.com/allegro-ts-emscripten/exbmp)               | Bitmap loading and drawing       |
| [exbounce](https://alegemaate.com/allegro-ts-emscripten/exbounce)         | Sprite movement and collision    |
| [exflip](https://alegemaate.com/allegro-ts-emscripten/exflip)             | Page flipping / double buffering |
| [exprimitives](https://alegemaate.com/allegro-ts-emscripten/exprimitives) | Lines, rects, circles            |
| [exstress](https://alegemaate.com/allegro-ts-emscripten/exstress)         | Stress test / performance        |

## Writing your own game

Create a `.c` file that includes the Allegro 4 headers and add it to the CMakeLists. The setup script places the flattened headers in `lib/`, so your include path just needs to point there:

```c
#include "allegro.h"

int main(void) {
    allegro_init();
    set_gfx_mode(GFX_AUTODETECT_WINDOWED, 640, 480, 0, 0);
    install_keyboard();

    while (!key[KEY_ESC]) {
        clear_to_color(screen, makecol(0, 0, 0));
        textout_ex(screen, font, "Hello, browser!", 10, 10, makecol(255, 255, 255), -1);
        rest(16);
    }

    return 0;
}
```

Compile with:

```sh
emcc main.c -I../lib -o build/main.html
```

::: tip
Use `rest(16)` instead of a busy loop to yield control back to the browser event loop. The Emscripten runtime maps `rest` to a non-blocking async sleep.
:::

## Limitations

- Allegro 4 functions that have no browser equivalent (e.g. `set_window_title`) are stubs that do nothing.
- File I/O uses Emscripten's virtual filesystem — bundle assets using `--preload-file` or `--embed-file` at compile time.
- MIDI playback relies on allegro-ts's built-in General MIDI player, which may differ from native MIDI output.
