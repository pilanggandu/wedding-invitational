import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";

const helperPath = new URL("./guestWhatsApp.ts", import.meta.url);
const source = await readFile(helperPath, "utf8").catch((error) => {
  if (error.code === "ENOENT") return "";
  throw error;
});
const runtimeSource = stripTypeScriptTypes(source).replace(
  /(["'])@\/lib\/guestData\1/g,
  JSON.stringify(new URL("./guestData.ts", import.meta.url).href)
);
const helpers = await import(`data:text/javascript;base64,${Buffer.from(runtimeSource).toString("base64")}`);

function helper(name) {
  assert.equal(typeof helpers[name], "function", `${name} is not implemented`);
  return helpers[name];
}

const guest = { name: "Budi & Rina", token: "guest-token&one" };
const data = {
  couple: { groom: { name: "Pandu" }, bride: { name: "Nanda" } },
  events: [{ displayDay: "Minggu", displayDate: "14 Maret 2027", dateStr: "2027-03-14T08:00:00+07:00" }],
};

test("keeps one invitation path and the recipient token when a personal base URL is reused", () => {
  const result = new URL(helper("getPersonalInvitationUrl")(
    "https://undangan.example/undangan/?template=paper-keepsake&u=old-token&to=Other+Guest",
    guest
  ));
  assert.equal(result.pathname, "/undangan");
  assert.equal(result.searchParams.get("u"), "guest-token&one");
  assert.equal(result.searchParams.get("template"), "paper-keepsake");
  assert.equal(result.searchParams.has("to"), false);
  assert.equal(result.searchParams.getAll("u").length, 1);
});

test("uses the invitation route for an origin and a safely encoded name for guests without a token", () => {
  const makeUrl = helper("getPersonalInvitationUrl");
  assert.equal(makeUrl("https://undangan.example", { name: "Budi & Rina", token: "" }),
    "https://undangan.example/undangan?to=Budi+%26+Rina");
  const result = new URL(makeUrl("https://undangan.example/undangan?u=previous&template=craft-book", { name: "Rina + Keluarga" }));
  assert.equal(result.searchParams.has("u"), false);
  assert.equal(result.searchParams.get("to"), "Rina + Keluarga");
  assert.equal(result.searchParams.get("template"), "craft-book");
});

test("rejects unsafe and incomplete website URLs instead of making an unusable invitation", () => {
  const makeUrl = helper("getPersonalInvitationUrl");
  for (const url of ["", "/undangan", "javascript:alert(1)", "file:///undangan", "https://user:secret@undangan.example"]) {
    assert.throws(() => makeUrl(url, guest), /URL/i, url);
  }
});

test("personalizes every supported placeholder without recursively replacing guest content", () => {
  const message = helper("buildGuestWhatsAppMessage")(
    { name: "Rina {link}", token: "rina" },
    data,
    "https://undangan.example/undangan?template=craft-book",
    "Halo {nama}! {mempelai_pria} & {mempelai_wanita}, {tanggal}.\n{link}\nUntuk {nama}"
  );
  assert.equal(message, "Halo Rina {link}! Pandu & Nanda, Minggu, 14 Maret 2027.\nhttps://undangan.example/undangan?template=craft-book&u=rina\nUntuk Rina {link}");
});

test("uses the supplied event date in the default message and never invents a missing date", () => {
  const makeMessage = helper("buildGuestWhatsAppMessage");
  assert.match(makeMessage(guest, data, "https://undangan.example"), /Minggu, 14 Maret 2027/);
  const withoutDate = makeMessage(guest, { ...data, events: [] }, "https://undangan.example");
  assert.match(withoutDate, /Budi & Rina/);
  assert.match(withoutDate, /Pandu & Nanda/);
  assert.doesNotMatch(withoutDate, /2026|2027|\{tanggal\}|undefined/);
});

test("builds a direct WhatsApp Web conversation with normalized phone and exact encoded message", () => {
  const makeUrl = helper("getWhatsAppWebUrl");
  const result = new URL(makeUrl("+62 812-3456-7890", "Halo Budi & Rina!\nhttps://undangan.example/undangan?u=a&template=craft-book"));
  assert.equal(result.origin, "https://web.whatsapp.com");
  assert.equal(result.pathname, "/send");
  assert.equal(result.searchParams.get("phone"), "6281234567890");
  assert.equal(result.searchParams.get("text"), "Halo Budi & Rina!\nhttps://undangan.example/undangan?u=a&template=craft-book");
  assert.equal(makeUrl("081234567890", "Halo"), "https://web.whatsapp.com/send?phone=6281234567890&text=Halo");
});

test("does not create a dispatch link for blank or invalid phones, or an empty message", () => {
  const makeUrl = helper("getWhatsAppWebUrl");
  for (const phone of ["", "123", "0812abc345678", "1e12", "6281234567890&phone=123"]) {
    assert.throws(() => makeUrl(phone, "Halo"), /nomor|WhatsApp/i, phone);
  }
  assert.throws(() => makeUrl("081234567890", "  "), /pesan/i);
});
