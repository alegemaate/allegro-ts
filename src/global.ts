import * as allegro from ".";

// Re-export all allegro functions/values to the global scope, so that they can be used without importing.
for (const [key, val] of Object.entries(allegro)) {
  // Skip private functions/values
  if (
    key.startsWith("_") &&
    // Few exceptions for 'private' functions/values that we want to export
    !key.includes("putpixel") &&
    !key.includes("getpixel")
  ) {
    continue;
  }

  // @ts-expect-error - we know what we're doing here
  globalThis[key] = val;
}
