# Types

TypeScript interfaces and types exported by allegro-ts.

## BITMAP

The core rendering surface. Every drawing function accepts a `BITMAP`.

```ts
interface BITMAP {
  w: number; // width in pixels
  h: number; // height in pixels
  canvas: HTMLCanvasElement; // underlying canvas
  context: CanvasRenderingContext2D; // 2D context
  type: "bmp";
  clipping_rect: CLIPPING_RECTANGLE;
  clipping: boolean;
  is_screen: boolean; // true for the global screen
  mem_type: "memory" | "system" | "video";
  parent: BITMAP | null; // set for sub-bitmaps
}

interface CLIPPING_RECTANGLE {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
```

## FONT

```ts
interface FONT {
  element: HTMLStyleElement | null; // injected <style> tag
  file: string;
  name: string; // CSS font-family name
  size: number; // font size in px
  type: "fnt";
}
```

## SAMPLE

```ts
interface SAMPLE {
  file: string;
  source: AudioBufferSourceNode;
  gain: GainNode;
  buffer: AudioBuffer | null;
  pan: StereoPannerNode;
  type: "snd";
}
```

## MIDI

```ts
interface MIDI {
  file: string;
  type: "midi";
  data: MidiData;
}
```

## CONFIG

```ts
type CONFIG_DATA = Record<string, Record<string, string>>;

interface CONFIG {
  file: string;
  data: CONFIG_DATA;
  type: "config";
}
```

## TIMER

```ts
interface TIMER {
  timer: () => void;
  id: number; // setInterval id
}
```

## Color types

```ts
type fixed = number; // Allegro fixed-point number (angle: 256 = full circle)

const PAL_SIZE = 256;
type PALETTE = RGB[];

interface RGB {
  r: number;
  g: number;
  b: number;
}

type ZBUFFER = BITMAP;
```

## Touch

```ts
interface ALLEGRO_TOUCH_EVENT {
  sx: number; // start x
  sy: number; // start y
  mx: number; // movement x
  my: number; // movement y
  px: number; // previous x
  py: number; // previous y
  x: number; // current x
  y: number; // current y
  id: number;
  dead: boolean;
  age: number;
}
```

## 3D types (compatibility stubs)

```ts
interface V3D {
  x;
  y;
  z;
  u;
  v;
  c: number;
}
interface V3D_f {
  x;
  y;
  z;
  u;
  v;
  c: number;
}
interface MATRIX {
  v: number[][];
  t: number[];
}
interface MATRIX_f {
  v: number[][];
  t: number[];
}
interface QUAT {
  w;
  x;
  y;
  z: number;
}
interface GFX_MODE {
  width;
  height;
  bpp: number;
}
interface GFX_MODE_LIST {
  num_modes: number;
  mode: GFX_MODE;
}
interface COLOR_MAP {
  data: number[][];
}
interface RGB_MAP {
  data: number[][][];
}
```

## Dialog types (compatibility stubs)

```ts
interface DIALOG { proc, x, y, w, h, fg, bg, flags, d1, d2, dp, dp2, dp3 }
interface MENU   { text, proc, child, flags, dp }
interface DIALOG_PLAYER { ... }
interface MENU_PLAYER   { ... }
```

## File types (compatibility stubs)

```ts
interface al_ffblk  { attrib, time, name }
interface DATAFILE  { dat, type, size, prop }
interface PACKFILE  { vtable, userdata, is_normal_packfile, normal? }
interface PACKFILE_VTABLE { userdata: string }
interface LZSS_PACK_DATA   { ... }
interface LZSS_UNPACK_DATA { ... }
```
