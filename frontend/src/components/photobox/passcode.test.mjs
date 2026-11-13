import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_PASSCODES,
  getValidPasscodes,
  verifyPhotoboxPasscode,
} from "./passcode.ts";

test("DEFAULT_PASSCODES includes wedding year and reception date", () => {
  assert.ok(DEFAULT_PASSCODES.includes("2026"));
  assert.ok(DEFAULT_PASSCODES.includes("2111"));
});

test("verifyPhotoboxPasscode accepts valid codes and trims whitespace", () => {
  assert.strictEqual(verifyPhotoboxPasscode("2026"), true);
  assert.strictEqual(verifyPhotoboxPasscode("  2026  "), true);
  assert.strictEqual(verifyPhotoboxPasscode("2111"), true);
});

test("verifyPhotoboxPasscode rejects invalid or empty codes", () => {
  assert.strictEqual(verifyPhotoboxPasscode(""), false);
  assert.strictEqual(verifyPhotoboxPasscode("0000"), false);
  assert.strictEqual(verifyPhotoboxPasscode("9999"), false);
  assert.strictEqual(verifyPhotoboxPasscode("abcd"), false);
});
