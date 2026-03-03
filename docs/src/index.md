---
layout: home

hero:
  name: "allegro-ts"
  text: "Allegro 4 for the Browser"
  tagline: A TypeScript game library that faithfully maps the classic Allegro 4 C API to HTML5 Canvas.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: API Reference
      link: /api/
    - theme: alt
      text: Examples
      link: /examples/

features:
  - title: Familiar API
    details: If you've used Allegro 4 in C/C++, you already know allegro-ts. Functions like set_gfx_mode(), draw_sprite(), and install_keyboard() work just as you'd expect.
  - title: HTML5 Canvas Rendering
    details: All drawing goes through the browser's 2D Canvas API. Bitmaps, primitives, sprites, fonts, and pixel manipulation are fully supported.
  - title: Full Input Support
    details: Keyboard, mouse, and touch input are handled with the same event-driven model as the original Allegro 4 library.
  - title: Audio Playback
    details: Load and play WAV/MP3 samples via the Web Audio API. MIDI playback is supported through a built-in General MIDI player.
  - title: TypeScript First
    details: Written in TypeScript with full type definitions exported. Import only what you need or use the global mode for a script-tag style workflow.
  - title: Zero Dependencies
    details: No runtime dependencies. Just allegro-ts and the browser. Works with any bundler (Vite, webpack, esbuild) or directly as an ES module.
---
