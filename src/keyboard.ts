import { log } from "./debug";

interface _KeyboardState {
  installed: boolean;
  enabled_keys: number[];
  key_shifts: number;
  init: () => void;
  destroy: () => void;
  resolvers: ((k: number) => void)[];
}

export const _keyboard_state: _KeyboardState = {
  installed: false,
  enabled_keys: [],
  key_shifts: 0,
  init: (): void => {
    _keyboard_state.installed = false;
    _keyboard_state.enabled_keys = [];
    _keyboard_state.key_shifts = 0;
  },
  destroy: (): void => {
    if (_keyboard_state.installed) {
      remove_keyboard();
    }
    _keyboard_state.installed = false;
    _keyboard_state.resolvers = [];
  },
  resolvers: [],
};

/**
 * Keyboard driverr
 *
 * @remarks
 * The driver we use for timer routines.
 * Only exists for compatibility.
 *
 */
export const keyboard_driver = {
  id: 0,
  name: "Browser Keyboard",
  desc: " Browser Keyboard",
  ascii_name: "Browser Keyboard",
};

/**
 * Installs keyboard handlers
 *
 * @remarks
 * Unlike mouse, keyboard can be installed before initialising graphics, and the handlers will function over the entire website, as opposed to canvas only. After this call, the key[] array can be used to check state of each key. All keys will have their default action disabled, unless specified in the enable_keys array. This means that i.e. backspace won't go back, arrows won't scroll. By default, function keys  (KEY_F1..KEY_F12) are the only ones not suppressed
 *
 * @param enable_keys - array of keys that are not going to have their default action prevented, i.e. [KEY_F5] will enable reloading the website. By default, if this is omitted, function keys are the only ones on the list.
 *
 * @allegro 1.7.1
 */
export function install_keyboard(enable_keys?: number[]): number {
  if (_keyboard_state.installed) {
    log("Keyboard already installed");
    return -1;
  }
  if (enable_keys) {
    _keyboard_state.enabled_keys = enable_keys;
  } else {
    const default_enabled_keys = [
      KEY_F1,
      KEY_F2,
      KEY_F3,
      KEY_F4,
      KEY_F5,
      KEY_F6,
      KEY_F7,
      KEY_F8,
      KEY_F9,
      KEY_F10,
      KEY_F11,
      KEY_F12,
    ];

    _keyboard_state.enabled_keys = default_enabled_keys;
  }
  for (let c = 0; c < 0x80; c += 1) {
    key[c] = false;
  }
  window.addEventListener("keyup", _keyup);
  window.addEventListener("keydown", _keydown);
  window.addEventListener("blur", _reset_keys);
  _keyboard_state.installed = true;
  log("Keyboard installed!");
  return 0;
}

/**
 * Uninstalls keyboard
 *
 * @remarks
 * Simply removes event listeners from window
 *
 * @allegro 1.7.2
 */
export function remove_keyboard(): number {
  if (!_keyboard_state.installed) {
    log("Keyboard not installed");
    return -1;
  }
  window.removeEventListener("keyup", _keyup);
  window.removeEventListener("keydown", _keydown);
  window.removeEventListener("blur", _reset_keys);
  _keyboard_state.installed = false;
  log("Keyboard removed!");
  return 0;
}

/**
 * Installs hooks for keyboard input
 *
 * @remarks
 * Not implemented
 *
 * @param keypressed - Callback on keypress
 * @param readkey - Callback for handling key read
 *
 * @allegro 1.7.3
 *
 * @alpha
 */
export function install_keyboard_hooks(keypressed: () => void, readkey: () => void): void {
  void keypressed;
  void readkey;
}

/**
 * Poll Keyboard
 *
 * @remarks
 * Needs to do nothing since our key events are happening in background using events
 *
 * @allegro 1.7.4
 */
export function poll_keyboard(): number {
  return 0;
}

/**
 * Keyboard needs poll
 *
 * @remarks
 * Always false since we do not use polling system
 *
 * @allegro 1.7.5
 */
export function keyboard_needs_poll(): boolean {
  return false;
}

/**
 * Array of flags indicating state of each key.
 *
 * @remarks
 * Available keyboard scan codes are as follows:
 *   KEY_A ... KEY_Z,
 *   KEY_0 ... KEY_9,
 *   KEY_0_PAD ... KEY_9_PAD,
 *   KEY_F1 ... KEY_F12,
 *   KEY_ESC, KEY_TILDE, KEY_MINUS, KEY_EQUALS, KEY_BACKSPACE, KEY_TAB, KEY_OPENBRACE, KEY_CLOSEBRACE, KEY_ENTER, KEY_COLON, KEY_QUOTE, KEY_BACKSLASH, KEY_COMMA, KEY_STOP, KEY_SLASH, KEY_SPACE,
 *   KEY_INSERT, KEY_DEL, KEY_HOME, KEY_END, KEY_PGUP, KEY_PGDN, KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_DOWN,
 *   KEY_SLASH_PAD, KEY_ASTERISK, KEY_MINUS_PAD, KEY_PLUS_PAD, KEY_DEL_PAD, KEY_ENTER_PAD,
 *   KEY_PRTSCR, KEY_PAUSE,
 *   KEY_LSHIFT, KEY_RSHIFT, KEY_LCONTROL, KEY_RCONTROL, KEY_ALT, KEY_ALTGR, KEY_LWIN, KEY_RWIN, KEY_MENU, KEY_SCRLOCK, KEY_NUMLOCK, KEY_CAPSLOCK
 *   KEY_EQUALS_PAD, KEY_BACKQUOTE, KEY_SEMICOLON, KEY_COMMAND
 *
 * @allegro 1.7.6
 */
export const key: boolean[] = [];

export const key_buffer: number[] = [];

/**
 * Packed status of special keys
 *
 * @remarks
 * This is set in the key listener
 *
 * @allegro 1.7.7
 */
export const key_shifts = {
  get value(): number {
    return _keyboard_state.key_shifts;
  },
};

/**
 * Check if any key has been pressed
 *
 * @remarks
 * Simply checks key buffer for existing keys
 *
 * @allegro 1.7.8
 */
export function keypressed(): boolean {
  return key_buffer.length > 0;
}

/**
 * Read key from keybuffer
 *
 * @remarks
 * This function is a promise that resolves when a key has been put in the keybuffer.
 * Once one has beeen found, it pops the key off the top off the key_buffer stack and returns it.
 *
 * Returns the next character from the keyboard buffer, in ASCII format. If the buffer is empty,
 * it waits until a key is pressed. You can see if there are queued keypresses with keypressed().
 *
 * @allegro 1.7.9
 */
export function readkey(): Promise<number> {
  if (key_buffer.length > 0) {
    const top = key_buffer.shift();
    return Promise.resolve(typeof top === "number" ? top : -1);
  }
  return new Promise((resolve) => {
    _keyboard_state.resolvers.push(resolve);
  });
}

/**
 * Read unicode key
 *
 * @remarks
 * Not implemented
 *
 * @param scancode - Unicode scancode to read
 *
 * @allegro 1.7.10
 *
 * @alpha
 */
export function ureadkey(scancode: number): number {
  void scancode;
  return 0;
}

/**
 * Convert scancode to ascii
 *
 * @remarks
 * Not implemented
 *
 * @param scancode - Unicode scancode to convert to ascii
 *
 * @allegro 1.7.11
 *
 * @alpha
 */
export function scancode_to_ascii(scancode: number): number {
  return scancode;
}

/**
 * Convert scancode to name
 *
 * @remarks
 * Not implemented
 *
 * @param scancode - Unicode scancode
 *
 * @allegro 1.7.12
 *
 * @alpha
 */
export function scancode_to_name(scancode: number): number {
  return scancode;
}

/**
 * Simulate keypress
 *
 * @remarks
 * Shoves a key into the keybuffer as if it has been pressed.
 *
 * @param key - Key to simulate pressing
 *
 * @allegro 1.7.13
 */
export function simulate_keypress(key: number): void {
  _keydown_handler(key);
}

/**
 * Simulate ukeypress
 *
 * @remarks
 * Not implemented
 *
 * @param key - Code of key
 * @param scancode - Code for unicode character
 *
 * @allegro 1.7.14
 *
 * @alpha
 */
export function simulate_ukeypress(key: number, scancode: number): void {
  void scancode;
  _keydown_handler(key);
}

/**
 * Keyboard callback
 *
 * @remarks
 * Not implemented
 *
 * @param key - Code of key
 *
 * @allegro 1.7.15
 *
 * @alpha
 */
export function keyboard_callback(key: number): void {
  void key;
}

/**
 * Keyboard unicode callback
 *
 * @remarks
 * Not implemented
 *
 * @param key - ASCII key code
 * @param scancode - Code for unicode character
 *
 * @allegro 1.7.16
 *
 * @alpha
 */
export function keyboard_ucallback(key: number, scancode: number): void {
  void key;
  void scancode;
}

/**
 * Low level of keyboard callback
 *
 * @remarks
 * Not implemented
 *
 * @param key - ASCII key code
 *
 * @allegro 1.7.17
 *
 * @alpha
 */
export function keyboard_lowlevel_callback(key: number): void {
  void key;
}

/**
 * Set keyboard LEDS
 *
 * @remarks
 * Not implemented
 *
 * @param leds - Packed int containing leds to enable
 *
 * @allegro 1.7.18
 *
 * @alpha
 */
export function set_leds(leds: number): void {
  void leds;
}

/**
 * Set keyboard rate
 *
 * @remarks
 * Meant to limit how often keyboard is polled for repeated keys, probably can not implement
 *
 * @param delay - Delay time
 * @param repeat - Disable repeated keys
 *
 * @allegro 1.7.19
 *
 * @alpha
 */
export function set_keyboard_rate(delay: number, repeat: number): void {
  void delay;
  void repeat;
}

/**
 * Clear keybuffer
 *
 * @remarks
 * Clears all items from key_buffer
 *
 * @allegro 1.7.20
 */
export function clear_keybuf(): void {
  key_buffer.length = 0;
}

/**
 * Three finger flag
 *
 * @remarks
 * Not implemented
 *
 * @allegro 1.7.21
 *
 * @alpha
 */
export const three_finger_flag = false;

/**
 * Key Led Flag
 *
 * @remarks
 * Not implemented
 *
 * @allegro 1.7.22
 *
 * @alpha
 */
export const key_led_flag = false;

/**
 * KEY Codes
 *
 * @remarks
 * These should be identical to allegro key codes
 *
 */
export const KEY_0 = 0x30;
export const KEY_0_PAD = 0x60;
export const KEY_1 = 0x31;
export const KEY_1_PAD = 0x61;
export const KEY_2 = 0x32;
export const KEY_2_PAD = 0x62;
export const KEY_3 = 0x33;
export const KEY_3_PAD = 0x63;
export const KEY_4 = 0x34;
export const KEY_4_PAD = 0x64;
export const KEY_5 = 0x35;
export const KEY_5_PAD = 0x65;
export const KEY_6 = 0x36;
export const KEY_6_PAD = 0x66;
export const KEY_7 = 0x37;
export const KEY_7_PAD = 0x67;
export const KEY_8 = 0x38;
export const KEY_8_PAD = 0x68;
export const KEY_9 = 0x39;
export const KEY_9_PAD = 0x69;
export const KEY_A = 0x41;
export const KEY_ALT = 0x12;
export const KEY_ALTGR = 0x12;
export const KEY_ASTERISK = 0x6a;
export const KEY_B = 0x42;
export const KEY_BACKSLASH = 0xdc;
export const KEY_BACKSPACE = 0x08;
export const KEY_C = 0x43;
export const KEY_CAPSLOCK = 0x14;
export const KEY_CLOSEBRACE = 0xdd;
export const KEY_COLON = 0xba;
export const KEY_COMMA = 0xbc;
export const KEY_D = 0x44;
export const KEY_DEL = 0x2e;
export const KEY_DOWN = 0x28;
export const KEY_E = 0x45;
export const KEY_END = 0x23;
export const KEY_ENTER = 0x0d;
export const KEY_ENTER_PAD = 0x0d;
export const KEY_EQUALS = 0xbb;
export const KEY_EQUALS_PAD = 0x0c;
export const KEY_ESC = 0x1b;
export const KEY_F = 0x46;
export const KEY_F1 = 0x70;
export const KEY_F10 = 0x79;
export const KEY_F11 = 0x7a;
export const KEY_F12 = 0x7b;
export const KEY_F2 = 0x71;
export const KEY_F3 = 0x72;
export const KEY_F4 = 0x73;
export const KEY_F5 = 0x74;
export const KEY_F6 = 0x75;
export const KEY_F7 = 0x76;
export const KEY_F8 = 0x77;
export const KEY_F9 = 0x78;
export const KEY_G = 0x47;
export const KEY_H = 0x48;
export const KEY_HOME = 0x24;
export const KEY_I = 0x49;
export const KEY_INSERT = 0x2d;
export const KEY_J = 0x4a;
export const KEY_K = 0x4b;
export const KEY_L = 0x4c;
export const KEY_LCONTROL = 0x11;
export const KEY_LEFT = 0x25;
export const KEY_LSHIFT = 0x10;
export const KEY_LWIN = 0x5b;
export const KEY_M = 0x4d;
export const KEY_MAX = 0xdf;
export const KEY_MENU = 0x5d;
export const KEY_MINUS = 0xbd;
export const KEY_MINUS_PAD = 0x6d;
export const KEY_N = 0x4e;
export const KEY_NUMLOCK = 0x90;
export const KEY_O = 0x4f;
export const KEY_OPENBRACE = 0xdb;
export const KEY_P = 0x50;
export const KEY_PAUSE = 0x13;
export const KEY_PGDN = 0x22;
export const KEY_PGUP = 0x21;
export const KEY_PLUS_PAD = 0x6b;
export const KEY_PRTSCR = 0x2c;
export const KEY_Q = 0x51;
export const KEY_QUOTE = 0xde;
export const KEY_R = 0x52;
export const KEY_RCONTROL = 0x11;
export const KEY_RIGHT = 0x27;
export const KEY_RSHIFT = 0x10;
export const KEY_RWIN = 0x5c;
export const KEY_S = 0x53;
export const KEY_SCRLOCK = 0x9d;
export const KEY_SLASH = 0xbf;
export const KEY_SLASH_PAD = 0x6f;
export const KEY_SPACE = 0x20;
export const KEY_STOP = 0xbe;
export const KEY_T = 0x54;
export const KEY_TAB = 0x09;
export const KEY_TILDE = 0xc0;
export const KEY_U = 0x55;
export const KEY_UP = 0x26;
export const KEY_V = 0x56;
export const KEY_W = 0x57;
export const KEY_X = 0x58;
export const KEY_Y = 0x59;
export const KEY_Z = 0x5a;

export const KB_ACCENT1_FLAG = 0x1000;
export const KB_ACCENT2_FLAG = 0x2000;
export const KB_ACCENT3_FLAG = 0x4000;
export const KB_ACCENT4_FLAG = 0x8000;
export const KB_ALT_FLAG = 0x0004;
export const KB_CAPSLOCK_FLAG = 0x0400;
export const KB_COMMAND_FLAG = 0x0040;
export const KB_CTRL_FLAG = 0x0002;
export const KB_INALTSEQ_FLAG = 0x0800;
export const KB_LWIN_FLAG = 0x0008;
export const KB_MENU_FLAG = 0x0020;
export const KB_NUMLOCK_FLAG = 0x0200;
export const KB_RWIN_FLAG = 0x0010;
export const KB_SCROLOCK_FLAG = 0x0100;
export const KB_SHIFT_FLAG = 0x0001;

/**
 * Internal Keyboard loop
 *
 * @remarks
 * Run internal keyboard routines
 *
 * @internal
 */
export function _keyboard_loop(): void {
  if (_keyboard_state.installed) {
    // Nothing
  }
}

/**
 * Internal blur handler
 *
 * @remarks
 * Resets all key states when the window loses focus to prevent stuck keys
 *
 * @internal
 */
function _reset_keys(): void {
  for (let c = 0; c < 0x80; c += 1) {
    key[c] = false;
  }
  _keyboard_state.key_shifts = 0;
}

/**
 * Internal keydown listener
 *
 * @remarks
 * Gets called when a key is down if keyboard has been installed
 *
 * @internal
 */
function _keydown(e: KeyboardEvent): void {
  if (!e.repeat) {
    _keydown_handler(e.keyCode, e.key);
  }
  if (!_keyboard_state.enabled_keys.includes(e.keyCode)) {
    e.preventDefault();
  }
}

/**
 * Internal keydown helper
 *
 * @remarks
 * Set keycodes and add to keybuffer
 *
 * Notes on Scancodes and ASCII codes:
 * The low byte of the return value contains the ASCII code of the key, and the high byte the scancode.
 * The scancode remains the same whatever the state of the shift, ctrl and alt keys, while the
 * ASCII code is affected by shift and ctrl in the normal way (shift changes case, ctrl+letter gives
 * the position of that letter in the alphabet, eg. ctrl+A = 1, ctrl+B = 2, etc). Pressing alt+key
 * returns only the scancode, with a zero ASCII code in the low byte. For example:
 *
 * @internal
 */
function _keydown_handler(scanCode: number, ascii?: string): void {
  key[scanCode] = true;

  key_buffer.push((scanCode << 8) | (ascii?.length === 1 ? ascii.charCodeAt(0) : 0));

  // If there are any resolvers waiting for a key, resolve the oldest one with the new key
  if (_keyboard_state.resolvers.length > 0) {
    _keyboard_state.resolvers.shift()?.(key_buffer.shift() ?? -1);
  }

  switch (scanCode) {
    case KEY_LSHIFT:
    case KEY_RSHIFT:
      _keyboard_state.key_shifts |= KB_SHIFT_FLAG;
      break;
    case KEY_LCONTROL:
    case KEY_RCONTROL:
      _keyboard_state.key_shifts |= KB_CTRL_FLAG;
      break;
    case KEY_ALT:
      _keyboard_state.key_shifts |= KB_ALT_FLAG;
      break;
    case KEY_LWIN:
      _keyboard_state.key_shifts |= KB_LWIN_FLAG;
      break;
    case KEY_RWIN:
      _keyboard_state.key_shifts |= KB_RWIN_FLAG;
      break;
    case KEY_MENU:
      _keyboard_state.key_shifts |= KB_MENU_FLAG;
      break;
    case KEY_SCRLOCK:
      _keyboard_state.key_shifts |= KB_SCROLOCK_FLAG;
      break;
    case KEY_NUMLOCK:
      _keyboard_state.key_shifts |= KB_NUMLOCK_FLAG;
      break;
    case KEY_CAPSLOCK:
      _keyboard_state.key_shifts |= KB_CAPSLOCK_FLAG;
      break;
    default:
      break;
  }
}

/**
 * Internal keyup handler
 *
 * @remarks
 * Gets called when a key is up if keyboard has been installed
 *
 * @internal
 */
function _keyup(e: KeyboardEvent): void {
  _keyup_handler(e.keyCode);
  if (!_keyboard_state.enabled_keys.includes(e.keyCode)) {
    e.preventDefault();
  }
}

/**
 * Internal keyup helper
 *
 * @remarks
 * Unset keycodes
 *
 * @internal
 */
function _keyup_handler(scanCode: number): void {
  key[scanCode] = false;

  switch (scanCode) {
    case KEY_LSHIFT:
    case KEY_RSHIFT:
      _keyboard_state.key_shifts &= ~KB_SHIFT_FLAG;
      break;
    case KEY_LCONTROL:
    case KEY_RCONTROL:
      _keyboard_state.key_shifts &= ~KB_CTRL_FLAG;
      break;
    case KEY_ALT:
      _keyboard_state.key_shifts &= ~KB_ALT_FLAG;
      break;
    case KEY_LWIN:
      _keyboard_state.key_shifts &= ~KB_LWIN_FLAG;
      break;
    case KEY_RWIN:
      _keyboard_state.key_shifts &= ~KB_RWIN_FLAG;
      break;
    case KEY_MENU:
      _keyboard_state.key_shifts &= ~KB_MENU_FLAG;
      break;
    case KEY_SCRLOCK:
      _keyboard_state.key_shifts &= ~KB_SCROLOCK_FLAG;
      break;
    case KEY_NUMLOCK:
      _keyboard_state.key_shifts &= ~KB_NUMLOCK_FLAG;
      break;
    case KEY_CAPSLOCK:
      _keyboard_state.key_shifts &= ~KB_CAPSLOCK_FLAG;
      break;
    default:
      break;
  }
}
