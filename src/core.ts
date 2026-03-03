import { makecol } from "./color";
import { GFX_AUTODETECT_WINDOWED, set_gfx_mode } from "./graphics";
import { textprintf_centre_ex } from "./font";
import { clear_to_color } from "./primitives";
import { _bitmap_state } from "./bitmap";

import { _error, log, enable_debug } from "./debug";
import { _keyboard_loop } from "./keyboard";
import { _mouse_loop, _mouse_loop_reset } from "./mouse";

// Internal state management
interface _CoreState {
  load_listener: (() => void) | null;
}

export const _core_state: _CoreState = {
  // Stored load listener so it can be removed by allegro_exit
  load_listener: null,
};

// Performs some loop tasks, such as cleaning up pressed[] and released[]
export function _uberloop(): void {
  _mouse_loop();
  _keyboard_loop();
  _mouse_loop_reset();
}

// Start it up
async function _boot(main: () => Promise<number>): Promise<void> {
  try {
    const code = await main();
    set_gfx_mode(GFX_AUTODETECT_WINDOWED, 320, 200, 0, 0);
    clear_to_color(_bitmap_state.screen, makecol(100, 100, 100));
    textprintf_centre_ex(
      _bitmap_state.screen,
      { element: null, file: "", name: "Monospace", size: 12, type: "fnt" },
      _bitmap_state.screen.w / 2,
      _bitmap_state.screen.h / 2,
      makecol(255, 255, 255),
      -1,
      "Program ended with code %i",
      code,
    );
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      log("Boot aborted.");
      return;
    }
    throw e;
  }
}

// Setup browser specific allegro functions
export function init_allegro_ts(
  canvasId: string,
  main: () => Promise<number>,
  options?: {
    debug_element?: string;
  },
): void {
  log("Initialising Allegro TS...");

  // Get canvas from document
  const cv = document.getElementById(canvasId);
  if (!cv || !(cv instanceof HTMLCanvasElement)) {
    _error(`Can't find canvas with id ${canvasId}`);
    return;
  }

  // Get context from document
  const ctx = cv.getContext("2d");
  if (!ctx) {
    _error("Can't get 2D context from canvas");
    return;
  }

  // Init screen with basic canvas
  _bitmap_state.init(cv, ctx);

  // Enable debug if specified in options
  if (options?.debug_element) {
    enable_debug(options.debug_element);
  }

  // Boot on load
  if (window.document.readyState === "complete") {
    log("Document already loaded, starting boot...");
    void _boot(main);
  } else {
    log("Document not loaded yet, waiting for load event...");
    _core_state.load_listener = () => {
      log("Window loaded, starting boot...");
      void _boot(main);
    };
    window.addEventListener("load", _core_state.load_listener);
  }
}
