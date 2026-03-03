# Installation

## npm

```sh
npm install allegro-ts
```

## Imports

### Named imports (recommended)

Import only what you need:

```ts
import { init_allegro_ts, set_gfx_mode, install_keyboard, key } from "allegro-ts";
```

### Global mode

allegro-ts ships a `global` entry point that attaches every export to `globalThis`, mimicking the original Allegro experience where all functions are globally available:

```ts
import "allegro-ts/global";

// Now all allegro-ts functions are on globalThis
set_gfx_mode(GFX_AUTODETECT_WINDOWED, 640, 480, 0, 0);
```

::: info
The global entry point is particularly useful when porting existing Allegro 4 C code or following the official Allegro tutorials.
:::

## HTML setup

allegro-ts renders to a `<canvas>` element. Add one to your HTML:

```html
<!doctype html>
<html>
  <body>
    <canvas id="mycanvas"></canvas>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

The canvas size is controlled by `set_gfx_mode` — you don't need to set `width`/`height` on the element directly.

## TypeScript configuration

allegro-ts ships `.d.ts` declaration files. No extra `@types` package is needed.

The package exports:

- `./dist/index.mjs` — named exports
- `./dist/global.mjs` — side-effect global attach
- `./dist/index.d.ts` — type declarations
