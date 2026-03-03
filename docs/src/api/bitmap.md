# Bitmap

A `BITMAP` wraps an off-screen `<canvas>` element with metadata. Every drawing function accepts a `BITMAP` as its first argument.

## BITMAP structure

```ts
interface BITMAP {
  w: number;
  h: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  type: "bmp";
  clipping_rect: CLIPPING_RECTANGLE;
  clipping: boolean;
  is_screen: boolean;
  mem_type: "memory" | "system" | "video";
  parent: BITMAP | null;
}
```

## Creating bitmaps

```ts
function create_bitmap(width: number, height: number): BITMAP;
function create_bitmap_ex(color_depth: number, width: number, height: number): BITMAP;
function create_video_bitmap(width: number, height: number): BITMAP;
function create_system_bitmap(width: number, height: number): BITMAP;
function create_sub_bitmap(
  parent: BITMAP | undefined,
  x: number,
  y: number,
  width: number,
  height: number,
): BITMAP | null;
```

`create_sub_bitmap` copies a region of `parent` into a new bitmap and stores a back-reference.

## Loading bitmaps

```ts
function load_bitmap(filename: string, pal?: RGB): BITMAP;
function load_bmp(filename: string): BITMAP; // alias for load_bitmap
function load_pcx(filename: string, pal?: RGB): BITMAP;
function load_tga(filename: string, pal?: RGB): BITMAP;
function load_lbm(filename: string, pal?: RGB): BITMAP;
```

::: tip Magic Pink
Pixels with the exact color `rgb(255, 0, 255)` are automatically converted to fully transparent on load, preserving Allegro's traditional transparency color.
:::

## Saving bitmaps

```ts
function save_bitmap(filename: string, bmp: BITMAP | undefined, pal?: RGB): void;
function save_bmp(filename: string, bmp: BITMAP | undefined, pal?: RGB): void;
function save_pcx(filename: string, bmp: BITMAP | undefined, pal?: RGB): void;
function save_tga(filename: string, bmp: BITMAP | undefined, pal?: RGB): void;
```

Saving triggers a browser download of the bitmap as a PNG. The `filename` parameter becomes the suggested download name.

## Destroying bitmaps

```ts
function destroy_bitmap(bitmap: BITMAP | undefined): void;
```

Removes the underlying `<canvas>` from the DOM and marks the bitmap as not ready.

## Querying bitmaps

```ts
function bitmap_color_depth(bmp: BITMAP | undefined): number; // always 32
function bitmap_mask_color(bmp: BITMAP | undefined): number; // makecol(255, 0, 255)
function is_same_bitmap(bmp1: BITMAP | undefined, bmp2: BITMAP | undefined): boolean;
function is_planar_bitmap(bmp: BITMAP | undefined): boolean; // always false
function is_linear_bitmap(bmp: BITMAP | undefined): boolean; // always true
function is_memory_bitmap(bmp: BITMAP | undefined): boolean;
function is_screen_bitmap(bmp: BITMAP | undefined): boolean;
function is_video_bitmap(bmp: BITMAP | undefined): boolean;
function is_system_bitmap(bmp: BITMAP | undefined): boolean;
function is_sub_bitmap(bmp: BITMAP | undefined): boolean;
```

## Clipping

```ts
function set_clip_rect(
  bitmap: BITMAP | undefined,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): void;
function get_clip_rect(bitmap: BITMAP | undefined): CLIPPING_RECTANGLE | null;
function add_clip_rect(
  bitmap: BITMAP | undefined,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): void;
function set_clip_state(bitmap: BITMAP | undefined, state: boolean): void;
function get_clip_state(bitmap: BITMAP | undefined): number;
function is_inside_bitmap(bmp: BITMAP | undefined, x: number, y: number, clip: number): boolean;
```

## Locking (no-ops)

```ts
function lock_bitmap(bitmap: BITMAP | undefined): void;
function acquire_bitmap(bmp: BITMAP | undefined): void;
function release_bitmap(bmp: BITMAP | undefined): void;
function acquire_screen(): void;
function release_screen(): void;
```

These exist for API compatibility. The browser canvas does not require explicit locking.

## PNG support stub

```ts
function loadpng_init(): number; // always returns 1
```

PNG is natively supported — this exists purely for compatibility with code that calls `loadpng_init()`.
