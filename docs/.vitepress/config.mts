import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "src",

  title: "allegro-ts",
  description:
    "Allegro 4 brought to the browser — a TypeScript game library mapping the Allegro 4 API to HTML5 Canvas.",

  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/" },
      { text: "API", link: "/api/" },
      { text: "Examples", link: "/examples/" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Introduction", link: "/guide/" },
            { text: "Installation", link: "/guide/installation" },
            { text: "Quick Start", link: "/guide/quickstart" },
          ],
        },
      ],
      "/api/": [
        {
          text: "API Reference",
          items: [{ text: "Overview", link: "/api/" }],
        },
        {
          text: "Initialization",
          items: [
            { text: "Core", link: "/api/core" },
            { text: "Graphics Mode", link: "/api/graphics" },
          ],
        },
        {
          text: "Rendering",
          items: [
            { text: "Bitmap", link: "/api/bitmap" },
            { text: "Primitives", link: "/api/primitives" },
            { text: "Sprites", link: "/api/sprites" },
            { text: "Font & Text", link: "/api/font" },
            { text: "Color", link: "/api/color" },
          ],
        },
        {
          text: "Input",
          items: [
            { text: "Keyboard", link: "/api/keyboard" },
            { text: "Mouse", link: "/api/mouse" },
          ],
        },
        {
          text: "Audio",
          items: [
            { text: "Samples", link: "/api/sound" },
            { text: "MIDI", link: "/api/midi" },
          ],
        },
        {
          text: "Utilities",
          items: [
            { text: "Timer", link: "/api/timer" },
            { text: "Math", link: "/api/math" },
            { text: "Types", link: "/api/types" },
          ],
        },
      ],
      "/examples/": [
        {
          text: "Examples",
          items: [{ text: "All Examples", link: "/examples/" }],
        },
      ],
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/alegemaate/allegro-ts",
      },
    ],

    search: {
      provider: "local",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © Allan Legemaate",
    },
  },
});
