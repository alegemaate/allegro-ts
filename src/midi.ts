import { log } from "./debug";
import { parseMidi } from "./util/midi-parser";
import { MidiSequencer } from "./util/gm-player";

import { type MIDI } from "./types";

interface _MidiState {
  current: MIDI | null;
  midi_loop_start: number;
  midi_loop_end: number;
  sequencer: MidiSequencer | null;
  init: () => void;
  destroy: () => void;
}

export const _midi_state: _MidiState = {
  current: null,
  midi_loop_start: 0,
  midi_loop_end: 0,
  sequencer: null,
  init: (): void => {
    _midi_state.current = null;
    _midi_state.midi_loop_start = 0;
    _midi_state.midi_loop_end = 0;
    _midi_state.sequencer = new MidiSequencer();
  },
  destroy: (): void => {
    _midi_state.current = null;
    _midi_state.midi_loop_start = 0;
    _midi_state.midi_loop_end = 0;
    if (_midi_state.sequencer) {
      _midi_state.sequencer.stop();
      _midi_state.sequencer = null;
    }
  },
};

/**
 * Midi driver
 *
 * @remarks
 * Does nothing, only for compatibility
 */
export const midi_driver = {
  id: 0,
  name: "Allegro TS MIDI",
  description: "Allegro TS MIDI",
  ascii_name: "Allegro TS MIDI",
};

/**
 * Load midi file
 *
 * @remarks
 *
 * @param filename - path to file to load
 *
 * @allegro 1.28.1
 */
export async function load_midi(filename: string): Promise<MIDI | null> {
  log(`Loading midi ${filename}...`);

  const buffer = await fetch(filename).then((r) => r.arrayBuffer());
  const data = parseMidi(buffer);

  if (!data) {
    return null;
  }

  log(`MIDI ${filename} loaded!`);

  return { file: filename, type: "midi", data };
}

/**
 * Destroy midi file
 *
 * @remarks
 *
 * @allegro 1.28.2
 */
export function destroy_midi(midi: MIDI): void {
  void midi;
}

/**
 *
 *
 * @remarks
 *
 * @allegro 1.28.3
 */
export function lock_midi(midi: MIDI): void {
  void midi;
}

/**
 * Play midi file
 *
 * @remarks
 *
 * @allegro 1.28.4
 */
export function play_midi(midi: MIDI | null, loop: boolean): void {
  _midi_state.sequencer?.stop();
  _midi_state.current = midi;

  if (midi) {
    _midi_state.sequencer?.load(midi.data);
    _midi_state.sequencer?.play(loop);
  }
}

/**
 * Play looped midi
 *
 * @remarks
 *
 * @allegro 1.28.5
 */
export function play_looped_midi(midi: MIDI, loop_start: number, loop_end: number): number {
  _midi_state.midi_loop_start = loop_start;
  _midi_state.midi_loop_end = loop_end;
  play_midi(midi, true);
  return 0;
}

/**
 * Stop midi
 *
 * @remarks
 *
 * @allegro 1.28.6
 */
export function stop_midi(): void {
  play_midi(null, false);
}

/**
 * Pause midi
 *
 * @remarks
 *
 * @allegro 1.28.7
 */
export function midi_pause(): void {
  if (_midi_state.current && _midi_state.sequencer) {
    _midi_state.sequencer.pause();
  }
}

/**
 * Resume midi
 *
 * @remarks
 *
 * @allegro 1.28.8
 */
export function midi_resume(): void {
  if (_midi_state.current && _midi_state.sequencer) {
    _midi_state.sequencer.resume();
  }
}

/**
 * Seek midi
 *
 * @remarks
 *
 * @allegro 1.28.9
 */
export function midi_seek(target: number): void {
  if (_midi_state.current && _midi_state.sequencer) {
    _midi_state.sequencer.seek(target);
  }
}

/**
 * Get length of midi
 *
 *
 * @remarks
 * This function will simulate playing the given MIDI, from start to end, to de-
 * termine how long it takes to play. After calling this function, midi pos will
 * contain the negative number of beats, and midi time the length of the midi, in
 * seconds.
 * Note that any currently playing midi is stopped when you call this function.
 * Usually you would call it before play midi, to get the length of the midi to be
 * played, like in this example
 *
 * @allegro 1.28.10
 */
export function get_midi_length(midi: MIDI): number {
  if (_midi_state.current) {
    stop_midi();
  }

  const seq = _midi_state.sequencer;
  if (!seq) {
    return 0;
  }
  seq.load(midi.data);

  return seq.duration;
}

/**
 * Midi out
 *
 * @remarks
 *
 * @allegro 1.28.11
 */
export function midi_out(data: string[], length: number): void {
  void data;
  void length;
}

/**
 * Load midi patches
 *
 * @remarks
 *
 * @allegro 1.28.12
 */
export function load_midi_patches(): void {
  // Noop
}

/**
 * Current midi position in beats
 *
 * @remarks
 *
 * @allegro 1.28.13
 */
export const midi_pos = {
  get value(): number {
    if (!_midi_state.sequencer) {
      return 0;
    }

    return _midi_state.sequencer.isPlaying
      ? _midi_state.sequencer.currentBeat
      : -_midi_state.sequencer.beats;
  },
};

/**
 * Current midi time in seconds
 *
 * @remarks
 *
 * @allegro 1.28.14
 */
export const midi_time = {
  get value(): number {
    return _midi_state.sequencer?.currentTime ?? 0;
  },
};

/**
 * Midi loop markers
 *
 * @remarks
 *
 * @allegro 1.28.15
 */
export const midi_loop_start = {
  get value(): number {
    return _midi_state.midi_loop_start;
  },
};

export const midi_loop_end = {
  get value(): number {
    return _midi_state.midi_loop_end;
  },
};

/**
 * Callback on midi message
 *
 * @remarks
 *
 * @allegro 1.28.16
 */
export function midi_msg_callback(msg: number, byte1: number, byte2: number): void {
  void msg;
  void byte1;
  void byte2;
}

/**
 * Load IBK file
 *
 * @remarks
 *
 * @allegro 1.28.17
 */
export function load_ibk(filename: string, drums: number): void {
  void filename;
  void drums;
}
