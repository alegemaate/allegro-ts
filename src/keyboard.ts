////////////////////////////////////////////
/// @name KEYBOARD ROUTINES
//@{

import { _allog, log } from "./debug";

export const KEY_A = 0x41,
  KEY_B = 0x42,
  KEY_C = 0x43,
  KEY_D = 0x44,
  KEY_E = 0x45,
  KEY_F = 0x46,
  KEY_G = 0x47,
  KEY_H = 0x48,
  KEY_I = 0x49,
  KEY_J = 0x4a,
  KEY_K = 0x4b,
  KEY_L = 0x4c,
  KEY_M = 0x4d,
  KEY_N = 0x4e,
  KEY_O = 0x4f,
  KEY_P = 0x50,
  KEY_Q = 0x51,
  KEY_R = 0x52,
  KEY_S = 0x53,
  KEY_T = 0x54,
  KEY_U = 0x55,
  KEY_V = 0x56,
  KEY_W = 0x57,
  KEY_X = 0x58,
  KEY_Y = 0x59,
  KEY_Z = 0x5a,
  KEY_0 = 0x30,
  KEY_1 = 0x31,
  KEY_2 = 0x32,
  KEY_3 = 0x33,
  KEY_4 = 0x34,
  KEY_5 = 0x35,
  KEY_6 = 0x36,
  KEY_7 = 0x37,
  KEY_8 = 0x38,
  KEY_9 = 0x39,
  KEY_0_PAD = 0x60,
  KEY_1_PAD = 0x61,
  KEY_2_PAD = 0x62,
  KEY_3_PAD = 0x63,
  KEY_4_PAD = 0x64,
  KEY_5_PAD = 0x65,
  KEY_6_PAD = 0x66,
  KEY_7_PAD = 0x67,
  KEY_8_PAD = 0x68,
  KEY_9_PAD = 0x69,
  KEY_F1 = 0x70,
  KEY_F2 = 0x71,
  KEY_F3 = 0x72,
  KEY_F4 = 0x73,
  KEY_F5 = 0x74,
  KEY_F6 = 0x75,
  KEY_F7 = 0x76,
  KEY_F8 = 0x77,
  KEY_F9 = 0x78,
  KEY_F10 = 0x79,
  KEY_F11 = 0x7a,
  KEY_F12 = 0x7b,
  KEY_ESC = 0x1b,
  KEY_TILDE = 0xc0,
  KEY_MINUS = 0xbd,
  KEY_EQUALS = 0xbb,
  KEY_BACKSPACE = 0x08,
  KEY_TAB = 0x09,
  KEY_OPENBRACE = 0xdb,
  KEY_CLOSEBRACE = 0xdd,
  KEY_ENTER = 0x0d,
  KEY_COLON = 0xba,
  KEY_QUOTE = 0xde,
  KEY_BACKSLASH = 0xdc,
  KEY_COMMA = 0xbc,
  KEY_STOP = 0xbe,
  KEY_SLASH = 0xbf,
  KEY_SPACE = 0x20,
  KEY_INSERT = 0x2d,
  KEY_DEL = 0x2e,
  KEY_HOME = 0x24,
  KEY_END = 0x23,
  KEY_PGUP = 0x21,
  KEY_PGDN = 0x22,
  KEY_LEFT = 0x25,
  KEY_RIGHT = 0x27,
  KEY_UP = 0x26,
  KEY_DOWN = 0x28,
  KEY_SLASH_PAD = 0x6f,
  KEY_ASTERISK = 0x6a,
  KEY_MINUS_PAD = 0x6d,
  KEY_PLUS_PAD = 0x6b,
  KEY_ENTER_PAD = 0x0d,
  KEY_PRTSCR = 0x2c,
  KEY_PAUSE = 0x13,
  KEY_EQUALS_PAD = 0x0c,
  KEY_LSHIFT = 0x10,
  KEY_RSHIFT = 0x10,
  KEY_LCONTROL = 0x11,
  KEY_RCONTROL = 0x11,
  KEY_ALT = 0x12,
  KEY_ALTGR = 0x12,
  KEY_LWIN = 0x5b,
  KEY_RWIN = 0x5c,
  KEY_MENU = 0x5d,
  KEY_SCRLOCK = 0x9d,
  KEY_NUMLOCK = 0x90,
  KEY_CAPSLOCK = 0x14;

/// Array of flags indicating state of each key.
/// Available keyboard scan codes are as follows:
/// *     KEY_A ... KEY_Z,
/// *     KEY_0 ... KEY_9,
/// *     KEY_0_PAD ... KEY_9_PAD,
/// *     KEY_F1 ... KEY_F12,
/// *     KEY_ESC, KEY_TILDE, KEY_MINUS, KEY_EQUALS, KEY_BACKSPACE, KEY_TAB, KEY_OPENBRACE, KEY_CLOSEBRACE, KEY_ENTER, KEY_COLON, KEY_QUOTE, KEY_BACKSLASH, KEY_COMMA, KEY_STOP, KEY_SLASH, KEY_SPACE,
/// *     KEY_INSERT, KEY_DEL, KEY_HOME, KEY_END, KEY_PGUP, KEY_PGDN, KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_DOWN,
/// *     KEY_SLASH_PAD, KEY_ASTERISK, KEY_MINUS_PAD, KEY_PLUS_PAD, KEY_DEL_PAD, KEY_ENTER_PAD,
/// *     KEY_PRTSCR, KEY_PAUSE,
/// *     KEY_LSHIFT, KEY_RSHIFT, KEY_LCONTROL, KEY_RCONTROL, KEY_ALT, KEY_ALTGR, KEY_LWIN, KEY_RWIN, KEY_MENU, KEY_SCRLOCK, KEY_NUMLOCK, KEY_CAPSLOCK
/// *     KEY_EQUALS_PAD, KEY_BACKQUOTE, KEY_SEMICOLON, KEY_COMMAND
const key: boolean[] = [];

/// Array of flags indicating in a key was just pressed since last loop()
/// Note that this will only work inside loop()
const pressed: boolean[] = [];

/// Array of flags indicating in a key was just released since last loop()
/// Note that this will only work inside loop()
const released: boolean[] = [];

/// Is keyboard even installed
let _keyboard_installed = false;

/// default keys to not suppress
const _default_enabled_keys = [
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

/// array of prevent default avoiders
let _enabled_keys: number[] = [];

/// Installs keyboard handlers
/// Unlike mouse, keyboard can be installed before initialising graphics, and the handlers will function over the entire website, as opposed to canvas only. After this call, the key[] array can be used to check state of each key. All keys will have their default action disabled, unless specified in the enable_keys array. This means that i.e. backspace won't go back, arrows won't scroll. By default, function keys  (KEY_F1..KEY_F12) are the only ones not suppressed
/// @param enable_keys array of keys that are not going to have their default action prevented, i.e. [KEY_F5] will enable reloading the website. By default, if this is omitted, function keys are the only ones on the list.
function install_keyboard(enable_keys?: number[]) {
  if (_keyboard_installed) {
    _allog("Keyboard already installed");
    return -1;
  }
  if (enable_keys) {
    _enabled_keys = enable_keys;
  } else {
    _enabled_keys = _default_enabled_keys;
  }
  for (var c = 0; c < 0x80; c++) {
    key[c] = false;
    pressed[c] = false;
    released[c] = false;
  }
  document.addEventListener("keyup", _keyup);
  document.addEventListener("keydown", _keydown);
  _keyboard_installed = true;
  log("Keyboard installed!");
  return 0;
}

/// Uninstalls keyboard
function remove_keyboard() {
  if (!_keyboard_installed) {
    _allog("Keyboard not installed");
    return -1;
  }
  document.removeEventListener("keyup", _keyup);
  document.removeEventListener("keydown", _keydown);
  _keyboard_installed = false;
  log("Keyboard removed!");
  return 0;
}

/// key down event handler
function _keydown(e: KeyboardEvent) {
  if (!key[e.keyCode]) pressed[e.keyCode] = true;
  key[e.keyCode] = true;
  if (_enabled_keys.indexOf(e.keyCode) == -1) e.preventDefault();
}

/// key up event handler
function _keyup(e: KeyboardEvent) {
  key[e.keyCode] = false;
  released[e.keyCode] = true;
  if (_enabled_keys.indexOf(e.keyCode) == -1) e.preventDefault();
}

//@}
