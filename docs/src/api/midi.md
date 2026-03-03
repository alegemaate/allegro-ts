# MIDI

allegro-ts includes a built-in General MIDI player that parses and plays back standard MIDI files using the Web Audio API.

## Loading

```ts
async function load_midi(filename: string): Promise<MIDI | null>;
```

Fetches and parses a `.mid` file. Returns `null` if parsing fails.

```ts
const music = await load_midi("assets/theme.mid");
if (music) play_midi(music, true);
```

## Playback

```ts
function play_midi(midi: MIDI, loop: boolean): number;
function stop_midi(): void;
function midi_pause(): void;
function midi_resume(): void;
```

`play_midi` returns `0` on success. Only one MIDI file can play at a time — calling `play_midi` again stops the current one.

## Position

```ts
function midi_seek(target: number): number;
function get_midi_length(midi: MIDI): number;
```

`midi_seek` moves to a tick position. `get_midi_length` returns the total tick count of the MIDI file.

## Volume

```ts
function set_midi_volume(volume: number): void; // 0–255
```

## MIDI structure

```ts
interface MIDI {
  file: string;
  type: "midi";
  data: MidiData;
}
```

## Other (stubs)

```ts
function destroy_midi(midi: MIDI): void;
function lock_midi(midi: MIDI): void;
function midi_out(data: number[]): void;
function load_ibk(filename: string): number;
```
