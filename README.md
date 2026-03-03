# allegro.ts

[![NPM Version](https://img.shields.io/npm/v/allegro-ts)](https://www.npmjs.com/package/allegro-ts)
![Bundle Size](https://img.shields.io/bundlephobia/min/allegro-ts)
![License](https://img.shields.io/npm/l/allegro-ts)
[![Maintainability](https://api.codeclimate.com/v1/badges/cac6a07abd8271ebb427/maintainability)](https://codeclimate.com/github/alegemaate/allegro-ts/maintainability)
[![Deploy Docs](https://github.com/alegemaate/allegro-ts/actions/workflows/pages.yml/badge.svg)](https://github.com/alegemaate/allegro-ts/actions/workflows/pages.yml)

## An HTML5 game making library

## [GitHub](https://github.com/alegemaate/allegro-ts) - [Docs](https://alegemaate.com/allegro-ts/) - [Emscripten](https://github.com/alegemaate/allegro-ts-emscripten/)

### What is allegro.ts?

_allegro.ts_ is a project which attempts to map the entire Allegro 4 API to Javascript in as close of a manner as possible.

This is based on [allegro.js](https://github.com/TheSos/allegrojs) an earlier project to bring the Allegro 4 library to the browser.

### I want to compile Allegro 4 code to the web, how do I use this?

If you want to compile an existing Allegro 4 codebase to the web, you can use [allegro-ts-emscripten](https://github.com/alegemaate/allegro-ts-emscripten/) which binds the Allegro 4 C API to the _allegro.ts_ library. This allows you to compile your existing C codebase to WebAssembly and run it in the browser with minimal changes.

### Building

Install packages

```sh
npm install
```

Build core

```sh
npm run build
```

### Examples

- [View All](https://alegemaate.com/allegro-ts/examples/)
