# Samples (Audio)

allegro-ts uses the Web Audio API for sample playback.

## Installation

```ts
function install_sound(digi: number, midi: number, cfg_path?: string | null): number;
function remove_sound(): void; // no-op
```

Creates an `AudioContext` and master gain node. Must be called before any sample functions.

```ts
install_sound(DIGI_AUTODETECT, MIDI_AUTODETECT, null);
```

### Constants

| Constant          | Value |
| ----------------- | ----- |
| `DIGI_AUTODETECT` | `-1`  |
| `DIGI_NONE`       | `0`   |
| `MIDI_AUTODETECT` | `-1`  |
| `MIDI_NONE`       | `0`   |
| `MIDI_DIGMID`     | `1`   |

## Loading samples

```ts
async function load_sample(filename: string): Promise<SAMPLE>;
```

Fetches and decodes an audio file. Returns a `SAMPLE` object. Samples must be `await`-ed directly.

```ts
const explosion = await load_sample("assets/explosion.wav");
```

## Playing samples

```ts
function play_sample(
  sample: SAMPLE,
  vol?: number, // 0–255, default 255
  pan?: number, // 0–255, default 127 (centre)
  freq?: number, // playback rate × 1000, default 1000 (1.0×)
  loop?: boolean, // default false
): void;
```

```ts
play_sample(explosion, 200, 127, 1000, false);
play_sample(bgMusic, 180, 127, 1000, true); // looping
```

## Adjusting samples

```ts
function adjust_sample(sample: SAMPLE, vol: number, pan: number, freq: number, loop: boolean): void;
```

Modify a sample's properties while it is playing.

## Stopping samples

```ts
function stop_sample(sample: SAMPLE): void;
```

## Destroying samples

```ts
function destroy_sample(spl: SAMPLE): void;
```

Disconnects the audio nodes and removes the sample from the internal list.

## Volume control

```ts
function set_volume(digi_volume: number, midi_volume: number): void;
function get_volume(): { digi_volume: number; midi_volume: number };
```

`digi_volume` is `0–255`. The master gain node is set to `digi_volume / 255`.

## SAMPLE structure

```ts
interface SAMPLE {
  file: string;
  source: AudioBufferSourceNode;
  gain: GainNode;
  buffer: AudioBuffer | null;
  pan: StereoPannerNode;
  type: "snd";
}
```
