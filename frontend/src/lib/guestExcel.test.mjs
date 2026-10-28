import test from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import {
  createGuestExcelTemplate,
  parseGuestExcelFile,
  parseGuestExcelRows,
} from "./guestExcel.ts";

const textCell = (value) => ({ value, kind: "text" });
const numberCell = (value) => ({ value, kind: "number" });
const row = (rowNumber, values) => ({
  rowNumber,
  cells: Object.fromEntries(values.map((value, index) => [index, typeof value === "string" ? textCell(value) : value])),
});
const headers = row(1, ["Nama", "WhatsApp", "Kategori", "Kuota", "Catatan"]);

test("reads Indonesian columns, preserves phone text, and skips a blank template row", () => {
  const result = parseGuestExcelRows([
    headers,
    row(2, ["", "", "", "", ""]),
    row(3, ["  Ibu Rina  ", "081234567890", "Keluarga", numberCell("2"), "Datang bersama keluarga"]),
    row(4, ["Tamu tanpa nomor", "", "", "", ""]),
  ]);
  assert.equal(result.length, 2);
  assert.equal(result[0].rowNumber, 3);
  assert.deepEqual(result[0].guest, {
    name: "Ibu Rina", phone: "081234567890", category: "Keluarga", quota: 2, notes: "Datang bersama keluarga",
  });
  assert.equal(result[1].guest.phone, "");
  assert.equal(result[1].guest.quota, 1);
  assert.equal(result[1].error, null);
});

test("accepts reordered English aliases and defaults omitted optional columns", () => {
  const result = parseGuestExcelRows([
    row(4, ["Notes", "Guest Name", "Phone Number", "Pax", "Group"]),
    row(6, ["Catatan", "Rudi", "+62 812-3456-7890", "3", "Rekan Kerja"]),
  ]);
  assert.deepEqual(result[0].guest, {
    name: "Rudi", phone: "+62 812-3456-7890", category: "Rekan Kerja", quota: 3, notes: "Catatan",
  });
  assert.equal(parseGuestExcelRows([row(1, ["Nama Tamu"]), row(2, ["Siti"])])[0].guest.category, "Lainnya");
});

test("rejects ambiguous headers and a sheet without a name column", () => {
  assert.throws(() => parseGuestExcelRows([row(1, ["Nama", "Name"])]), /kolom.*berulang/i);
  assert.throws(() => parseGuestExcelRows([row(1, ["Telepon", "Catatan"])]), /kolom.*Nama/i);
});

test("flags formula, scientific phone, damaged number, and invalid quota with Excel row numbers", () => {
  const result = parseGuestExcelRows([
    headers,
    row(2, ["Rumus", { value: "081234567890", kind: "formula" }, "", "1", ""]),
    row(3, ["Ilmiah", numberCell("8.12346E+11"), "", "1", ""]),
    row(4, ["Presisi", numberCell("6281234567890123"), "", "1", ""]),
    row(5, ["Desimal", numberCell("8123456.5"), "", "1", ""]),
    row(6, ["Kuota", "", "", "dua", ""]),
    row(7, ["Normal", numberCell("6281234567890"), "", "1", ""]),
    row(8, ["Nol hilang", numberCell("81234567890"), "", "1", ""]),
  ]);
  assert.match(result[0].error, /rumus/i);
  assert.match(result[1].error, /ilmiah|teks/i);
  assert.match(result[2].error, /presisi|teks/i);
  assert.match(result[3].error, /teks|bulat/i);
  assert.match(result[4].error, /kuota/i);
  assert.equal(result[4].rowNumber, 6);
  assert.equal(result[5].error, null);
  assert.equal(result[5].guest.phone, "6281234567890");
  assert.match(result[6].error, /angka 0|teks/i);
});

test("bounds nonempty import rows at 1000", () => {
  assert.throws(() => parseGuestExcelRows([
    headers,
    ...Array.from({ length: 1001 }, (_, index) => row(index + 2, [`Tamu ${index}`, "", "", "", ""])),
  ]), /1[.,]?000|1000/);
});

test("accepts integer quota values serialized as Excel decimal numbers", () => {
  const result = parseGuestExcelRows([headers, row(2, ["Rudi", "", "", numberCell("2.0"), ""])]);
  assert.equal(result[0].error, null);
  assert.equal(result[0].guest.quota, 2);
});

test("creates an XLSX template with text phone formatting and no fake guest", async () => {
  const blob = await createGuestExcelTemplate();
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  const sheet = await zip.file("xl/worksheets/sheet1.xml").async("string");
  const styles = await zip.file("xl/styles.xml").async("string");
  assert.match(sheet, /Nama/);
  assert.match(sheet, /WhatsApp/);
  assert.match(sheet, /Catatan/);
  assert.match(sheet, /<col[^>]*min="2"[^>]*style="2"/);
  assert.match(styles, /numFmtId="49"/);
  assert.doesNotMatch(sheet, /0812|Budi|Rina|Siti|Contoh/);
  assert.equal((sheet.match(/<row /g) || []).length, 2);
});

test("rejects old Excel format and oversized uploads before reading file contents", async () => {
  let read = false;
  const file = { name: "tamu.xls", size: 20, arrayBuffer: async () => { read = true; return new ArrayBuffer(0); } };
  await assert.rejects(() => parseGuestExcelFile(file), /xlsx/i);
  await assert.rejects(() => parseGuestExcelFile({ ...file, name: "tamu.xlsx", size: 5 * 1024 * 1024 + 1 }), /5 MB/i);
  assert.equal(read, false);
});

test("bounds XML inflation and archive entry count before XML parsing", async () => {
  const zip = new JSZip();
  zip.file("xl/workbook.xml", "x".repeat(4 * 1024 * 1024 + 1));
  const data = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
  const file = { name: "tamu.xlsx", size: data.length, arrayBuffer: async () => data.buffer };
  await assert.rejects(() => parseGuestExcelFile(file), /XML.*besar|batas.*XML/i);
  const many = new JSZip();
  for (let index = 0; index < 101; index += 1) many.file(`entry-${index}.xml`, "<x/>");
  const entries = await many.generateAsync({ type: "uint8array" });
  await assert.rejects(() => parseGuestExcelFile({ ...file, size: entries.length, arrayBuffer: async () => entries.buffer }), /terlalu banyak/i);
});

test("checks archive entry counts before JSZip expands the directory", async () => {
  const bytes = new Uint8Array(22);
  const directory = new DataView(bytes.buffer);
  directory.setUint32(0, 0x06054b50, true);
  directory.setUint16(8, 101, true);
  directory.setUint16(10, 101, true);
  await assert.rejects(() => parseGuestExcelFile({ name: "tamu.xlsx", size: bytes.length, arrayBuffer: async () => bytes.buffer }), /terlalu banyak/i);
});
