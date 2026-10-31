const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const sourcePath = path.resolve(__dirname, "../src/postgres.ts");
const compiledSource = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    esModuleInterop: true,
  },
}).outputText;

function createService(persistedGeneral) {
  const normalizedData = {
    id: "inv_gilang_salsa",
    general: {
      musicTitle: "Existing instrumental",
      musicArtist: "Existing artist",
      openingMessage: "Keep normalized invitation content",
    },
  };
  const reads = [];
  const context = vm.createContext({
    exports: {},
    require: (name) => name === "dotenv" ? { config() {} } : {},
    console,
    persistedGeneral,
    normalizedData,
    reads,
  });
  vm.runInContext(compiledSource, context, { filename: sourcePath });
  vm.runInContext(`
    pool = {
      query: async (sql, values) => {
        reads.push({ sql, values });
        return { rows: [{ general: persistedGeneral }] };
      },
    };
    normalizedWeddingService = {
      getAggregatedWeddingData: async () => normalizedData,
    };
  `, context);
  return { service: context.exports.postgresService, reads };
}

test("normalized PostgreSQL reads restore music saved in the wide JSON row", async () => {
  const music = {
    musicUrl: "https://example.test/wedding.mp3",
    musicTitle: "Our song",
    musicArtist: "Our artist",
    musicVolume: 0,
  };
  const { service, reads } = createService(JSON.stringify(music));
  const result = await service.getWedding("inv_gilang_salsa");

  for (const [key, value] of Object.entries(music)) {
    assert.equal(result.general[key], value, key);
  }
  assert.equal(reads.length, 1);
  assert.match(reads[0].sql, /^SELECT (\*|general) FROM weddings WHERE id = \$1$/);
  assert.equal(reads[0].values[0], "inv_gilang_salsa");
});

test("explicit blank music fields survive and unrelated general fields stay normalized", async () => {
  const { service } = createService({
    musicUrl: "",
    musicTitle: "",
    musicArtist: "",
    musicVolume: 100,
    openingMessage: "Old content from the wide table",
  });
  const result = await service.getWedding();

  assert.equal(result.general.musicUrl, "");
  assert.equal(result.general.musicTitle, "");
  assert.equal(result.general.musicArtist, "");
  assert.equal(result.general.musicVolume, 100);
  assert.equal(result.general.openingMessage, "Keep normalized invitation content");
});

test("missing optional music fields retain normalized defaults", async () => {
  const { service } = createService({ openingMessage: "Old content" });
  const result = await service.getWedding();

  assert.equal(result.general.musicTitle, "Existing instrumental");
  assert.equal(result.general.musicArtist, "Existing artist");
  assert.equal(Object.hasOwn(result.general, "musicUrl"), false);
  assert.equal(Object.hasOwn(result.general, "musicVolume"), false);
});
