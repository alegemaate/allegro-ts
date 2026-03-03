# Math

Utility math functions compatible with the Allegro 4 math API.

## Constants

```ts
const PI = 3.14159265;
const PI2 = 2 * PI; // full circle in radians
const PI_2 = PI / 2; // 90°
const PI_3 = PI / 3; // 60°
const PI_4 = PI / 4; // 45°
```

## Random numbers

```ts
function rand(): number; // integer 0–65535
function AL_RAND(): number; // alias for rand()
function rand32(): number; // integer –2147483648 to 2147483647
function frand(): number; // float 0.0–1.0
```

```ts
// Roll a d6
const die = (rand() % 6) + 1;

// Random float in 0.0–10.0
const value = frand() * 10;
```

## Basic math

```ts
function abs(a: number): number; // absolute value
function floor(num: number): number; // Math.floor
function scaleclamp(value, min, max, newMin, newMax): number;
```

`scaleclamp` maps `value` from the range `[min, max]` to `[newMin, newMax]` and clamps the result to the new range.

```ts
// Map health 0–100 to bar width 0–200px
const barWidth = scaleclamp(health, 0, 100, 0, 200);
```

## Fixed-point angles

Allegro 4 uses a fixed-point angle system where **256 = full circle** (360°). allegro-ts uses this convention in all rotation functions.

```ts
function fix_to_rad(d: number): number;
```

Converts an Allegro fixed-point angle to radians (used internally by the rotation functions).

| Allegro angle | Degrees | radians |
| ------------- | ------- | ------- |
| 0             | 0°      | 0       |
| 64            | 90°     | π/2     |
| 128           | 180°    | π       |
| 192           | 270°    | 3π/2    |
| 256           | 360°    | 2π      |
