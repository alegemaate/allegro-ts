import { _error, log } from "./debug";
import { _bitmap_state } from ".";

import { draw_sprite } from "./sprites";

import { type BITMAP } from "./types";

// Global state
interface _MouseState {
  // Is mouse installed?
  installed: boolean;

  // Cursor focus
  focus_x: number;
  focus_y: number;

  // Custom cursors
  hardware_cursor: boolean;
  selected_cursor: number;
  cursors: Record<number, BITMAP | null>;

  // Mouse position
  x: number;
  y: number;
  z: number;
  w: number;
  b: number;

  // Motion
  mx: number;
  my: number;
  mz: number;

  // Last mouse x position
  last_mouse_x: number;

  // Last mouse y position
  last_mouse_y: number;

  // Last mouse wheel position
  last_mouse_z: number;

  // Is menu suppressed?
  menu_supress: boolean;

  // Initializes mouse state
  init: () => void;

  destroy: () => void;
}

export const _mouse_state: _MouseState = {
  installed: false,
  focus_x: 0,
  focus_y: 0,
  hardware_cursor: false,
  selected_cursor: 0,
  cursors: {},
  x: 0,
  y: 0,
  z: 0,
  w: 0,
  b: 0,
  mx: 0,
  my: 0,
  mz: 0,
  last_mouse_x: -1,
  last_mouse_y: -1,
  last_mouse_z: -1,
  menu_supress: false,
  init: (): void => {
    _mouse_state.installed = false;
    _mouse_state.focus_x = 0;
    _mouse_state.focus_y = 0;
    _mouse_state.hardware_cursor = false;
    _mouse_state.selected_cursor = 0;
    _mouse_state.cursors = {};
    _mouse_state.x = 0;
    _mouse_state.y = 0;
    _mouse_state.z = 0;
    _mouse_state.w = 0;
    _mouse_state.b = 0;
    _mouse_state.mx = 0;
    _mouse_state.my = 0;
    _mouse_state.mz = 0;
    _mouse_state.last_mouse_x = -1;
    _mouse_state.last_mouse_y = -1;
    _mouse_state.last_mouse_z = -1;
    _mouse_state.menu_supress = false;
  },
  destroy: (): void => {
    if (_mouse_state.installed) {
      remove_mouse();
    }
    _mouse_state.installed = false;
    _mouse_state.cursors = {};
  },
};

// Types
export const MOUSE_CURSOR_NONE = 0;
export const MOUSE_CURSOR_ALLEGRO = 1;
export const MOUSE_CURSOR_ARROW = 2;
export const MOUSE_CURSOR_BUSY = 3;
export const MOUSE_CURSOR_QUESTION = 4;
export const MOUSE_CURSOR_EDIT = 5;
export const AL_NUM_MOUSE_CURSORS = 6;

interface MOUSE_DRIVER {
  id: number;
  name: string;
  desc: string;
  ascii_name: string;
}

export const MOUSEDRV_AUTODETECT = -1;
export const MOUSEDRV_NONE = 0;

export const mouse_driver: MOUSE_DRIVER = {
  id: MOUSEDRV_NONE,
  name: "",
  desc: "",
  ascii_name: "No mouse",
};

/**
 * Installs mouse handlers.
 *
 * @remarks
 * Must be called after set_gfx_mode() to be able to determine mouse position within the given canvas!
 *
 * @param menu - If true, context menu will be available on right click on canvas. Default is false.
 *
 * @allegro 1.5.1
 */
export function install_mouse(menu = false): number {
  if (_mouse_state.installed) {
    log("Mouse already installed");
    return -1;
  }

  if (!_bitmap_state.screen.canvas) {
    _error("Screen canvas not found, cannot install mouse!");
    return -1;
  }

  mouse_driver.id = MOUSEDRV_AUTODETECT;
  mouse_driver.name = "Browser Mouse";
  mouse_driver.desc = "Allegro Browser Handler";
  mouse_driver.ascii_name = "Browser Mouse";

  _bitmap_state.screen.canvas.addEventListener("mouseup", _mouseup);
  _bitmap_state.screen.canvas.addEventListener("mousedown", _mousedown);
  _bitmap_state.screen.canvas.addEventListener("mousemove", _mousemove);
  _bitmap_state.screen.canvas.addEventListener("wheel", _mousewheel);

  if (menu) {
    _mouse_state.menu_supress = true;
  } else {
    _bitmap_state.screen.canvas.addEventListener("contextmenu", _mousemenu);
    _mouse_state.menu_supress = false;
  }

  _mouse_state.installed = true;

  log("Mouse installed!");

  return 0;
}

/**
 * Removes mouse handlers.
 *
 * @remarks
 * Remove mouse handler
 *
 * @allegro 1.5.2
 */
export function remove_mouse(): number {
  if (!_mouse_state.installed) {
    _error("You must call install_mouse before remove_mouse");
    return -1;
  }

  if (!_bitmap_state.screen.canvas) {
    _error("Screen canvas not found, cannot remove mouse!");
    return -1;
  }

  _bitmap_state.screen.canvas.removeEventListener("mouseup", _mouseup);
  _bitmap_state.screen.canvas.removeEventListener("mousedown", _mousedown);
  _bitmap_state.screen.canvas.removeEventListener("mousemove", _mousemove);
  _bitmap_state.screen.canvas.removeEventListener("wheel", _mousewheel);
  if (_mouse_state.menu_supress) {
    _bitmap_state.screen.canvas.removeEventListener("contextmenu", _mousemenu);
  }
  _mouse_state.installed = false;
  log("Mouse removed!");
  return 0;
}

/**
 * Poll Mouse
 *
 * @remarks
 * Does nothing!
 *
 * @allegro 1.5.3
 */
export function poll_mouse(): void {
  _mouse_loop();
}

/**
 * Mouse needs poll
 *
 * @remarks
 * Returns false, since we don't poll
 *
 * @allegro 1.5.4
 */
export function mouse_needs_poll(): boolean {
  return false;
}

/**
 * Enable hardware cursor
 *
 * @remarks
 * Enable hardware cursor (aka browser cursor)
 *
 * @allegro 1.5.5
 */
export function enable_hardware_cursor(): void {
  _mouse_state.hardware_cursor = true;
}

/**
 * Disable hardware cursor
 *
 * @remarks
 * Disables hardware cursor
 *
 * @allegro 1.5.6
 */
export function disable_hardware_cursor(): void {
  _mouse_state.hardware_cursor = false;
}

/**
 * Select mouse cursor
 *
 * @remarks
 * Select mouse cursor (sprite or os)
 *
 * @param cursor - Cursor type
 *
 * @allegro 1.5.7
 */
export function select_mouse_cursor(cursor: number): void {
  _mouse_state.selected_cursor = cursor;
  if (_mouse_state.hardware_cursor) {
    show_os_cursor(cursor);
  }
}

/**
 * Set mouse cursor bitmap
 *
 * @remarks
 * Override default bitmap sprite for cursor type
 *
 * @param cursor - Type to override
 * @param bmp - Bitmap to use
 *
 * @allegro 1.5.8
 */
export function set_mouse_cursor_bitmap(cursor: number, bmp: BITMAP | null): void {
  _mouse_state.cursors[cursor] = bmp;
}

/**
 * Mouse X position within the canvas
 *
 * @allegro 1.5.9
 */
export const mouse_x = {
  get value(): number {
    return _mouse_state.x;
  },
};

/**
 * Mouse Y position within the canvas
 *
 * @allegro 1.5.9
 */
export const mouse_y = {
  get value(): number {
    return _mouse_state.y;
  },
};

/**
 * Mouse wheel position within the canvas
 *
 * @remarks
 * This might not work consistently across all browsers!
 *
 * @allegro 1.5.9
 */
export const mouse_z = {
  get value(): number {
    return _mouse_state.z;
  },
};

/**
 * Mouse fourth axis position
 *
 * @allegro 1.5.9
 */
export const mouse_w = {
  get value(): number {
    return _mouse_state.w;
  },
};

/**
 * Mouse button bitmask.
 *
 * @remarks
 * Each bit in the mask represents a separate mouse button state. If right mouse button is down, mouse_b value would be 4, 00100 in binary. Each bit represents one mouse button. use something like if (mouse_b&1) to check for separate buttons.
 * - Button 0 is LMB. (mouse_b&1)
 * - Button 1 is MMB / wheel. (mouse_b&2)
 * - Button 2 is RMB. (mouse_b&4)
 *
 * @allegro 1.5.9
 */
export const mouse_b = {
  get value(): number {
    return _mouse_state.b;
  },
};

/**
 * Current mouse sprite
 *
 * @allegro 1.5.10
 */
export const mouse_sprite: BITMAP | null = null;

/**
 * Show mouse
 *
 * @remarks
 * Enables showing system mouse cursor over bitmap
 *
 * @returns -1 on fail, 0 on success
 *
 * @allegro 1.5.11
 */
export function show_mouse(bmp: BITMAP | null): number {
  if (!_mouse_state.installed) {
    _error("You must call install_mouse before show_mouse");
    return -1;
  }

  if (!_bitmap_state.screen.canvas) {
    _error("Screen canvas not found, cannot show mouse!");
    return -1;
  }

  if (bmp) {
    _bitmap_state.screen.canvas.style.cursor = "auto";
  } else {
    _bitmap_state.screen.canvas.style.cursor = "none";
  }
  return 0;
}

/**
 * Scare mouse
 *
 * @remarks
 * Disables system mouse cursor over canvas.
 * Use this if you would like to provide your own cursor bitmap
 *
 * @returns -1 on fail, 0 on success
 *
 * @allegro 1.5.12
 */
export function scare_mouse(): number {
  if (!_mouse_state.installed) {
    _error("You must call install_mouse before hide_mouse");
    return -1;
  }

  if (!_bitmap_state.screen.canvas) {
    _error("Screen canvas not found, cannot scare mouse!");
    return -1;
  }

  _bitmap_state.screen.canvas.style.cursor = "none";

  return 0;
}

/**
 * Scare mouse area
 *
 * @remarks
 * Not implemented
 *
 * @param x - X point
 * @param y - Y point
 * @param w - Width of area
 * @param h - Height of area
 *
 * @allegro 1.5.13
 */
export function scare_mouse_area(x: number, y: number, w: number, h: number): void {
  void x;
  void y;
  void w;
  void h;
}

/**
 * Show OS cursor
 *
 * @remarks
 * Shows os cursor instead of sprite cursor
 *
 * @param cursor - type of cursor
 *
 * @allegro 1.5.15
 */
export function show_os_cursor(cursor: number): void {
  if (!_bitmap_state.screen.canvas) {
    return;
  }

  switch (cursor) {
    case MOUSE_CURSOR_ALLEGRO:
      _bitmap_state.screen.canvas.style.cursor = "auto";
      break;
    case MOUSE_CURSOR_ARROW:
      _bitmap_state.screen.canvas.style.cursor = "move";
      break;
    case MOUSE_CURSOR_BUSY:
      _bitmap_state.screen.canvas.style.cursor = "wait";
      break;
    case MOUSE_CURSOR_EDIT:
      _bitmap_state.screen.canvas.style.cursor = "crosshair";
      break;
    case MOUSE_CURSOR_NONE:
      _bitmap_state.screen.canvas.style.cursor = "auto";
      break;
    case MOUSE_CURSOR_QUESTION:
      _bitmap_state.screen.canvas.style.cursor = "help";
      break;
    default:
      _bitmap_state.screen.canvas.style.cursor = "auto";
      break;
  }
}

/**
 * Freeze mouse flag
 *
 * @remarks
 * Not implemented
 *
 * @allegro 1.5.16
 */
export const freeze_mouse_flag = false;

/**
 * Manually position mouse
 *
 * @remarks
 * This is simulataed
 *
 * @param x - X position to move to
 * @param y - Y position to move to
 *
 * @allegro 1.5.17
 */
export function position_mouse(x: number, y: number): void {
  _mouse_state.x = x;
  _mouse_state.y = y;
}

/**
 * Position mouse z
 *
 * @param mouse_z - Move z position manually
 *
 * @allegro 1.5.18
 */
export function position_mouse_z(z: number): void {
  _mouse_state.z = z;
}

/**
 * Set mouse range
 *
 * @remarks
 * Not implemented
 *
 * @param x1 - Min x position
 * @param y1 - Min y position
 * @param y2 - Max x position
 * @param y2 - Max y position
 *
 * @allegro 1.5.19
 */
export function set_mouse_range(x1: number, y1: number, x2: number, y2: number): void {
  void x1;
  void y1;
  void x2;
  void y2;
  // NOOP
}

/**
 * Set mouse speed
 *
 * @remarks
 * Not implemented
 *
 * @param xspeed - speed in x position
 * @param yspeed - speed in y position
 *
 * @allegro 1.5.20
 */
export function set_mouse_speed(xspeed: number, yspeed: number): void {
  void xspeed;
  void yspeed;
  // NOOP
}

/**
 * Set mouse sprite
 *
 * @remarks
 * Override default allegro sprite
 *
 * @param sprite - sprite to set
 *
 * @allegro 1.5.21
 */
export function set_mouse_sprite(sprite: BITMAP | null): void {
  _mouse_state.cursors[MOUSE_CURSOR_ALLEGRO] = sprite;
}

/**
 * Set mouse sprite focus
 *
 * @remarks
 * Not implemented
 *
 * @param x - Focus x position
 * @param y - Focus y position
 *
 * @allegro 1.5.22
 */
export function set_mouse_sprite_focus(x: number, y: number): void {
  _mouse_state.focus_x = x;
  _mouse_state.focus_y = y;
}

/**
 * Get mouse mickeys
 *
 * @remarks
 * Not implemented
 *
 * @allegro 1.5.23
 */
export function get_mouse_mickeys(mickeyx: number, mickeyy: number): void {
  void mickeyx;
  void mickeyy;
  // NOOP
}

/**
 * Mouse callback
 *
 * @remarks
 * Not implemented
 *
 * @allegro 1.5.24
 */
export function mouse_callback(flags: number): void {
  void flags;
  // NOOP
}

// Internal

// Mouse mickey, X position since last loop().
export const mouse_mx = {
  get value(): number {
    return _mouse_state.mx;
  },
};

// Mouse mickey, Y position since last loop().
export const mouse_my = {
  get value(): number {
    return _mouse_state.my;
  },
};

// Mouse mickey, wheel position since last loop().
export const mouse_mz = {
  get value(): number {
    return _mouse_state.mz;
  },
};

// Simple internal mouse loop
export function _mouse_loop(): void {
  if (_mouse_state.installed) {
    _mouse_state.mx = _mouse_state.x - _mouse_state.last_mouse_x;
    _mouse_state.my = _mouse_state.y - _mouse_state.last_mouse_y;
    _mouse_state.mz = _mouse_state.z - _mouse_state.last_mouse_z;
  }
}

// Mouse reset loop
export function _mouse_loop_reset(): void {
  if (_mouse_state.installed) {
    _mouse_state.mx = 0;
    _mouse_state.my = 0;
    _mouse_state.mz = 0;
    _mouse_state.last_mouse_x = _mouse_state.x;
    _mouse_state.last_mouse_y = _mouse_state.y;
    _mouse_state.last_mouse_z = _mouse_state.z;

    // Draw cursor
    const cursor = _mouse_state.cursors[_mouse_state.selected_cursor];
    if (cursor && !_mouse_state.hardware_cursor) {
      draw_sprite(
        _bitmap_state.screen,
        cursor,
        _mouse_state.x - _mouse_state.focus_x,
        _mouse_state.y - _mouse_state.focus_y,
      );
      if (_bitmap_state.screen.canvas) {
        _bitmap_state.screen.canvas.style.cursor = "none";
      }
    } else {
      show_os_cursor(_mouse_state.selected_cursor);
    }
  }
}

// Mouse context menu suppressor
function _mousemenu(e: MouseEvent): void {
  e.preventDefault();
}

// Mouse up event handler
function _mouseup(e: MouseEvent): void {
  _mouse_state.b &= ~(1 << e.button);
  e.preventDefault();
}

// Mouse down event handler
function _mousedown(e: MouseEvent): void {
  _mouse_state.b |= 1 << e.button;
  e.preventDefault();
}

// Mouse move event handler
function _mousemove(e: MouseEvent): void {
  _mouse_state.x = e.offsetX;
  _mouse_state.y = e.offsetY;
  e.preventDefault();
}

// Mouse wheel event handler
function _mousewheel(e: WheelEvent): void {
  _mouse_state.z += e.deltaY;
  e.preventDefault();
}
