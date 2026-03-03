import { type MidiData } from "./midi-parser";

// How far ahead (in seconds) to schedule audio events
const LOOKAHEAD = 0.1;
// How often (ms) to run the scheduler
const SCHEDULER_INTERVAL = 50;

interface PlaybackEvent {
  time: number; // seconds from MIDI start
  type: "noteOn" | "noteOff" | "program";
  channel: number;
  note: number;
  velocity: number;
  program: number;
}

interface Voice {
  osc: OscillatorNode;
  env: GainNode;
  release: number;
}

interface GmPreset {
  /** Oscillator waveform */
  type: OscillatorType;
  /** Attack time in seconds */
  attack: number;
  /** Decay time in seconds (0 = no decay phase) */
  decay: number;
  /** Sustain level as a fraction of peak gain (0–1) */
  sustain: number;
  /** Release time in seconds after note-off */
  release: number;
  /** Optional detune in cents */
  detune?: number;
}

// @prettier-ignore

/**
 * 128-entry General MIDI preset table (index = program number − 1).
 * Each preset configures the synthesiser timbre for that GM instrument.
 */
const GM_PRESETS: GmPreset[] = [
  // ── Piano (1–8) ──────────────────────────────────────────────────────────
  { type: "triangle", attack: 0.005, decay: 0.08, sustain: 0.4, release: 0.15 }, //   1 Acoustic Grand Piano
  { type: "triangle", attack: 0.003, decay: 0.07, sustain: 0.35, release: 0.12 }, //   2 Bright Acoustic Piano
  { type: "triangle", attack: 0.005, decay: 0.1, sustain: 0.45, release: 0.2 }, //   3 Electric Grand Piano
  { type: "triangle", attack: 0.004, decay: 0.08, sustain: 0.35, release: 0.15, detune: 8 }, // 4 Honky-tonk Piano
  { type: "sine", attack: 0.005, decay: 0.12, sustain: 0.5, release: 0.2 }, //   5 Electric Piano 1
  { type: "sine", attack: 0.003, decay: 0.1, sustain: 0.45, release: 0.18 }, //   6 Electric Piano 2
  { type: "triangle", attack: 0.001, decay: 0.05, sustain: 0.1, release: 0.05 }, //   7 Harpsichord
  { type: "sawtooth", attack: 0.001, decay: 0.04, sustain: 0.15, release: 0.05 }, //   8 Clavinet
  // ── Chromatic Percussion (9–16) ──────────────────────────────────────────
  { type: "sine", attack: 0.001, decay: 0.2, sustain: 0.05, release: 0.15 }, //   9 Celesta
  { type: "sine", attack: 0.001, decay: 0.25, sustain: 0.05, release: 0.2 }, //  10 Glockenspiel
  { type: "sine", attack: 0.001, decay: 0.3, sustain: 0.03, release: 0.1 }, //  11 Music Box
  { type: "sine", attack: 0.002, decay: 0.3, sustain: 0.1, release: 0.25 }, //  12 Vibraphone
  { type: "triangle", attack: 0.001, decay: 0.12, sustain: 0.05, release: 0.1 }, //  13 Marimba
  { type: "triangle", attack: 0.001, decay: 0.08, sustain: 0.03, release: 0.06 }, //  14 Xylophone
  { type: "sine", attack: 0.005, decay: 0.5, sustain: 0.1, release: 0.4 }, //  15 Tubular Bells
  { type: "triangle", attack: 0.002, decay: 0.1, sustain: 0.2, release: 0.15 }, //  16 Dulcimer
  // ── Organ (17–24) ────────────────────────────────────────────────────────
  { type: "square", attack: 0.008, decay: 0.0, sustain: 1.0, release: 0.05 }, //  17 Drawbar Organ
  { type: "square", attack: 0.005, decay: 0.05, sustain: 0.9, release: 0.04 }, //  18 Percussive Organ
  { type: "sawtooth", attack: 0.008, decay: 0.0, sustain: 1.0, release: 0.05 }, //  19 Rock Organ
  { type: "square", attack: 0.01, decay: 0.0, sustain: 1.0, release: 0.1 }, //  20 Church Organ
  { type: "square", attack: 0.01, decay: 0.0, sustain: 0.9, release: 0.08 }, //  21 Reed Organ
  { type: "square", attack: 0.015, decay: 0.0, sustain: 1.0, release: 0.06 }, //  22 Accordion
  { type: "square", attack: 0.01, decay: 0.0, sustain: 0.9, release: 0.06 }, //  23 Harmonica
  { type: "square", attack: 0.01, decay: 0.0, sustain: 0.9, release: 0.06 }, //  24 Tango Accordion
  // ── Guitar (25–32) ───────────────────────────────────────────────────────
  { type: "triangle", attack: 0.003, decay: 0.1, sustain: 0.4, release: 0.2 }, //  25 Acoustic Guitar (nylon)
  { type: "triangle", attack: 0.002, decay: 0.07, sustain: 0.35, release: 0.15 }, //  26 Acoustic Guitar (steel)
  { type: "triangle", attack: 0.003, decay: 0.08, sustain: 0.4, release: 0.2 }, //  27 Electric Guitar (jazz)
  { type: "triangle", attack: 0.002, decay: 0.07, sustain: 0.45, release: 0.18 }, //  28 Electric Guitar (clean)
  { type: "triangle", attack: 0.001, decay: 0.04, sustain: 0.2, release: 0.05 }, //  29 Electric Guitar (muted)
  { type: "sawtooth", attack: 0.005, decay: 0.02, sustain: 0.8, release: 0.15 }, //  30 Overdriven Guitar
  { type: "sawtooth", attack: 0.005, decay: 0.01, sustain: 0.9, release: 0.15 }, //  31 Distortion Guitar
  { type: "sine", attack: 0.002, decay: 0.15, sustain: 0.1, release: 0.2 }, //  32 Guitar Harmonics
  // ── Bass (33–40) ─────────────────────────────────────────────────────────
  { type: "triangle", attack: 0.003, decay: 0.05, sustain: 0.6, release: 0.1 }, //  33 Acoustic Bass
  { type: "triangle", attack: 0.003, decay: 0.04, sustain: 0.65, release: 0.1 }, //  34 Electric Bass (finger)
  { type: "triangle", attack: 0.002, decay: 0.04, sustain: 0.6, release: 0.08 }, //  35 Electric Bass (pick)
  { type: "sine", attack: 0.01, decay: 0.0, sustain: 0.9, release: 0.12 }, //  36 Fretless Bass
  { type: "triangle", attack: 0.001, decay: 0.06, sustain: 0.3, release: 0.08 }, //  37 Slap Bass 1
  { type: "triangle", attack: 0.001, decay: 0.05, sustain: 0.3, release: 0.08 }, //  38 Slap Bass 2
  { type: "sawtooth", attack: 0.005, decay: 0.04, sustain: 0.7, release: 0.1 }, //  39 Synth Bass 1
  { type: "square", attack: 0.005, decay: 0.04, sustain: 0.7, release: 0.1 }, //  40 Synth Bass 2
  // ── Strings (41–48) ──────────────────────────────────────────────────────
  { type: "sawtooth", attack: 0.06, decay: 0.0, sustain: 1.0, release: 0.2 }, //  41 Violin
  { type: "sawtooth", attack: 0.07, decay: 0.0, sustain: 1.0, release: 0.2 }, //  42 Viola
  { type: "sawtooth", attack: 0.08, decay: 0.0, sustain: 1.0, release: 0.25 }, //  43 Cello
  { type: "sawtooth", attack: 0.08, decay: 0.0, sustain: 1.0, release: 0.25 }, //  44 Contrabass
  { type: "sawtooth", attack: 0.04, decay: 0.0, sustain: 0.9, release: 0.15 }, //  45 Tremolo Strings
  { type: "triangle", attack: 0.001, decay: 0.15, sustain: 0.05, release: 0.1 }, //  46 Pizzicato Strings
  { type: "triangle", attack: 0.002, decay: 0.2, sustain: 0.1, release: 0.2 }, //  47 Orchestral Harp
  { type: "triangle", attack: 0.001, decay: 0.3, sustain: 0.1, release: 0.2 }, //  48 Timpani
  // ── Ensemble (49–56) ─────────────────────────────────────────────────────
  { type: "sawtooth", attack: 0.07, decay: 0.0, sustain: 1.0, release: 0.25 }, //  49 String Ensemble 1
  { type: "sawtooth", attack: 0.09, decay: 0.0, sustain: 0.95, release: 0.3 }, //  50 String Ensemble 2
  { type: "sawtooth", attack: 0.05, decay: 0.0, sustain: 1.0, release: 0.2 }, //  51 Synth Strings 1
  { type: "sawtooth", attack: 0.06, decay: 0.0, sustain: 0.95, release: 0.2 }, //  52 Synth Strings 2
  { type: "sine", attack: 0.08, decay: 0.0, sustain: 1.0, release: 0.25 }, //  53 Choir Aahs
  { type: "sine", attack: 0.07, decay: 0.0, sustain: 1.0, release: 0.2 }, //  54 Voice Oohs
  { type: "sine", attack: 0.06, decay: 0.0, sustain: 0.9, release: 0.2 }, //  55 Synth Voice
  { type: "sawtooth", attack: 0.001, decay: 0.1, sustain: 0.3, release: 0.2 }, //  56 Orchestra Hit
  // ── Brass (57–64) ────────────────────────────────────────────────────────
  { type: "sawtooth", attack: 0.02, decay: 0.01, sustain: 0.9, release: 0.1 }, //  57 Trumpet
  { type: "sawtooth", attack: 0.03, decay: 0.0, sustain: 1.0, release: 0.12 }, //  58 Trombone
  { type: "sawtooth", attack: 0.03, decay: 0.0, sustain: 1.0, release: 0.12 }, //  59 Tuba
  { type: "square", attack: 0.015, decay: 0.02, sustain: 0.7, release: 0.08 }, //  60 Muted Trumpet
  { type: "sawtooth", attack: 0.04, decay: 0.0, sustain: 0.95, release: 0.15 }, //  61 French Horn
  { type: "sawtooth", attack: 0.02, decay: 0.01, sustain: 0.9, release: 0.1 }, //  62 Brass Section
  { type: "sawtooth", attack: 0.01, decay: 0.01, sustain: 0.85, release: 0.1 }, //  63 Synth Brass 1
  { type: "square", attack: 0.01, decay: 0.01, sustain: 0.85, release: 0.1 }, //  64 Synth Brass 2
  // ── Reed (65–72) ─────────────────────────────────────────────────────────
  { type: "square", attack: 0.01, decay: 0.0, sustain: 0.95, release: 0.1 }, //  65 Soprano Sax
  { type: "square", attack: 0.01, decay: 0.0, sustain: 0.95, release: 0.1 }, //  66 Alto Sax
  { type: "square", attack: 0.012, decay: 0.0, sustain: 0.95, release: 0.12 }, //  67 Tenor Sax
  { type: "square", attack: 0.015, decay: 0.0, sustain: 1.0, release: 0.12 }, //  68 Baritone Sax
  { type: "square", attack: 0.01, decay: 0.0, sustain: 1.0, release: 0.08 }, //  69 Oboe
  { type: "square", attack: 0.012, decay: 0.0, sustain: 1.0, release: 0.1 }, //  70 English Horn
  { type: "square", attack: 0.015, decay: 0.0, sustain: 1.0, release: 0.12 }, //  71 Bassoon
  { type: "square", attack: 0.01, decay: 0.0, sustain: 1.0, release: 0.08 }, //  72 Clarinet
  // ── Pipe (73–80) ─────────────────────────────────────────────────────────
  { type: "sine", attack: 0.015, decay: 0.0, sustain: 1.0, release: 0.08 }, //  73 Piccolo
  { type: "sine", attack: 0.02, decay: 0.0, sustain: 1.0, release: 0.1 }, //  74 Flute
  { type: "sine", attack: 0.02, decay: 0.0, sustain: 0.95, release: 0.1 }, //  75 Recorder
  { type: "sine", attack: 0.025, decay: 0.0, sustain: 0.9, release: 0.12 }, //  76 Pan Flute
  { type: "sine", attack: 0.03, decay: 0.0, sustain: 0.85, release: 0.12 }, //  77 Blown Bottle
  { type: "sine", attack: 0.04, decay: 0.0, sustain: 0.9, release: 0.15 }, //  78 Shakuhachi
  { type: "sine", attack: 0.015, decay: 0.0, sustain: 1.0, release: 0.08 }, //  79 Whistle
  { type: "sine", attack: 0.02, decay: 0.0, sustain: 0.95, release: 0.1 }, //  80 Ocarina
  // ── Synth Lead (81–88) ───────────────────────────────────────────────────
  { type: "square", attack: 0.005, decay: 0.01, sustain: 0.85, release: 0.1 }, //  81 Lead 1 (square)
  { type: "sawtooth", attack: 0.005, decay: 0.01, sustain: 0.85, release: 0.1 }, //  82 Lead 2 (sawtooth)
  { type: "sine", attack: 0.01, decay: 0.0, sustain: 0.9, release: 0.12 }, //  83 Lead 3 (calliope)
  { type: "triangle", attack: 0.002, decay: 0.05, sustain: 0.6, release: 0.1 }, //  84 Lead 4 (chiff)
  { type: "sawtooth", attack: 0.008, decay: 0.01, sustain: 0.8, release: 0.12 }, //  85 Lead 5 (charang)
  { type: "sine", attack: 0.015, decay: 0.0, sustain: 0.9, release: 0.15 }, //  86 Lead 6 (voice)
  { type: "sawtooth", attack: 0.005, decay: 0.01, sustain: 0.85, release: 0.1 }, //  87 Lead 7 (fifths)
  { type: "sawtooth", attack: 0.005, decay: 0.01, sustain: 0.9, release: 0.12 }, //  88 Lead 8 (bass+lead)
  // ── Synth Pad (89–96) ────────────────────────────────────────────────────
  { type: "sine", attack: 0.12, decay: 0.0, sustain: 1.0, release: 0.4 }, //  89 Pad 1 (new age)
  { type: "sine", attack: 0.1, decay: 0.0, sustain: 1.0, release: 0.35 }, //  90 Pad 2 (warm)
  { type: "sawtooth", attack: 0.08, decay: 0.0, sustain: 0.95, release: 0.3 }, //  91 Pad 3 (polysynth)
  { type: "sine", attack: 0.12, decay: 0.0, sustain: 1.0, release: 0.4 }, //  92 Pad 4 (choir)
  { type: "sawtooth", attack: 0.15, decay: 0.0, sustain: 1.0, release: 0.45 }, //  93 Pad 5 (bowed)
  { type: "sawtooth", attack: 0.05, decay: 0.0, sustain: 0.9, release: 0.3 }, //  94 Pad 6 (metallic)
  { type: "sine", attack: 0.15, decay: 0.0, sustain: 1.0, release: 0.5 }, //  95 Pad 7 (halo)
  { type: "sawtooth", attack: 0.2, decay: 0.0, sustain: 0.95, release: 0.6 }, //  96 Pad 8 (sweep)
  // ── Synth Effects (97–104) ───────────────────────────────────────────────
  { type: "sine", attack: 0.05, decay: 0.15, sustain: 0.5, release: 0.3 }, //  97 FX 1 (rain)
  { type: "sawtooth", attack: 0.1, decay: 0.0, sustain: 0.8, release: 0.35 }, //  98 FX 2 (soundtrack)
  { type: "sine", attack: 0.003, decay: 0.2, sustain: 0.1, release: 0.3 }, //  99 FX 3 (crystal)
  { type: "sine", attack: 0.15, decay: 0.0, sustain: 0.8, release: 0.4 }, // 100 FX 4 (atmosphere)
  { type: "sawtooth", attack: 0.02, decay: 0.0, sustain: 0.9, release: 0.2 }, // 101 FX 5 (brightness)
  { type: "square", attack: 0.05, decay: 0.0, sustain: 0.8, release: 0.25 }, // 102 FX 6 (goblins)
  { type: "sine", attack: 0.02, decay: 0.15, sustain: 0.4, release: 0.4 }, // 103 FX 7 (echoes)
  { type: "square", attack: 0.03, decay: 0.0, sustain: 0.85, release: 0.25 }, // 104 FX 8 (sci-fi)
  // ── Ethnic (105–112) ─────────────────────────────────────────────────────
  { type: "triangle", attack: 0.003, decay: 0.1, sustain: 0.3, release: 0.2, detune: 5 }, // 105 Sitar
  { type: "triangle", attack: 0.002, decay: 0.08, sustain: 0.25, release: 0.15 }, // 106 Banjo
  { type: "triangle", attack: 0.002, decay: 0.07, sustain: 0.2, release: 0.12 }, // 107 Shamisen
  { type: "triangle", attack: 0.002, decay: 0.1, sustain: 0.25, release: 0.15 }, // 108 Koto
  { type: "sine", attack: 0.001, decay: 0.2, sustain: 0.05, release: 0.15 }, // 109 Kalimba
  { type: "square", attack: 0.015, decay: 0.0, sustain: 1.0, release: 0.08 }, // 110 Bagpipe
  { type: "sawtooth", attack: 0.05, decay: 0.0, sustain: 0.95, release: 0.18 }, // 111 Fiddle
  { type: "square", attack: 0.01, decay: 0.0, sustain: 0.95, release: 0.1 }, // 112 Shanai
  // ── Percussive (113–120) ─────────────────────────────────────────────────
  { type: "sine", attack: 0.001, decay: 0.3, sustain: 0.05, release: 0.2 }, // 113 Tinkle Bell
  { type: "sine", attack: 0.001, decay: 0.15, sustain: 0.05, release: 0.1 }, // 114 Agogo
  { type: "sine", attack: 0.001, decay: 0.2, sustain: 0.1, release: 0.15 }, // 115 Steel Drums
  { type: "triangle", attack: 0.001, decay: 0.05, sustain: 0.02, release: 0.04 }, // 116 Woodblock
  { type: "triangle", attack: 0.001, decay: 0.1, sustain: 0.05, release: 0.08 }, // 117 Taiko Drum
  { type: "triangle", attack: 0.001, decay: 0.12, sustain: 0.05, release: 0.1 }, // 118 Melodic Tom
  { type: "triangle", attack: 0.001, decay: 0.08, sustain: 0.03, release: 0.06 }, // 119 Synth Drum
  { type: "sine", attack: 0.3, decay: 0.0, sustain: 0.5, release: 0.3 }, // 120 Reverse Cymbal
  // ── Sound Effects (121–128) ──────────────────────────────────────────────
  { type: "sine", attack: 0.001, decay: 0.05, sustain: 0.0, release: 0.05 }, // 121 Guitar Fret Noise
  { type: "sine", attack: 0.05, decay: 0.0, sustain: 0.3, release: 0.2 }, // 122 Breath Noise
  { type: "sine", attack: 0.2, decay: 0.0, sustain: 0.7, release: 0.5 }, // 123 Seashore
  { type: "sine", attack: 0.02, decay: 0.08, sustain: 0.2, release: 0.15 }, // 124 Bird Tweet
  { type: "square", attack: 0.01, decay: 0.0, sustain: 0.9, release: 0.08 }, // 125 Telephone Ring
  { type: "sawtooth", attack: 0.03, decay: 0.0, sustain: 0.8, release: 0.2 }, // 126 Helicopter
  { type: "sine", attack: 0.08, decay: 0.0, sustain: 0.6, release: 0.4 }, // 127 Applause
  { type: "triangle", attack: 0.001, decay: 0.15, sustain: 0.0, release: 0.1 }, // 128 Gunshot
];

// MIDI note number -> Hz
function noteToFreq(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}

/**
 * Flatten all tracks in parsed MidiData into a sorted list of PlaybackEvents
 * with absolute times in seconds, handling tempo changes.
 */
function buildEvents(data: MidiData): PlaybackEvent[] {
  const ticksPerBeat = typeof data.timeDivision === "number" ? data.timeDivision : 120;

  // Collect tempo changes from all tracks (they carry absolute tick times
  // because midi-parser.ts now stores accumulated ticks)
  const tempoMap: { tick: number; tempo: number }[] = [
    { tick: 0, tempo: 500_000 }, // default 120 BPM
  ];
  for (const track of data.track) {
    for (const t of track.tempo) {
      const existing = tempoMap.find((tc) => tc.tick === t.time);
      if (existing) {
        existing.tempo = t.tempo;
      } else {
        tempoMap.push({ tick: t.time, tempo: t.tempo });
      }
    }
  }
  tempoMap.sort((a, b) => a.tick - b.tick);

  /** Convert an absolute tick position to wall-clock seconds */
  function ticksToSeconds(tick: number): number {
    let elapsed = 0;
    let prevTick = 0;
    let prevTempo = tempoMap[0]?.tempo ?? 500_000;
    for (let i = 1; i < tempoMap.length; i++) {
      const change = tempoMap[i];
      if (!change || change.tick >= tick) break;
      elapsed += ((change.tick - prevTick) / ticksPerBeat) * (prevTempo / 1_000_000);
      prevTick = change.tick;
      prevTempo = change.tempo;
    }
    elapsed += ((tick - prevTick) / ticksPerBeat) * (prevTempo / 1_000_000);
    return elapsed;
  }

  const events: PlaybackEvent[] = [];

  for (const track of data.track) {
    for (const note of track.notes) {
      // Note On with velocity 0 is canonically a Note Off
      const isOn = note.on && note.velocity > 0;
      events.push({
        time: ticksToSeconds(note.time),
        type: isOn ? "noteOn" : "noteOff",
        channel: note.channel,
        note: note.note,
        velocity: note.velocity,
        program: 0,
      });
    }
    for (const pc of track.programChange) {
      events.push({
        time: ticksToSeconds(pc.time),
        type: "program",
        channel: pc.channel,
        note: 0,
        velocity: 0,
        program: pc.program,
      });
    }
  }

  // Sort by time; within the same time, program before noteOn, noteOff before noteOn
  events.sort((a, b) => a.time - b.time || a.type.localeCompare(b.type));
  return events;
}

/**
 * Web Audio MIDI sequencer.
 *
 * Uses a lookahead scheduler to schedule oscillator events with sample-accurate
 * timing. Supports play / pause / resume / stop / seek.
 *
 * Program-change events are honoured per channel using the GM_PRESETS table,
 * giving each channel its own oscillator waveform and ADSR envelope.
 */
export class MidiSequencer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;

  // key = "channel-note"
  private voices = new Map<string, Voice>();
  private events: PlaybackEvent[] = [];

  // current GM program (0-indexed) per channel
  private _channelPrograms = new Map<number, number>();

  private _duration = 0;
  private _total_beats = 0;
  private _playing = false;
  private _paused = false;
  private _looping = false;

  /** MIDI seconds elapsed when play/resume was called */
  private _offset = 0;
  /** AudioContext.currentTime at the moment play/resume was called */
  private _startCtxTime = 0;

  private _nextIdx = 0;
  private _timer: ReturnType<typeof setTimeout> | null = null;

  // ── Public state ──────────────────────────────────────────────────────────

  get duration(): number {
    return this._duration;
  }

  get beats(): number {
    return this._total_beats;
  }

  get currentBeat(): number {
    if (this._total_beats === 0) {
      return 0;
    }
    return (this.currentTime / this._duration) * this._total_beats;
  }

  get currentTime(): number {
    if (!this._playing || !this.ctx) return this._offset;
    return this._offset + (this.ctx.currentTime - this._startCtxTime);
  }

  get isPlaying(): boolean {
    return this._playing;
  }

  get isPaused(): boolean {
    return this._paused;
  }

  // ── Setup ─────────────────────────────────────────────────────────────────

  private ensureCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.4;
      this.master.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  load(data: MidiData): void {
    this.stop();
    this.events = buildEvents(data);
    this._duration = this.events[this.events.length - 1]?.time ?? 0;
    this._total_beats = 0;

    const tempo = data.track[0]?.tempo[0]?.tempo;
    if (tempo && tempo > 0 && typeof data.timeDivision === "number") {
      const bpm = 60_000_000 / tempo;
      const bps = bpm / 60;
      this._total_beats = (this._duration / bps) * data.timeDivision;
    }
  }

  // ── Playback control ──────────────────────────────────────────────────────

  play(loop = false): void {
    this.stop();
    this._looping = loop;
    this._offset = 0;
    this._startPlayback();
  }

  pause(): void {
    if (!this._playing || this._paused || !this.ctx) return;
    this._offset += this.ctx.currentTime - this._startCtxTime;
    this._clearTimer();
    this._silenceAll();
    this._playing = false;
    this._paused = true;
  }

  resume(): void {
    if (!this._paused) return;
    this._startPlayback();
  }

  stop(): void {
    this._clearTimer();
    this._silenceAll();
    this._playing = false;
    this._paused = false;
    this._offset = 0;
    this._nextIdx = 0;
    this._channelPrograms.clear();
  }

  seek(seconds: number): void {
    const wasPlaying = this._playing;
    const loop = this._looping;
    this.stop();
    this._offset = Math.max(0, Math.min(seconds, this._duration));
    if (wasPlaying) {
      this._looping = loop;
      this._startPlayback();
    }
  }

  // ── Internal scheduler ────────────────────────────────────────────────────

  private _startPlayback(): void {
    const ctx = this.ensureCtx();
    // Resume suspended context (browsers suspend on first creation)
    if (ctx.state === "suspended") {
      void ctx.resume();
    }
    this._startCtxTime = ctx.currentTime;
    this._playing = true;
    this._paused = false;

    // Replay program-change events before the seek point so channels use the
    // correct timbre when playback starts mid-song.
    this._rebuildProgramState();

    // Find the first event at or after the current offset
    this._nextIdx = this.events.findIndex((e) => e.time >= this._offset - 0.001);
    if (this._nextIdx === -1) this._nextIdx = this.events.length;

    this._runScheduler();
  }

  /** Scan all program-change events before _offset to restore channel state. */
  private _rebuildProgramState(): void {
    this._channelPrograms.clear();
    for (const ev of this.events) {
      if (ev.time >= this._offset) {
        break;
      }
      if (ev.type === "program") {
        this._channelPrograms.set(ev.channel, ev.program);
      }
    }
  }

  private _runScheduler(): void {
    if (!this._playing || !this.ctx) {
      return;
    }

    const now = this.ctx.currentTime;
    const midiNow = this._offset + (now - this._startCtxTime);
    const scheduleUntil = midiNow + LOOKAHEAD;

    while (this._nextIdx < this.events.length) {
      const ev = this.events[this._nextIdx];
      if (!ev || ev.time > scheduleUntil) break;
      // Convert MIDI time -> AudioContext time
      const audioTime = Math.max(now, this._startCtxTime - this._offset + ev.time);
      this._scheduleEvent(ev, audioTime);
      this._nextIdx++;
    }

    if (this._nextIdx >= this.events.length) {
      // Track ended - loop or finish
      if (this._looping && this._duration > 0) {
        const loopAt = this._startCtxTime - this._offset + this._duration;
        const delay = Math.max(0, loopAt - now) * 1000;
        this._timer = setTimeout(() => {
          this._offset = 0;
          this._startPlayback();
        }, delay);
      } else {
        // Let active voices finish naturally
        this._playing = false;
      }
      return;
    }

    this._timer = setTimeout(() => this._runScheduler(), SCHEDULER_INTERVAL);
  }

  private _scheduleEvent(ev: PlaybackEvent, audioTime: number): void {
    if (!this.ctx || !this.master) return;
    // Skip MIDI percussion channel (GM channel 10, 0-indexed as 9)
    if (ev.channel === 9) return;

    if (ev.type === "program") {
      this._channelPrograms.set(ev.channel, ev.program);
      return;
    }

    const key = `${ev.channel}-${ev.note}`;

    if (ev.type === "noteOn") {
      // Voice-steal: stop any existing note on this pitch
      this._stopVoice(key, audioTime);

      const program = this._channelPrograms.get(ev.channel) ?? 0;
      const preset = GM_PRESETS[program] ?? GM_PRESETS[0]!;

      const osc = this.ctx.createOscillator();
      const env = this.ctx.createGain();

      osc.type = preset.type;
      osc.frequency.value = noteToFreq(ev.note);
      if (preset.detune !== undefined) osc.detune.value = preset.detune;

      const peak = (ev.velocity / 127) * 0.5;
      // exponentialRampToValueAtTime cannot target 0, so floor at 0.0001
      const sustainVol = Math.max(peak * preset.sustain, 0.0001);

      env.gain.setValueAtTime(0, audioTime);
      env.gain.linearRampToValueAtTime(peak, audioTime + preset.attack);
      if (preset.decay > 0) {
        env.gain.exponentialRampToValueAtTime(sustainVol, audioTime + preset.attack + preset.decay);
      }

      osc.connect(env);
      env.connect(this.master);
      osc.start(audioTime);

      this.voices.set(key, { osc, env, release: preset.release });
    } else if (ev.type === "noteOff") {
      this._stopVoice(key, audioTime);
    }
  }

  private _stopVoice(key: string, audioTime?: number): void {
    const voice = this.voices.get(key);
    if (!voice || !this.ctx) return;

    const now = this.ctx.currentTime;
    const t = Math.max(audioTime ?? now, now);

    try {
      // Hold the current instantaneous gain, then ramp to silence
      voice.env.gain.setValueAtTime(voice.env.gain.value, now);
      voice.env.gain.linearRampToValueAtTime(0.0001, t + voice.release);
      voice.osc.stop(t + voice.release);
    } catch {
      // Oscillator already stopped — ignore
    }

    this.voices.delete(key);
  }

  private _clearTimer(): void {
    if (this._timer !== null) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  private _silenceAll(): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (const key of [...this.voices.keys()]) {
      this._stopVoice(key, now);
    }
  }
}
