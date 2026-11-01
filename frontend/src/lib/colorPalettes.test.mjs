import test from "node:test";
import assert from "node:assert/strict";
import {
  COLOR_PALETTE_PRESETS,
  isDarkHex,
  resolveThemeColors,
} from "./colorPalettes.ts";

test("COLOR_PALETTE_PRESETS contains valid preset definitions", () => {
  assert.ok(COLOR_PALETTE_PRESETS.length >= 6);
  const defaultPreset = COLOR_PALETTE_PRESETS.find((p) => p.id === "krem-mahogany");
  assert.ok(defaultPreset);
  assert.equal(defaultPreset.paperColor, "#D3B49F");
  assert.equal(defaultPreset.primaryColor, "#48181D");
  assert.equal(defaultPreset.secondaryColor, "#331115");
});

test("isDarkHex identifies dark and light hex values correctly", () => {
  assert.equal(isDarkHex("#000000"), true);
  assert.equal(isDarkHex("#161215"), true);
  assert.equal(isDarkHex("#331115"), true);
  assert.equal(isDarkHex("#FFFFFF"), false);
  assert.equal(isDarkHex("#FFFDFB"), false);
  assert.equal(isDarkHex("#D3B49F"), false);
  assert.equal(isDarkHex("#F7EBE4"), false);
  assert.equal(isDarkHex(""), false);
  assert.equal(isDarkHex(undefined), false);
});

test("resolveThemeColors provides fallbacks for undefined palette", () => {
  const result = resolveThemeColors(undefined);
  assert.equal(result.paperColor, "#D3B49F");
  assert.equal(result.primaryColor, "#48181D");
  assert.equal(result.textColor, "#3A1116");
  assert.equal(result.isDark, false);
});

test("resolveThemeColors matches preset and applies contrasting text color", () => {
  const darkResult = resolveThemeColors({
    paperColor: "#2B2428",
    primaryColor: "#161215",
  });
  assert.equal(darkResult.paperColor, "#2B2428");
  assert.equal(darkResult.isDark, true);
  assert.equal(darkResult.textColor, "#F7EFE8");
});
