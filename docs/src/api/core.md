# Core

The core module handles initialization, the asset loading barrier, and internal loop plumbing.

## `init_allegro_ts`

```ts
function init_allegro_ts(canvas_id: string, main?: () => Promise<number>): void;
```

Binds allegro-ts to an existing `<canvas>` element in the DOM. If `main` is provided, it is called automatically once `window` fires its `load` event.

| Parameter   | Description                               |
| ----------- | ----------------------------------------- |
| `canvas_id` | `id` of the canvas element to render into |
| `main`      | Optional async entry-point function       |

```ts
init_allegro_ts("mycanvas", async () => {
  set_gfx_mode(GFX_AUTODETECT_WINDOWED, 640, 480, 0, 0);
  // ...
  return 0;
});
```

When `main` returns, a simple "Program ended" message is displayed on screen.
