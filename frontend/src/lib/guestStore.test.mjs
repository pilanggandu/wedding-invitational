import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));

const plain = (value) => JSON.parse(JSON.stringify(value));
const guest = { id: "server-1", name: "Tamu Uji", phone: "6281234567890", slug: "Tamu+Uji", category: "Keluarga", notes: "Catatan", quota: 2, isSent: false, token: "personal-token", createdAt: "2026-10-25T00:00:00Z" };

function loadStore(api = {}, initialGuests = []) {
  const values = new Map([["wedding_guests_data_v1", JSON.stringify(initialGuests)]]);
  const events = [];
  const localStorage = { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
  function load(sourcePath) {
    const compiled = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const context = vm.createContext({
      exports: {}, URL, console, localStorage,
      window: { dispatchEvent: (event) => events.push(event) },
      CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
      setTimeout: () => 0,
      require: (name) => {
        if (name === "@/lib/api") return api;
        if (name === "@/data/weddingData") return load(path.resolve(testDirectory, "../data/weddingData.ts"));
        if (name === "./guestData") return load(path.resolve(testDirectory, "guestData.ts"));
        throw new Error(`Unexpected dependency: ${name}`);
      },
    });
    vm.runInContext(compiled, context, { filename: sourcePath });
    return context.exports;
  }
  return { store: load(path.resolve(testDirectory, "invitationStore.ts")), values, events };
}

test("an empty persisted guest master does not restore sample guests", () => {
  const { store } = loadStore();
  assert.deepEqual(plain(store.getGuests()), []);
});

test("create waits for canonical server ID/token before inserting into the master", async () => {
  let resolve;
  let submitted;
  const { store } = loadStore({ saveGuestMasterToBackend: (draft) => { submitted = draft; return new Promise((done) => { resolve = done; }); } });
  const pending = store.saveGuestMaster({ name: " Tamu Uji ", phone: "081234567890", category: "Keluarga", notes: " Catatan ", quota: 2 });
  assert.deepEqual(plain(store.getGuests()), []);
  assert.equal(submitted.phone, "6281234567890");
  resolve(guest);
  assert.equal((await pending).id, "server-1");
  assert.equal(store.getGuests()[0].token, "personal-token");
});

test("failed create and delete leave the existing master unchanged", async () => {
  const fail = async () => { throw new Error("Server offline"); };
  const { store } = loadStore({ saveGuestMasterToBackend: fail, deleteGuestMasterFromBackend: fail }, [guest]);
  await assert.rejects(store.saveGuestMaster({ name: "Tamu baru", phone: "", category: "Sahabat", notes: "", quota: 1 }), /Server offline/);
  await assert.rejects(store.deleteGuestMaster(guest.id), /Server offline/);
  assert.deepEqual(plain(store.getGuests()), [guest]);
});

test("confirming delivery retains the existing token and guest metadata", async () => {
  const { store } = loadStore({ saveGuestMasterToBackend: async (draft, id) => ({ id, isSent: draft.isSent }) }, [guest]);
  const saved = await store.setGuestSentStatus(guest.id, true);
  assert.equal(saved.isSent, true);
  assert.equal(saved.token, guest.token);
  assert.equal(saved.category, guest.category);
  assert.equal(saved.quota, 2);
});

test("the legacy WhatsApp generator preserves a token URL without duplicating its route", () => {
  const { store } = loadStore();
  const url = store.generateWhatsAppInvitationUrl("081234567890", "Tamu & Keluarga", "Gilang", "Salsadila", "https://example.test/undangan?u=PERSONAL&template=paper-keepsake", "25 Oktober 2026");
  const message = new URL(url).searchParams.get("text");
  assert.ok(message.includes("https://example.test/undangan?u=PERSONAL&template=paper-keepsake"));
  assert.ok(!message.includes("PERSONAL/undangan"));
  assert.ok(!message.includes("?to="));
});

function loadApi(fetch) {
  const sourcePath = path.resolve(testDirectory, "api.ts");
  const compiled = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const context = vm.createContext({ exports: {}, fetch, AbortController, process: { env: { NEXT_PUBLIC_API_URL: "https://example.test/api" } }, window: {}, localStorage: { getItem: () => null }, setTimeout: () => 0, clearTimeout() {}, console });
  vm.runInContext(compiled, context, { filename: sourcePath });
  return context.exports;
}

test("an aborted guest POST is unconfirmed and cannot be treated as safe to retry", async () => {
  const api = loadApi(async () => { throw new Error("Request aborted"); });
  await assert.rejects(api.saveGuestMasterToBackend({ name: "Uji", phone: "", category: "Sahabat", notes: "", quota: 1 }), (error) => error.unconfirmed === true);
});

test("validation refusal is retryable, while a server failure after POST remains unconfirmed", async () => {
  for (const [status, unconfirmed] of [[400, false], [500, true]]) {
    const api = loadApi(async () => ({ ok: false, status, json: async () => ({ error: "Guest request failed" }) }));
    await assert.rejects(api.saveGuestMasterToBackend({ name: "Uji", phone: "", category: "Sahabat", notes: "", quota: 1 }), (error) => error.unconfirmed === unconfirmed);
  }
});
