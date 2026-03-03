import * as fs from "fs/promises";
import path from "path";
import { defineRoutes } from "vitepress";

interface UserRouteConfig {
  params: Record<string, string>;
  content?: string;
}

export default defineRoutes({
  watch: ["./data/*.ts"],

  async paths(watchedFiles: string[]) {
    const files = watchedFiles.filter((file) => file.endsWith(".ts"));

    const routes: UserRouteConfig[] = [];

    for (const file of files) {
      const contents = await fs.readFile(file, "utf-8");
      const id = path.basename(file, ".ts");

      const parts = [
        `# Example: ${id}`,
        `<canvas id="canvas_id" width="0" height="0" style="border-radius: 8px; margin: 0 auto;"></canvas>`,
        "::: details Console",
        '<pre id="debug"></pre>',
        ":::",
        "```ts-vue",
        contents,
        "```",
        `[View source on GitHub](https://github.com/alegemaate/allegro-ts/)`,
      ];

      routes.push({
        params: { id },
        content: parts.join("\n"),
      });
    }

    // Write manifest into docs so it can be imported by pages
    const items = files
      .map((file) => path.basename(file, ".ts"))
      .sort()
      .map((id) => ({ id, href: `/allegro-ts/examples/${id}` }));

    const out = path.resolve(__dirname, "../examples.manifest.json");
    await fs.writeFile(out, JSON.stringify(items, null, 2), "utf-8");

    return routes;
  },
});
