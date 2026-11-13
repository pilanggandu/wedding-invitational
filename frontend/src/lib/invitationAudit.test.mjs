import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const directory = path.dirname(fileURLToPath(import.meta.url));
const plain = (value) => JSON.parse(JSON.stringify(value));
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

function load(relative, mocks = {}, globals = {}) {
  const filename = path.resolve(directory, relative);
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const context = vm.createContext({ exports: {}, console, setTimeout, clearTimeout, URLSearchParams, TextEncoder, CustomEvent: typeof CustomEvent !== "undefined" ? CustomEvent : class CustomEvent { constructor(type, init) { this.type = type; this.detail = init?.detail; } }, ...globals, require: (name) => {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    if (name === "@/data/weddingData") return load("../data/weddingData.ts");
    if (name === "@/lib/api") return {
      fetchInvitationFromBackend: async () => null,
      fetchGuestsFromBackend: async () => null,
      fetchWishesFromBackend: async () => null,
      deleteGuestFromBackend: async () => true,
      deleteGuestMasterFromBackend: async () => {},
      addGuestToBackend: async () => null,
      updateGuestInBackend: async () => true,
      verifyGuestTokenApi: async () => ({ success: false }),
      checkGuestAccessApi: async () => ({ allowed: true, isDeleted: false }),
    };
    if (name === "./guestData") return load("guestData.ts");
    if (name === "@/lib/invitationStore") return load("invitationStore.ts");
    if (name === "@/lib/colorPalettes") return load("colorPalettes.ts");
    if (name === "@/lib/assetPreloader") return load("assetPreloader.ts");
    if (name === "@/lib/typography") return { getFontFamilyCss: () => "serif" };
    return require(name);
  } });
  vm.runInContext(source, context, { filename });
  return context.exports;
}

test("intentional empty sections and dress code do not restore default content", () => {
  const { normalizeWeddingData } = load("../context/WeddingDataContext.tsx");
  const result = normalizeWeddingData({ events: [], gallery: [], stories: [], gifts: { accounts: [] }, dresscode: { colors: [], description: "" } });
  for (const value of [result.events, result.gallery, result.stories, result.gifts.accounts, result.dresscode.colors]) assert.deepEqual(plain(value), []);
  assert.equal(result.dresscode.description, "");
});

test("fallback wedding data has the confirmed date and no fictional bank accounts", () => {
  const data = load("invitationStore.ts").DEFAULT_INVITATION_DATA;
  assert.equal(data.couple.bride.name, "Salsa");
  assert.ok(data.countdownTarget.startsWith("2026-11-28"));
  assert.ok(data.events.every((event) => event.dateStr.startsWith("2026-11-28") && event.calendarEvent.startDate.startsWith("20261128")));
  assert.deepEqual(plain(data.gifts.accounts), []);
  assert.equal(data.general.quote.arabic.includes("?"), false);
});

test("cover displays the verified guest name instead of the opaque URL token", () => {
  const data = load("invitationStore.ts").DEFAULT_INVITATION_DATA;
  const empty = new Proxy({}, { get: () => () => null });
  const { EnvelopeCover } = load("../components/EnvelopeCover.tsx", {
    "@/context/WeddingDataContext": { useWeddingData: () => data },
    "./PaperArtDecorations": empty,
    "@/components/CharMotionReveal": { CharMotionReveal: ({ text }) => React.createElement("span", null, text) },
    "@/lib/motion": load("motion.ts"),
  }, { window: { location: { search: "?u=opaque-token-123&to=Unverified" } } });
  const html = renderToStaticMarkup(React.createElement(EnvelopeCover, { onOpen() {}, isOpen: false, initialGuestName: "Nama Terverifikasi" }));
  assert.ok(html.includes("Nama Terverifikasi"));
  assert.ok(!html.includes("opaque-token-123"));
});

test("guest response preview never sends an RSVP or wish", async () => {
  let calls = 0;
  const { saveGuestResponse } = load("guestResponse.ts", { "./api": { submitRsvpApi: async () => { calls++; } }, "./invitationStore": { submitWishConfirmed: async () => { calls++; } } });
  const result = await saveGuestResponse({ name: "Tamu", attendance: "hadir", attendeeCount: 1, quota: 2, message: "Doa", guestId: "1", preview: true });
  assert.equal(calls, 0);
  assert.equal(result.tone, "notice");
});

test("failed RSVP keeps the message and does not send a separate wish", async () => {
  let wishes = 0;
  const { saveGuestResponse } = load("guestResponse.ts", { "./api": { submitRsvpApi: async () => ({ success: false, error: "Server gagal" }) }, "./invitationStore": { submitWishConfirmed: async () => { wishes++; } } });
  const result = await saveGuestResponse({ name: "Tamu", attendance: "hadir", attendeeCount: 1, quota: 2, message: "Doa", guestId: "1" });
  assert.equal(result.tone, "error");
  assert.equal(result.clearMessage, false);
  assert.equal(wishes, 0);
});

test("partial save reports confirmed attendance while preserving an unconfirmed wish", async () => {
  const { saveGuestResponse } = load("guestResponse.ts", { "./api": { submitRsvpApi: async () => ({ success: true }) }, "./invitationStore": { submitWishConfirmed: async () => { throw new Error("Offline"); } } });
  const result = await saveGuestResponse({ name: "Tamu", attendance: "hadir", attendeeCount: 1, quota: 2, message: "Doa", guestId: "1" });
  assert.equal(result.tone, "error");
  assert.equal(result.clearMessage, false);
  assert.match(result.message, /Kehadiran sudah tersimpan/);
});

test("RSVP accepts attendance without a mandatory public wish", async () => {
  let payload;
  const { saveGuestResponse } = load("guestResponse.ts", { "./api": { submitRsvpApi: async (value) => { payload = value; return { success: true }; } }, "./invitationStore": {} });
  const result = await saveGuestResponse({ name: "Tamu", attendance: "tidak", attendeeCount: 2, quota: 2, message: "", guestId: "1" });
  assert.equal(payload.status, 2);
  assert.equal(payload.attendeeCount, 0);
  assert.equal(result.tone, "success");
});

test("invalid quota and unsupported attendance do not reach the API", async () => {
  const { saveGuestResponse } = load("guestResponse.ts", { "./api": {}, "./invitationStore": {} });
  for (const updates of [{ attendeeCount: 3 }, { attendance: "ragu" }, { attendeeCount: Number.NaN }]) {
    const result = await saveGuestResponse({ name: "Tamu", attendance: "hadir", attendeeCount: 1, quota: 2, message: "Doa", guestId: "1", ...updates });
    assert.equal(result.tone, "error");
    assert.equal(result.clearMessage, false);
  }
});

test("public RSVP confirms attendance and records submission by name without requiring a personal guest link", async () => {
  let rsvpPayload;
  const { saveGuestResponse } = load("guestResponse.ts", {
    "./api": {
      submitRsvpApi: async (params) => {
        rsvpPayload = params;
        return { success: true, data: { id: "rsvp_1", ...params } };
      },
    },
    "./invitationStore": { submitWishConfirmed: async () => ({ id: "saved" }) },
  });
  const result = await saveGuestResponse({ name: "Tamu", attendance: "hadir", attendeeCount: 1, quota: 2, message: "Doa" });
  assert.equal(result.tone, "success");
  assert.equal(rsvpPayload.name, "Tamu");
  assert.equal(rsvpPayload.status, 1);
  assert.equal(rsvpPayload.attendeeCount, 1);
  assert.match(result.message, /tersimpan/);
  assert.equal(result.clearMessage, true);
});

test("empty event lists do not manufacture a date or ceremony time on the cover and desktop", () => {
  const data = { ...load("invitationStore.ts").DEFAULT_INVITATION_DATA, events: [] };
  const empty = new Proxy({}, { get: () => () => null });
  const mocks = { "@/context/WeddingDataContext": { useWeddingData: () => data }, "./PaperArtDecorations": empty, "@/components/CharMotionReveal": { CharMotionReveal: ({ text }) => React.createElement("span", null, text) }, "@/lib/motion": load("motion.ts") };
  for (const [file, component] of [["EnvelopeCover", "EnvelopeCover"], ["DesktopLeftShowcase", "DesktopLeftShowcase"]]) {
    const loaded = load(`../components/${file}.tsx`, mocks);
    const html = renderToStaticMarkup(React.createElement(loaded[component], { onOpen() {}, isOpen: false }));
    assert.ok(!html.includes("28 November 2026"), file);
    assert.ok(!html.includes("08:00 - 10:00 WIB"), file);
  }
});

test("isGuestDeletedLocally correctly flags deleted guests by token, slug, and name", () => {
  const store = {};
  const mockLocalStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = val; },
    removeItem: (key) => { delete store[key]; },
  };
  const mockWindow = {
    dispatchEvent: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  const invitationStore = load("invitationStore.ts", {}, {
    localStorage: mockLocalStorage,
    window: mockWindow,
  });

  invitationStore.recordDeletedGuest({
    id: "g_123",
    name: "Budi Santoso",
    slug: "Budi+Santoso",
    token: "token-budi-123",
  });

  // Check by token
  assert.equal(invitationStore.isGuestDeletedLocally({ token: "token-budi-123" }), true);
  // Check by name
  assert.equal(invitationStore.isGuestDeletedLocally({ name: "Budi Santoso" }), true);
  // Check by encoded / plus name
  assert.equal(invitationStore.isGuestDeletedLocally({ name: "Budi+Santoso" }), true);
  // Check by ID
  assert.equal(invitationStore.isGuestDeletedLocally({ id: "g_123" }), true);

  // Unrelated active guest should not be flagged
  assert.equal(invitationStore.isGuestDeletedLocally({ token: "active-guest-token", name: "Siti Rahma" }), false);
});

test("AccessDeniedInvitation component renders respectful message without em dashes", () => {
  const { AccessDeniedInvitation } = load("../components/AccessDeniedInvitation.tsx", {
    "next/link": ({ children, href, className }) => React.createElement("a", { href, className }, children),
    "lucide-react": {
      Lock: () => React.createElement("span", null, "LockIcon"),
      HeartHandshake: () => React.createElement("span", null, "HeartIcon"),
      Home: () => React.createElement("span", null, "HomeIcon"),
    },
  });

  const html = renderToStaticMarkup(
    React.createElement(AccessDeniedInvitation, {
      guestName: "Budi Santoso",
      coupleName: "Gilang & Salsa",
    })
  );

  assert.ok(html.includes("Akses Undangan Dinonaktifkan"));
  assert.ok(html.includes("Budi Santoso"));
  assert.ok(html.includes("Gilang &amp; Salsa") || html.includes("Gilang & Salsa"));
  assert.ok(!html.includes("—"), "Must not contain em dashes");
});
