import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_PASSCODE,
  DEFAULT_PASSCODES,
  getActivePasscode,
  getValidPasscodes,
  verifyPhotoboxPasscode,
  isPhotoboxUnlockedSession,
  setPhotoboxUnlockedSession,
} from "./passcode.ts";

test("DEFAULT_PASSCODE defaults to 2026", () => {
  assert.strictEqual(DEFAULT_PASSCODE, "2026");
  assert.ok(DEFAULT_PASSCODES.includes("2026"));
});

test("verifyPhotoboxPasscode accepts default code when no custom passcode is configured", () => {
  assert.strictEqual(verifyPhotoboxPasscode("2026"), true);
  assert.strictEqual(verifyPhotoboxPasscode("  2026  "), true);
});

test("verifyPhotoboxPasscode rejects invalid or empty codes", () => {
  assert.strictEqual(verifyPhotoboxPasscode(""), false);
  assert.strictEqual(verifyPhotoboxPasscode("0000"), false);
  assert.strictEqual(verifyPhotoboxPasscode("9999"), false);
  assert.strictEqual(verifyPhotoboxPasscode("abcd"), false);
});

test("verifyPhotoboxPasscode accepts active custom passcode and STRICTLY REJECTS old passcodes", () => {
  const activePasscode = "7788";
  // Passcode aktif harus berhasil
  assert.strictEqual(verifyPhotoboxPasscode("7788", activePasscode), true);
  assert.strictEqual(verifyPhotoboxPasscode("  7788  ", activePasscode), true);

  // Pincode lama ("2026", "2111", dll) HARUS ditolak dan tidak boleh bisa masuk
  assert.strictEqual(
    verifyPhotoboxPasscode("2026", activePasscode),
    false,
    "Pincode lama 2026 harus ditolak saat passcode baru aktif"
  );
  assert.strictEqual(
    verifyPhotoboxPasscode("2111", activePasscode),
    false,
    "Pincode lama 2111 harus ditolak saat passcode baru aktif"
  );
  assert.strictEqual(verifyPhotoboxPasscode("1234", activePasscode), false);
});

test("getValidPasscodes only contains the single active passcode", () => {
  assert.deepStrictEqual(getValidPasscodes("9988"), ["9988"]);
  assert.deepStrictEqual(getValidPasscodes("1234"), ["1234"]);
});
