interface _DebugState {
  enabled: boolean;
  element: HTMLElement | null;
  init: () => void;
}

export const _debug_state: _DebugState = {
  enabled: false,
  element: null,
  init: (): void => {
    _debug_state.enabled = false;
    _debug_state.element = null;
  },
};

// Fatal error displays alert and logs to console
export function _error(string: string): void {
  log(`[ERROR] ${string}`);
  // eslint-disable-next-line no-alert
  alert(string);
}

export function _onerror(e: ErrorEvent): void {
  const fa = e.filename.split("/");
  fa.reverse();
  log(`[${fa[0] ?? ""}:${e.lineno}:${e.colno}] ${e.message}`);
}

/**
 * Enables debugging to a console.
 * 'console' can be any html element that can accept text, preferably a <div>
 * @param id - id of the element to be the console
 */
export function enable_debug(id: string): void {
  _debug_state.element = document.getElementById(id);
  window.addEventListener("error", _onerror);
  if (_debug_state.element) {
    _debug_state.enabled = true;
  }
}

/**
 * Logs to console
 * Only works after enable_debug() has been called. Will append <br/> newline tag. You can use html inside your logs too.
 * @param string - text to log
 */
export function log(string: string): void {
  // eslint-disable-next-line no-console
  console.log(string);

  if (!_debug_state.enabled || !_debug_state.element) {
    return;
  }
  _debug_state.element.innerHTML = `${_debug_state.element.innerHTML + string}<br/>`;
}

/**
 * Wipes the debug console
 * Clears the debug element of any text. Useful if you want to track changing values in real time without clogging the browser. Just call it at the beginning every loop()!
 */
export function wipe_log(): void {
  if (!_debug_state.enabled || !_debug_state.element) {
    return;
  }
  _debug_state.element.innerHTML = "";
}
