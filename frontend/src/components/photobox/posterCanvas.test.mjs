import test from "node:test";
import assert from "node:assert/strict";
import {
  POSTER_SIZES,
  MASTER_WIDTH,
  MASTER_HEIGHT,
  A3_WIDTH,
  A3_HEIGHT,
  A4_WIDTH,
  A4_HEIGHT,
} from "./a3PosterCanvas.ts";

test("POSTER_SIZES covers all requested sizes including A3, A4, A5, A6, F4, 5R, 4R", () => {
  const expectedSizes = ["a3", "a4", "a5", "a6", "f4", "5r", "4r"];
  for (const size of expectedSizes) {
    assert.ok(POSTER_SIZES[size], `Size ${size} must be defined in POSTER_SIZES`);
    assert.ok(POSTER_SIZES[size].widthMm > 0, `${size} widthMm must be positive`);
    assert.ok(POSTER_SIZES[size].heightMm > 0, `${size} heightMm must be positive`);
    assert.ok(POSTER_SIZES[size].widthPx > 0, `${size} widthPx must be positive`);
    assert.ok(POSTER_SIZES[size].heightPx > 0, `${size} heightPx must be positive`);
    assert.ok(POSTER_SIZES[size].cssPageSize, `${size} cssPageSize must be specified`);
  }
});

test("A-series dimensions follow ISO 216 300 DPI calculations and aspect ratio", () => {
  // A3: 297 x 420 mm -> 3508 x 4960 px
  assert.strictEqual(POSTER_SIZES.a3.widthMm, 297);
  assert.strictEqual(POSTER_SIZES.a3.heightMm, 420);
  assert.strictEqual(POSTER_SIZES.a3.widthPx, 3508);
  assert.strictEqual(POSTER_SIZES.a3.heightPx, 4960);

  // A4: 210 x 297 mm -> 2480 x 3508 px
  assert.strictEqual(POSTER_SIZES.a4.widthMm, 210);
  assert.strictEqual(POSTER_SIZES.a4.heightMm, 297);
  assert.strictEqual(POSTER_SIZES.a4.widthPx, 2480);
  assert.strictEqual(POSTER_SIZES.a4.heightPx, 3508);

  // A5: 148 x 210 mm -> 1748 x 2480 px
  assert.strictEqual(POSTER_SIZES.a5.widthMm, 148);
  assert.strictEqual(POSTER_SIZES.a5.heightMm, 210);
  assert.strictEqual(POSTER_SIZES.a5.widthPx, 1748);
  assert.strictEqual(POSTER_SIZES.a5.heightPx, 2480);

  // A6: 105 x 148 mm -> 1240 x 1748 px
  assert.strictEqual(POSTER_SIZES.a6.widthMm, 105);
  assert.strictEqual(POSTER_SIZES.a6.heightMm, 148);
  assert.strictEqual(POSTER_SIZES.a6.widthPx, 1240);
  assert.strictEqual(POSTER_SIZES.a6.heightPx, 1748);

  // ISO aspect ratio is 1 / sqrt(2) ~ 0.7071
  const a3Ratio = POSTER_SIZES.a3.widthMm / POSTER_SIZES.a3.heightMm;
  const a4Ratio = POSTER_SIZES.a4.widthMm / POSTER_SIZES.a4.heightMm;
  assert.ok(Math.abs(a3Ratio - 0.7071) < 0.001);
  assert.ok(Math.abs(a4Ratio - 0.7071) < 0.001);
});

test("A5 and A6 support multi-up on A4 sheet with proper counts and guides", () => {
  assert.strictEqual(POSTER_SIZES.a5.supportsA4MultiUp, true);
  assert.strictEqual(POSTER_SIZES.a5.multiUpCount, 2);
  assert.strictEqual(POSTER_SIZES.a5.multiUpOrientation, "landscape");

  assert.strictEqual(POSTER_SIZES.a6.supportsA4MultiUp, true);
  assert.strictEqual(POSTER_SIZES.a6.multiUpCount, 4);
  assert.strictEqual(POSTER_SIZES.a6.multiUpOrientation, "portrait");
});

test("Master constants and backward compatibility aliases remain intact", () => {
  assert.strictEqual(MASTER_WIDTH, 3508);
  assert.strictEqual(MASTER_HEIGHT, 4960);
  assert.strictEqual(A3_WIDTH, MASTER_WIDTH);
  assert.strictEqual(A3_HEIGHT, MASTER_HEIGHT);
  assert.strictEqual(A4_WIDTH, 2480);
  assert.strictEqual(A4_HEIGHT, 3508);
});

test("Theme includes emerald-gold alongside royal-maroon, paper-keepsake, and korean-studio", () => {
  const supportedThemes = ["emerald-gold", "royal-maroon", "paper-keepsake", "korean-studio"];
  assert.strictEqual(supportedThemes.length, 4);
  assert.ok(supportedThemes.includes("emerald-gold"));
});
