import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_PASSCODE,
  DEFAULT_PASSCODES,
  OBSOLETE_PASSCODES,
  getActivePasscode,
  getValidPasscodes,
  verifyPhotoboxPasscode,
  isPasscodeObsolete,
  isPhotoboxUnlockedSession,
  setPhotoboxUnlockedSession,
} from "./passcode.ts";

test("DEFAULT_PASSCODE defaults to 2111 (tanggal pernikahan 21 November)", () => {
  assert.strictEqual(DEFAULT_PASSCODE, "2111");
  assert.ok(DEFAULT_PASSCODES.includes("2111"));
});

test("OBSOLETE_PASSCODES explicitly includes old pincode 2026", () => {
  assert.ok(OBSOLETE_PASSCODES.includes("2026"));
  assert.strictEqual(isPasscodeObsolete("2026"), true);
});

test("verifyPhotoboxPasscode accepts active default passcode 2111", () => {
  assert.strictEqual(verifyPhotoboxPasscode("2111"), true);
  assert.strictEqual(verifyPhotoboxPasscode("  2111  "), true);
});

test("verifyPhotoboxPasscode STRICTLY REJECTS old pincode 2026 by default", () => {
  assert.strictEqual(
    verifyPhotoboxPasscode("2026"),
    false,
    "Pincode lama 2026 harus ditolak secara mutlak"
  );
  assert.strictEqual(
    verifyPhotoboxPasscode("  2026  "),
    false,
    "Pincode lama 2026 dengan spasi harus ditolak"
  );
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

  // Pincode lama ("2026") dan kode default sebelumnya ("2111") HARUS ditolak saat passcode baru aktif
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
  assert.deepStrictEqual(getValidPasscodes(), ["2111"]);
  assert.deepStrictEqual(getValidPasscodes("9988"), ["9988"]);
  assert.deepStrictEqual(getValidPasscodes("1234"), ["1234"]);
});
