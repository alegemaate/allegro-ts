# Timer

## Installation

```ts
function install_timer(): number;
function remove_timer(): void; // no-op
```

`install_timer()` sets up a 70Hz retrace counter and must be called before `install_int`.

## Interrupt timers

```ts
function install_int(proc: () => void, speed: number): void;
function install_int_ex(proc: () => void, speed: number): void;
function remove_int(proc: () => void): void;
```

`install_int` calls `proc` every `speed` milliseconds using `window.setInterval`.

`install_int_ex` is the same but accepts speed in timer units (which in the browser are milliseconds — see conversion functions below).

```ts
let fps = 0;
install_int(() => {
  fps++;
}, 1000); // called once per second
```

## Speed conversion helpers

```ts
function SECS_TO_TIMER(secs: number): number; // secs * 1000
function MSEC_TO_TIMER(msec: number): number; // msec (passthrough)
function BPS_TO_TIMER(bps: number): number; // 1000 / bps
function BPM_TO_TIMER(bpm: number): number; // (60 * 1000) / bpm
```

```ts
// Call proc 30 times per second
install_int_ex(proc, BPS_TO_TIMER(30));

// Call proc every 2 seconds
install_int_ex(proc, SECS_TO_TIMER(2));
```

## retrace_count

```ts
let retrace_count: number;
```

Incremented 70 times per second by an internal timer installed by `install_timer()`. Useful for framerate-independent timing:

```ts
const start = retrace_count;
// ... do work ...
const elapsed = retrace_count - start; // in 1/70 second units
```

## rest

```ts
async function rest(time: number): Promise<void>;
async function rest_callback(time: number, callback?: () => void): Promise<void>;
```

Pauses execution for `time` milliseconds without blocking the browser event loop. Ideal for use in `async` game loops:

```ts
while (!key[KEY_ESC]) {
  update();
  draw();
  await rest(16); // ~60fps
}
```

## Variable locking (no-ops)

```ts
function LOCK_VARIABLE(variable_name: number | string): void;
function LOCK_FUNCTION(function_name: (...args: never) => void): void;
function END_OF_FUNCTION(function_name: (...args: never) => void): void;
```

In the original Allegro these lock memory pages for interrupt handlers. They are no-ops in the browser.

## Parameter interrupts (stubs)

```ts
function install_param_int(procedure, param, speed): void;
function install_param_int_ex(procedure, param, speed): void;
function remove_param_int(proc, param): void;
```
