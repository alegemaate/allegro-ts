# Keyboard

## Installation

```ts
function install_keyboard(enable_keys?: number[]): number;
function remove_keyboard(): number;
```

Attaches `keydown`/`keyup` listeners to `document`. By default, all keys except F1–F12 and Escape have their browser default action suppressed (no back navigation, no scrolling, etc.).

Pass `enable_keys` to customise which keys keep their default browser behavior:

```ts
// Allow F5 (reload) and Escape, suppress everything else
install_keyboard([KEY_F5, KEY_ESC]);
```

Returns `0` on success, `-1` if already installed.

## key array

```ts
const key: boolean[];
```

Indexed by key code. `key[KEY_A]` is `true` while the A key is held down.

```ts
install_keyboard();

// In your game loop:
if (key[KEY_LEFT]) player.x -= 2;
if (key[KEY_RIGHT]) player.x += 2;
if (key[KEY_SPACE]) shoot();
```

## key_shifts

```ts
let key_shifts: number;
```

Bitmask of currently held modifier keys. Check with the `KB_*_FLAG` constants:

```ts
if (key_shifts & KB_SHIFT_FLAG) console.log("Shift held");
if (key_shifts & KB_CTRL_FLAG) console.log("Ctrl held");
if (key_shifts & KB_ALT_FLAG) console.log("Alt held");
```

### Shift flag constants

| Constant           | Value    |
| ------------------ | -------- |
| `KB_SHIFT_FLAG`    | `0x0001` |
| `KB_CTRL_FLAG`     | `0x0002` |
| `KB_ALT_FLAG`      | `0x0004` |
| `KB_LWIN_FLAG`     | `0x0008` |
| `KB_RWIN_FLAG`     | `0x0010` |
| `KB_MENU_FLAG`     | `0x0020` |
| `KB_COMMAND_FLAG`  | `0x0040` |
| `KB_SCROLOCK_FLAG` | `0x0100` |
| `KB_NUMLOCK_FLAG`  | `0x0200` |
| `KB_CAPSLOCK_FLAG` | `0x0400` |
| `KB_INALTSEQ_FLAG` | `0x0800` |

## Key buffer

```ts
const key_buffer: number[];

function keypressed(): boolean;
async function readkey(): Promise<number>;
function clear_keybuf(): void;
```

`key_buffer` stores key codes as they are pressed. `readkey()` is an async function that resolves with the next key from the buffer, waiting if it's empty:

```ts
const k = await readkey();
if (k >> 8 === KEY_ENTER) startGame();
```

## Key codes

```ts
// Letters
KEY_A ... KEY_Z

// Numbers (top row)
KEY_0 ... KEY_9

// Numpad
KEY_0_PAD ... KEY_9_PAD
KEY_PLUS_PAD, KEY_MINUS_PAD, KEY_ASTERISK, KEY_SLASH_PAD
KEY_DEL_PAD, KEY_ENTER_PAD, KEY_EQUALS_PAD

// Function keys
KEY_F1 ... KEY_F12

// Navigation
KEY_ESC, KEY_TAB, KEY_ENTER, KEY_BACKSPACE, KEY_SPACE
KEY_INSERT, KEY_DEL, KEY_HOME, KEY_END, KEY_PGUP, KEY_PGDN
KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_DOWN

// Punctuation
KEY_MINUS, KEY_EQUALS, KEY_TILDE, KEY_BACKQUOTE, KEY_SEMICOLON
KEY_COLON, KEY_QUOTE, KEY_BACKSLASH, KEY_OPENBRACE, KEY_CLOSEBRACE
KEY_COMMA, KEY_STOP, KEY_SLASH

// Modifiers
KEY_LSHIFT, KEY_RSHIFT
KEY_LCONTROL, KEY_RCONTROL
KEY_ALT, KEY_ALTGR
KEY_LWIN, KEY_RWIN
KEY_MENU, KEY_CAPSLOCK, KEY_NUMLOCK, KEY_SCRLOCK
KEY_PRTSCR, KEY_PAUSE
```

## Simulating key presses

```ts
function simulate_keypress(key: number): void;
function simulate_ukeypress(key: number, scancode: number): void;
```

Pushes a key code into `key_buffer` and sets the corresponding `key[]` entry.

## Other (stubs / no-ops)

```ts
function poll_keyboard(): number; // always 0
function keyboard_needs_poll(): boolean; // always false
function scancode_to_ascii(scancode: number): number;
function scancode_to_name(scancode: number): number;
function set_leds(leds: number): void;
function set_keyboard_rate(delay: number, repeat: number): void;
```
