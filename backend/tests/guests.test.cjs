const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

function loadModule(relativePath, dependencies = {}) {
  const filename = path.resolve(__dirname, relativePath);
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const context = vm.createContext({
    exports: {}, console,
    require(name) {
      if (Object.hasOwn(dependencies, name)) return dependencies[name];
      if (name.startsWith("node:")) return require(name);
      if (name === "../guestValidation") return loadModule("../src/guestValidation.ts").exports;
      throw new Error(`Unexpected import ${name}`);
    },
  });
  vm.runInContext(source, context, { filename });
  return context;
}

function routeHarness({ postgres, sqlite = {}, supabase, normalized = false } = {}) {
  const handlers = {};
  const router = Object.fromEntries(["get", "post", "patch", "delete"].map((method) => [method, (route, handler) => {
    handlers[`${method} ${route}`] = handler;
  }]));
  loadModule("../src/routes/guests.ts", {
    express: { Router: () => router },
    "../postgres": { postgresService: postgres || {}, isPostgresConnected: () => Boolean(postgres), getNormalizedWeddingService: () => normalized ? {} : null },
    "../sqlite": { sqliteService: sqlite },
    "../supabase": { getSupabaseClient: () => supabase, isSupabaseConfigured: () => Boolean(supabase) },
  });
  return async (method, route, body, id = "12") => {
    const response = { statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(value) { this.body = value; return this; } };
    await handlers[`${method} ${route}`]({ body, params: { id } }, response);
    return response;
  };
}

test("POST rejects non-string names before reaching persistence", async () => {
  const invoke = routeHarness({ sqlite: { createGuest() { assert.fail("Invalid guest was written"); } } });
  const response = await invoke("post", "/", { name: 42 });
  assert.equal(response.statusCode, 400);
});

test("POST normalizes explicit local numbers and uses collision-resistant legacy IDs", async () => {
  const created = [];
  const invoke = routeHarness({ sqlite: { createGuest(input) { created.push(input); return { ...input, isSent: false }; } } });
  for (const [phone, expected] of [["0812-3456-7890", "6281234567890"], ["81234567890", "81234567890"], ["+62 812 3456 7890", "6281234567890"]]) {
    const response = await invoke("post", "/", { name: "  Budi  ", phone, quota: 1 });
    assert.equal(response.statusCode, 201);
    assert.equal(response.body.guest.phone, expected);
    assert.equal(response.body.guest.name, "Budi");
    assert.equal(response.body.guest.quota, 1);
    assert.match(response.body.guest.id, /^g_[0-9a-f-]{36}$/);
  }
  assert.equal(new Set(created.map((guest) => guest.id)).size, 3);
});

test("legacy providers reject unsupported quotas before creating or updating a guest", async () => {
  const rejectWrite = () => assert.fail("Unsupported quota reached persistence");
  const providers = [
    { sqlite: { createGuest: rejectWrite, updateGuest: rejectWrite } },
    { supabase: { from: rejectWrite } },
    { postgres: { createGuest: rejectWrite, updateGuest: rejectWrite } },
  ];
  for (const provider of providers) {
    const invoke = routeHarness(provider);
    for (const [method, route, body] of [["post", "/", { name: "Ayu", quota: 2 }], ["patch", "/:id", { quota: 2 }]]) {
      const response = await invoke(method, route, body);
      assert.equal(response.statusCode, 400);
      assert.match(response.body.error, /belum mendukung kuota lebih dari 1/);
    }
  }
});

test("normalized PostgreSQL keeps supporting quotas above one", async () => {
  const saved = { id: "12", name: "Ayu", phone: "", category: "Keluarga", notes: "", quota: 2, token: "saved-token", isSent: false, createdAt: "2026-10-25" };
  const invoke = routeHarness({ normalized: true, postgres: {
    async createGuest(input) { return { ...saved, quota: input.quota }; },
    async updateGuest(_id, input) { return { ...saved, quota: input.quota }; },
  } });
  const created = await invoke("post", "/", { name: "Ayu", quota: 2 });
  assert.equal(created.statusCode, 201);
  assert.equal(created.body.guest.quota, 2);
  const updated = await invoke("patch", "/:id", { quota: 3 });
  assert.equal(updated.statusCode, 200);
  assert.equal(updated.body.guest.quota, 3);
});

test("PATCH rejects invalid fields rather than converting them into a database error", async () => {
  const invoke = routeHarness({ postgres: { updateGuest() { assert.fail("Invalid update was written"); } } });
  for (const body of [{ name: " " }, { phone: 8123456789 }, { phone: "call-me" }, { quota: 0 }, { quota: 1.5 }, { quota: 21 }, { isSent: "true" }, { notes: null }, []]) {
    const response = await invoke("patch", "/:id", body);
    assert.equal(response.statusCode, 400, JSON.stringify(body));
  }
});

test("guest validation retains international country codes and enforces quota boundaries", () => {
  const { validateGuestCreate, validateGuestUpdate } = loadModule("../src/guestValidation.ts").exports;
  for (const [phone, expected] of [["+86 138 1234 5678", "8613812345678"], ["14155552671", "14155552671"], ["+44 (7700) 900123", "447700900123"], ["", ""]]) {
    assert.equal(validateGuestCreate({ name: "Ayu", phone }).phone, expected);
  }
  assert.equal(validateGuestCreate({ name: "Ayu", quota: 20 }).quota, 20);
  assert.equal(validateGuestUpdate({ quota: 1 }).quota, 1);
  for (const quota of ["2", null, Infinity, NaN, -1, 0, 1.5, 21]) {
    assert.throws(() => validateGuestCreate({ name: "Ayu", quota }));
  }
  for (const phone of ["12345", "+081234567890", "62812345678901234", "0812abc3456789", "62+8123456789"]) {
    assert.throws(() => validateGuestCreate({ name: "Ayu", phone }), phone);
  }
  assert.throws(() => validateGuestUpdate({}));
  assert.throws(() => validateGuestCreate({ name: "Ayu", category: [] }));
});

test("phone normalization is idempotent for stored Japanese and Chinese numbers", () => {
  const { normalizeGuestPhone } = loadModule("../src/guestValidation.ts").exports;
  for (const [phone, expected] of [["+86 138 1234 5678", "8613812345678"], ["+81 90 1234 5678", "819012345678"], ["0086 138 1234 5678", "8613812345678"], ["0081 90 1234 5678", "819012345678"], ["0812-3456-7890", "6281234567890"], ["81234567890", "81234567890"]]) {
    const normalized = normalizeGuestPhone(phone);
    assert.equal(normalized, expected, phone);
    assert.equal(normalizeGuestPhone(normalized), expected, phone);
  }
});

test("Supabase PATCH returns the persisted camelCase guest and recomputes slug on rename", async () => {
  const row = { id: "g_saved", name: "Ayu Baru", slug: "Ayu+Baru", phone: "6281234567890", category: "Keluarga", notes: "Tetap", is_sent: true, created_at: "2026-10-25T00:00:00Z" };
  let updates;
  const supabase = { from(table) {
    assert.equal(table, "guests");
    return { update(value) { updates = value; return this; }, eq() { return this; }, select() { return this; }, async single() { return { data: row, error: null }; } };
  } };
  const response = await routeHarness({ supabase })("patch", "/:id", { name: "  Ayu Baru  ", isSent: true });
  assert.equal(updates.slug, "Ayu+Baru");
  assert.equal(response.body.guest.isSent, true);
  assert.equal(response.body.guest.createdAt, "2026-10-25T00:00:00Z");
  assert.equal(response.body.guest.notes, "Tetap");
  assert.equal(response.body.guest.quota, 1);
  assert.equal(Object.hasOwn(response.body.guest, "is_sent"), false);
});

test("normalized status-only PATCH preserves persisted category, token and quota", async () => {
  const row = { id: 12, name: "Budi", phone: "6281234567890", token: "saved-token", quota: 3, invitation_status: 2, sent_at: "2026-10-20", guest_group_id: 4, group_name: "Keluarga", notes: "Keluarga dekat", open_count: 2, opened_at: "2026-10-21", created_at: "2026-10-19" };
  const { exports: { NormalizedWeddingService } } = loadModule("../src/services/normalizedWeddingService.ts", {
    pg: {}, "../database/migration_service": { generateSecureToken: () => "new-token" },
  });
  const pool = { async query(sql) {
    if (/SELECT.*FROM guests/s.test(sql)) return { rows: [row] };
    if (/SELECT.*(?:name|id).*FROM guest_groups/s.test(sql)) return { rows: [{ id: 4, name: "Keluarga" }] };
    if (/UPDATE guests/.test(sql)) return { rows: [{ ...row, group_name: "Keluarga" }] };
    throw new Error(`Unexpected query ${sql}`);
  } };
  const result = await new NormalizedWeddingService(pool).updateGuest("12", { isSent: true });
  assert.equal(result.category, "Keluarga");
  assert.equal(result.token, "saved-token");
  assert.equal(result.quota, 3);
  assert.equal(result.invitationStatus, 2);
});

test("normalized create persists a category that does not yet exist", async () => {
  let insertedGroup = false;
  const { exports: { NormalizedWeddingService } } = loadModule("../src/services/normalizedWeddingService.ts", {
    pg: {}, "../database/migration_service": { generateSecureToken: () => "new-token" },
  });
  const pool = { async query(sql, values) {
    if (/SELECT.*FROM guest_groups/s.test(sql)) return { rows: insertedGroup ? [{ id: 8, name: "Rekan Kerja" }] : [] };
    if (/INSERT INTO guest_groups/.test(sql)) { insertedGroup = true; return { rows: [{ id: 8, name: "Rekan Kerja" }] }; }
    if (/INSERT INTO guests/.test(sql)) return { rows: [{ id: 30, name: "Ayu", phone: "6281234567890", token: "new-token", quota: 2, invitation_status: 0, notes: "", created_at: "2026-10-25", guest_group_id: values[0] }] };
    throw new Error(`Unexpected query ${sql}`);
  } };
  const service = new NormalizedWeddingService(pool);
  const guest = await service.createGuest({ name: "Ayu", phone: "081234567890", category: "Rekan Kerja", quota: 2 });
  assert.equal(insertedGroup, true);
  assert.equal(guest.category, "Rekan Kerja");
  assert.equal(guest.groupId, 8);
});

test("normalized PostgreSQL errors do not execute incompatible legacy guest SQL", async () => {
  const failure = new Error("normalized write failed");
  const context = loadModule("../src/postgres.ts", {
    dotenv: { config() {} }, pg: {}, "./auth": {}, "./database/migration_service": {}, "./services/normalizedWeddingService": {},
  });
  context.failure = failure;
  vm.runInContext(`
    pool = { query: async () => { throw new Error("Unexpected legacy fallback"); } };
    normalizedWeddingService = {
      getGuests: async () => { throw failure; },
      createGuest: async () => { throw failure; },
      updateGuest: async () => { throw failure; },
      softDeleteGuest: async () => { throw failure; },
    };
  `, context);
  const service = context.exports.postgresService;
  await assert.rejects(service.getGuests(), (error) => error === failure);
  await assert.rejects(service.createGuest({ id: "g_test", name: "Budi", slug: "Budi" }), (error) => error === failure);
  await assert.rejects(service.updateGuest("12", { isSent: true }), (error) => error === failure);
  await assert.rejects(service.deleteGuest("12"), (error) => error === failure);
});
