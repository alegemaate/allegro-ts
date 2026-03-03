import { draw_sprite } from "./sprites";

import { _bitmap_state, _uberloop, makecol } from ".";
import { _error, log } from "./debug";
import { clear_to_color } from "./primitives";
import { _set_loop_interval } from "./config";

import { type BITMAP, type FONT } from "./types";

interface GraphicsDriver {
  id: number;
  name: string;
  desc: string;
  ascii_name: string;
  w: number;
  h: number;
  linear: boolean;
  bank_size: number;
  vid_mem: number;
  vid_phys_base: number;
  windowed: boolean;
}

/**
 * Graphics Driver
 *
 * @remarks
 * Graphics driver set by set_gfx_mode()
 */
export const gfx_driver: GraphicsDriver = {
  id: 0,
  name: "No Graphics",
  desc: "No Graphics",
  ascii_name: "No Graphics",
  w: 0,
  h: 0,
  linear: false,
  bank_size: 0,
  vid_mem: 0,
  vid_phys_base: 0,
  windowed: true,
};

/**
 * Set color depth
 *
 * @remarks
 * Not implemented
 *
 * @allegro 1.9.1
 */
export function set_color_depth(depth: number): number {
  void depth;
  return 0;
}

/**
 * Get color depth
 *
 * @remarks
 * Simply returns 32
 *
 * @allegro 1.9.2
 */
export function get_color_depth(): number {
  return 32;
}

/**
 * Request refresh rate
 *
 * @remarks
 * Request hardware refresh rate
 *
 * @param rate - refresh rate
 *
 * @allegro 1.9.3
 */
export function request_refresh_rate(rate: number): void {
  void rate;
}

/**
 * Get refresh rate
 *
 * @remarks
 * Simply returns 60
 *
 * @allegro 1.9.4
 */
export function get_refresh_rate(): number {
  return 60;
}

/**
 *
 *
 * @remarks
 *
 * @allegro 1.9.5
 */
export function get_gfx_mode_list(card: number): number[][] {
  void card;
  return [[0, 0, 0]];
}

/**
 *
 *
 * @remarks
 *
 * @allegro 1.9.6
 */
export function destroy_gfx_mode_list(mode_list: number[]): void {
  void mode_list;
}

/**
 * Enables graphics.
 *
 * @remarks
 * This function should be before calling any other graphics routines. It selects the canvas element for rendering and sets the resolution. It also loads the default font.
 *
 * @param card - Graphics mode, fullscreen attatches a listener to fullscreen when clicked
 * @param w - canvas width in pixels, 0 for don't care (will use actual canvas size)
 * @param h - canvas height in pixels, 0 for don't care (will use actual canvas size)
 * @param v_w - Video width (not supported)
 * @param v_h - video height (not supported)
 * @returns 0 on success or -1 on error
 *
 * @allegro 1.9.7
 */
export function set_gfx_mode(card: number, w: number, h: number, v_w = 0, v_h = 0): number {
  // NOOP
  void v_w;
  void v_h;

  if (!_bitmap_state.screen.canvas) {
    _error("Screen canvas not found, cannot set graphics mode!");
    return -1;
  }

  if (!_bitmap_state.screen.context) {
    _error("Screen context not found, cannot set graphics mode!");
    return -1;
  }

  // Turn off image aliasing
  _bitmap_state.screen.context.imageSmoothingEnabled = false;

  // Setup canvas
  _bitmap_state.screen.canvas.width = w;
  _bitmap_state.screen.canvas.height = h;
  _bitmap_state.screen.w = w;
  _bitmap_state.screen.h = h;
  clear_to_color(_bitmap_state.screen, makecol(0, 0, 0));

  // Setup gfx driver
  gfx_driver.name = "Browser Graphics";
  gfx_driver.desc = "Browser Graphics";
  gfx_driver.ascii_name = "Browser Graphics";
  gfx_driver.w = window.outerWidth;
  gfx_driver.h = window.outerHeight;

  log(`Graphics mode set to ${w} x ${h}`);

  // Special cases for cards
  if (card === GFX_AUTODETECT_FULLSCREEN) {
    const requestFullscreen = (): void => {
      if (_bitmap_state.screen.canvas) {
        void _bitmap_state.screen.canvas.requestFullscreen();
        _bitmap_state.screen.canvas.removeEventListener("click", requestFullscreen);
      }
    };
    _bitmap_state.screen.canvas.addEventListener("click", requestFullscreen);
  } else if (card === GFX_TEXT) {
    _bitmap_state.screen.canvas.width = 0;
    _bitmap_state.screen.canvas.height = 0;
    _bitmap_state.screen.w = 0;
    _bitmap_state.screen.h = 0;
  }

  return 0;
}

export const GFX_TEXT = -1;
export const GFX_AUTODETECT = 0;
export const GFX_AUTODETECT_FULLSCREEN = 1;
export const GFX_AUTODETECT_WINDOWED = 2;
export const GFX_SAFE = 3;

/**
 * Set display switching mode
 *
 * @remarks
 * Changes behavior when out of focus
 *
 * @param mode - Switch mode
 *
 * @returns 0 on success, -1 otherwise
 *
 * @allegro 1.9.8
 */
export function set_display_switch_mode(mode: number): number {
  // Reset switch callbacks
  _switch_in_callbacks.length = 0;
  _switch_out_callbacks.length = 0;

  // Set switch mode
  _switch_mode = mode;

  switch (mode) {
    case SWITCH_AMNESIA:
    case SWITCH_PAUSE:
      if (!_bitmap_state.screen.canvas) {
        _error("Screen canvas not found, cannot set display switch mode!");
        return -1;
      }

      _bitmap_state.screen.canvas.addEventListener("pointerleave", () => {
        _set_loop_interval(-1);
      });

      _bitmap_state.screen.canvas.addEventListener("pointerenter", () => {
        _set_loop_interval(window.setInterval(_uberloop, 16.6));
      });
      return 0;
    case SWITCH_NONE:
      return -1;
    case SWITCH_BACKAMNESIA:
    case SWITCH_BACKGROUND:
    default:
      return 0;
  }
}

export const SWITCH_NONE = 0;
export const SWITCH_PAUSE = 1;
export const SWITCH_AMNESIA = 2;
export const SWITCH_BACKGROUND = 3;
export const SWITCH_BACKAMNESIA = 4;

let _switch_mode = SWITCH_PAUSE;

/**
 * Set display switch callback
 *
 * @remarks
 * Like allegro, we limit callbacks to 8
 *
 * @param dir - Either SWITCH_IN or SWITCH_OUT
 * @param cb - Callback to be called on switch
 * @returns 0 on success, -1 otherwise
 *
 * @allegro 1.9.9
 */
export function set_display_switch_callback(dir: number, cb: () => void): number {
  // Limit at 8
  if (_switch_in_callbacks.length + _switch_out_callbacks.length >= 8) {
    return -1;
  }

  // Switch in mode
  if (dir === SWITCH_IN) {
    _switch_in_callbacks.push(cb);
  }
  // Switch out mode
  else if (dir === SWITCH_OUT) {
    _switch_out_callbacks.push(cb);
  }

  return 0;
}

const _switch_in_callbacks: (() => void)[] = [];
const _switch_out_callbacks: (() => void)[] = [];

export const SWITCH_IN = 0;
export const SWITCH_OUT = 1;

/**
 * Remove a display switch callback
 *
 * @remarks
 * This can be useful for things like pausing games etc.
 * Can be called safely even if CB is not installed.
 *
 * @param cb - Callback to remove
 *
 * @allegro 1.9.10
 */
export function remove_display_switch_callback(cb: () => void): void {
  const in_index = _switch_in_callbacks.indexOf(cb);
  const out_index = _switch_out_callbacks.indexOf(cb);

  if (in_index !== -1) {
    _switch_in_callbacks.splice(in_index, 1);
  }

  if (out_index !== -1) {
    _switch_in_callbacks.splice(out_index, 1);
  }
}

/**
 * Get display switch mode
 *
 * @remarks
 * Returns current display switch mode
 *
 * @returns switch mode
 *
 * @allegro 1.9.11
 */
export function get_display_switch_mode(): number {
  return _switch_mode;
}

/**
 * Is windowed mode
 *
 * @remarks
 * Changes when user has allowed fullscreen
 *
 * @returns Windowed mode
 *
 * @allegro 1.9.12
 */
export function is_windowed_mode(): boolean {
  return !document.fullscreenElement;
}

/**
 * Graphics capabilities
 *
 * @remarks
 * Capibilities of graphics
 *
 * @allegro 1.9.13
 */
export const GFX_CAN_SCROLL = 0x00000001;
export const GFX_CAN_TRIPLE_BUFFER = 0x00000002;
export const GFX_HW_CURSOR = 0x00000004;
export const GFX_HW_HLINE = 0x00000008;
export const GFX_HW_HLINE_XOR = 0x00000010;
export const GFX_HW_HLINE_SOLID_PATTERN = 0x00000020;
export const GFX_HW_HLINE_COPY_PATTERN = 0x00000040;
export const GFX_HW_FILL = 0x00000080;
export const GFX_HW_FILL_XOR = 0x00000100;
export const GFX_HW_FILL_SOLID_PATTERN = 0x00000200;
export const GFX_HW_FILL_COPY_PATTERN = 0x00000400;
export const GFX_HW_LINE = 0x00000800;
export const GFX_HW_LINE_XOR = 0x00001000;
export const GFX_HW_TRIANGLE = 0x00002000;
export const GFX_HW_TRIANGLE_XOR = 0x00004000;
export const GFX_HW_GLYPH = 0x00008000;
export const GFX_HW_VRAM_BLIT = 0x00010000;
export const GFX_HW_VRAM_BLIT_MASKED = 0x00020000;
export const GFX_HW_MEM_BLIT = 0x00040000;
export const GFX_HW_MEM_BLIT_MASKED = 0x00080000;
export const GFX_HW_SYS_TO_VRAM_BLIT = 0x00100000;
export const GFX_HW_SYS_TO_VRAM_BLIT_MASKED = 0x00200000;
export const GFX_SYSTEM_CURSOR = 0x00400000;
export const GFX_HW_VRAM_STRETCH_BLIT = 0x00800000;
export const GFX_HW_VRAM_STRETCH_BLIT_MASKED = 0x01000000;
export const GFX_HW_SYS_STRETCH_BLIT = 0x02000000;
export const GFX_HW_SYS_STRETCH_BLIT_MASKED = 0x04000000;

export const gfx_capabilities =
  GFX_HW_CURSOR |
  GFX_HW_HLINE |
  GFX_HW_FILL |
  GFX_HW_LINE |
  GFX_HW_TRIANGLE |
  GFX_HW_VRAM_BLIT |
  GFX_HW_VRAM_BLIT |
  GFX_HW_MEM_BLIT |
  GFX_SYSTEM_CURSOR |
  GFX_HW_SYS_STRETCH_BLIT;

/**
 * Enable tripe buffer
 *
 * @remarks
 * Does nothing!
 *
 * @allegro 1.9.14
 */
export function enable_triple_buffer(): number {
  return 0;
}

/**
 * Scroll screen
 *
 * @remarks
 * Not implemented
 *
 * @allegro 1.9.15
 */
export function scroll_screen(x: number, y: number): void {
  void x;
  void y;
}

/**
 * Request scroll
 *
 * @remarks
 * Not implemented
 *
 * @allegro 1.9.16
 */
export function request_scroll(x: number, y: number): void {
  void x;
  void y;
}

/**
 * Poll Scroll
 *
 * @remarks
 * Not implemented
 *
 * @allegro 1.9.17
 */
export function poll_scroll(): void {
  // NOOP
}

/**
 * Show video bitmap
 *
 * @remarks
 * Shortcut to drawing bitmap to screen.
 * MUST be of same dimensions.
 *
 * @param bmp - Bitmap to show
 *
 * @allegro 1.9.18
 */
export function show_video_bitmap(bmp: BITMAP | undefined): void {
  if (bmp?.w !== _bitmap_state.screen.w || bmp.h !== _bitmap_state.screen.h) {
    return;
  }

  draw_sprite(_bitmap_state.screen, bmp, 0, 0);
}

/**
 * Request video bitmap
 *
 * @remarks
 * Simply returns back the same bitmap
 *
 * @param bmp - Bitmap to get video bitmap of
 *
 * @allegro 1.9.19
 */
export function request_video_bitmap(bmp: BITMAP | undefined): BITMAP | undefined {
  return bmp;
}

/**
 * Vsync
 *
 * @remarks
 * Does nothing
 *
 * @allegro 1.9.20
 */
export function vsync(): void {
  // NOOP
}

export const font: FONT = {
  element: null,
  file: "",
  name: "Monospace",
  size: 12,
  type: "fnt",
};
