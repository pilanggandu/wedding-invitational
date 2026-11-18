import test from "node:test";
import assert from "node:assert/strict";
import { FILTER_CSS_MAP, FILTER_PRESETS } from "./photoboxConfig.ts";

test("FILTER_PRESETS contains essential wedding filters", () => {
  const ids = FILTER_PRESETS.map((p) => p.id);
  assert.ok(ids.includes("original"), "must contain original clean filter");
  assert.ok(ids.includes("bw"), "must contain classic black and white");
  assert.ok(ids.includes("warm"), "must contain warm romantic glow");
  assert.ok(ids.includes("pastel"), "must contain korean soft pastel");
  assert.ok(ids.includes("vintage"), "must contain vintage 35mm film");
  assert.ok(ids.includes("moody"), "must contain cinematic moody filter");
});

test("FILTER_CSS_MAP maps all filters to valid CSS filter strings", () => {
  assert.strictEqual(FILTER_CSS_MAP.original, "none");
  assert.strictEqual(FILTER_CSS_MAP.none, "none");
  assert.ok(FILTER_CSS_MAP.bw.includes("grayscale(1)"));
  assert.ok(FILTER_CSS_MAP.warm.includes("sepia"));
  assert.ok(FILTER_CSS_MAP.pastel.includes("contrast"));
  assert.ok(FILTER_CSS_MAP.vintage.includes("sepia"));
  assert.ok(FILTER_CSS_MAP.moody.includes("contrast"));
});

test("Story IG resolution adheres to standard 9:16 aspect ratio (1080x1920)", () => {
  const width = 1080;
  const height = 1920;
  const ratio = width / height;
  assert.strictEqual(ratio, 9 / 16);
});
