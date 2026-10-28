import test from "node:test";
import assert from "node:assert/strict";
import { normalizeGuestPhone, getGuestDuplicateKey, getGuestInputError } from "./guestData.ts";

test("local, international, and formatted Indonesian numbers normalize consistently", () => {
  assert.equal(normalizeGuestPhone("0812-3456-7890"), "6281234567890");
  assert.equal(normalizeGuestPhone("+62 812 3456 7890"), "6281234567890");
  assert.equal(normalizeGuestPhone("0044 7700 900123"), "447700900123");
  for (const phone of ["+86 13800138000", "+81 9012345678", "081234567890"]) {
    assert.equal(normalizeGuestPhone(normalizeGuestPhone(phone)), normalizeGuestPhone(phone));
  }
});

test("guest validation permits no phone but rejects damaged numbers and invalid quotas", () => {
  assert.equal(getGuestInputError({ name: "Tamu", phone: "" }), null);
  assert.ok(getGuestInputError({ name: "Tamu", phone: "08abc123456789" }));
  assert.ok(getGuestInputError({ name: "Tamu", phone: "8.123e+11" }));
  assert.ok(getGuestInputError({ name: "Tamu", phone: "", quota: 1.5 }));
  assert.ok(getGuestInputError({ name: " ", phone: "" }));
});

test("deduplication recognizes the same guest while permitting a shared family phone", () => {
  assert.equal(getGuestDuplicateKey("  Budi   Santoso ", "081234567890"), getGuestDuplicateKey("budi santoso", "+6281234567890"));
  assert.notEqual(getGuestDuplicateKey("Budi", "081234567890"), getGuestDuplicateKey("Siti", "081234567890"));
});
