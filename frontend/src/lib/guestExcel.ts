import JSZip from "jszip";
import type { GuestDraft } from "./guestData";

export const GUEST_EXCEL_MAX_FILE_BYTES = 5 * 1024 * 1024;
export const GUEST_EXCEL_MAX_ROWS = 1000;
const MAX_ARCHIVE_ENTRIES = 100;
const MAX_XML_ENTRY_BYTES = 4 * 1024 * 1024;
const MAX_XML_TOTAL_BYTES = 8 * 1024 * 1024;
const MAX_SHEET_CELLS = 50000;
const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export interface GuestExcelCell {
  value: string;
  kind: "text" | "number" | "formula" | "invalid";
}

export interface GuestExcelSheetRow {
  rowNumber: number;
  cells: Record<number, GuestExcelCell>;
}

export interface GuestExcelRow {
  rowNumber: number;
  guest: GuestDraft;
  error: string | null;
}

type Field = keyof GuestDraft;
const HEADER_ALIASES: Record<string, Field> = {
  nama: "name", namatamu: "name", namalengkap: "name", name: "name", guest: "name", guestname: "name", fullname: "name",
  whatsapp: "phone", nomorwa: "phone", nomorwhatsapp: "phone", nowhatsapp: "phone", nowa: "phone", wa: "phone", telepon: "phone", nomor: "phone", nomortelepon: "phone", phone: "phone", phonenumber: "phone", whatsappnumber: "phone", mobile: "phone", hp: "phone", nohp: "phone",
  kategori: "category", category: "category", grup: "category", group: "category", kelompok: "category",
  kuota: "quota", quota: "quota", pax: "quota", jumlahtamu: "quota", guestcount: "quota", jumlah: "quota",
  catatan: "notes", catatankhusus: "notes", note: "notes", notes: "notes", keterangan: "notes", remarks: "notes",
};

function headerKey(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function parseGuestExcelRows(sheetRows: GuestExcelSheetRow[]): GuestExcelRow[] {
  const nonempty = sheetRows.filter((row) => Object.values(row.cells).some((cell) => cell.value.trim() || cell.kind === "formula"));
  const header = nonempty[0];
  if (!header) throw new Error("Sheet kosong. Isi kolom Nama pada template sebelum mengimpor.");

  const fields = new Map<Field, number>();
  for (const [column, cell] of Object.entries(header.cells)) {
    const field = HEADER_ALIASES[headerKey(cell.value)];
    if (!field) continue;
    if (fields.has(field)) throw new Error(`Kolom ${cell.value} berulang. Gunakan satu kolom untuk setiap data tamu.`);
    fields.set(field, Number(column));
  }
  if (!fields.has("name")) throw new Error("Kolom Nama tidak ditemukan. Gunakan template atau header Nama / Guest Name.");

  const result: GuestExcelRow[] = [];
  for (const row of nonempty.slice(1)) {
    const cell = (field: Field) => row.cells[fields.get(field) ?? -1];
    if (![...fields.keys()].some((field) => cell(field)?.value.trim() || cell(field)?.kind === "formula")) continue;
    if (result.length >= GUEST_EXCEL_MAX_ROWS) throw new Error("Maksimal 1.000 baris tamu per file. Pisahkan data menjadi beberapa file.");

    const value = (field: Field) => cell(field)?.value.trim() ?? "";
    const phone = value("phone");
    const quota = value("quota");
    const numericQuota = quota ? Number(quota) : 1;
    const validQuota = !quota || (/^\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(quota) && Number.isInteger(numericQuota));
    let error: string | null = null;
    if ([...fields.keys()].some((field) => cell(field)?.kind === "formula")) {
      error = "Rumus tidak didukung. Salin hasilnya sebagai nilai atau teks sebelum mengimpor.";
    } else if ([...fields.keys()].some((field) => cell(field)?.kind === "invalid")) {
      error = "Ada sel yang berisi nilai error atau tipe data yang tidak didukung.";
    } else if (phone && /[eE][+-]?\d+/.test(phone)) {
      error = "Nomor WhatsApp memakai notasi ilmiah. Ubah sel menjadi Teks lalu masukkan ulang nomor lengkap.";
    } else if (phone && cell("phone")?.kind === "number" && (!/^\d+$/.test(phone) || phone.length > 15)) {
      error = "Nomor WhatsApp numerik tidak utuh atau melewati presisi Excel. Masukkan ulang nomor dengan format Teks.";
    } else if (phone.startsWith("8") && cell("phone")?.kind === "number") {
      error = "Nomor WhatsApp numerik berawalan 8 mungkin kehilangan angka 0. Periksa nomor asli, lalu isi sebagai Teks (08..., +62..., atau kode negara yang benar).";
    } else if (!validQuota) {
      error = "Kuota harus berupa bilangan bulat.";
    }
    result.push({
      rowNumber: row.rowNumber,
      guest: {
        name: value("name"),
        phone,
        category: value("category") || "Lainnya",
        quota: validQuota ? numericQuota : 1,
        notes: value("notes"),
      },
      error,
    });
  }
  return result;
}

function elements(parent: Document | Element, name: string): Element[] {
  return Array.from(parent.getElementsByTagNameNS("*", name));
}

function parseXml(xml: string, path: string): Document {
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error("XML Excel berisi deklarasi yang tidak didukung. Simpan ulang sebagai .xlsx standar.");
  if (typeof DOMParser === "undefined") throw new Error("Pembacaan Excel harus dijalankan di browser.");
  const document = new DOMParser().parseFromString(xml, "application/xml");
  if (elements(document, "parsererror").length) throw new Error(`XML Excel rusak (${path}). Simpan ulang file di Excel lalu coba lagi.`);
  return document;
}

async function readXml(zip: JSZip, path: string, budget: { used: number }): Promise<Document> {
  const entry = zip.file(path);
  if (!entry) throw new Error(`Struktur Excel tidak lengkap (${path}). Gunakan file .xlsx standar.`);
  const chunks: Uint8Array[] = [];
  let size = 0;
  await new Promise<void>((resolve, reject) => {
    // JSZip exposes this stream at runtime but omits it from JSZipObject's types.
    const stream = (entry as unknown as {
      internalStream: (type: "uint8array") => {
        on(event: "data", callback: (chunk: Uint8Array) => void): void;
        on(event: "error", callback: (error: Error) => void): void;
        on(event: "end", callback: () => void): void;
        pause(): void;
        resume(): void;
      };
    }).internalStream("uint8array");
    stream.on("data", (chunk) => {
      size += chunk.length;
      budget.used += chunk.length;
      if (size > MAX_XML_ENTRY_BYTES || budget.used > MAX_XML_TOTAL_BYTES) {
        stream.pause();
        reject(new Error("Ukuran XML Excel terlalu besar. Maksimal 4 MB per bagian dan 8 MB total XML."));
        return;
      }
      chunks.push(chunk);
    });
    stream.on("error", reject);
    stream.on("end", resolve);
    stream.resume();
  });
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  const encoding = bytes[0] === 0xff && bytes[1] === 0xfe ? "utf-16le" : bytes[0] === 0xfe && bytes[1] === 0xff ? "utf-16be" : "utf-8";
  let xml: string;
  try {
    xml = new TextDecoder(encoding, { fatal: true }).decode(bytes);
  } catch {
    throw new Error(`Teks XML Excel tidak dapat dibaca (${path}). Simpan ulang file sebagai .xlsx.`);
  }
  return parseXml(xml, path);
}

function relationshipPath(target: string): string {
  if (!target || /[?#\\]/.test(target) || /^[a-z][a-z0-9+.-]*:/i.test(target)) throw new Error("Lokasi sheet Excel tidak didukung.");
  const parts: string[] = [];
  for (const part of (target.startsWith("/") ? target.slice(1) : `xl/${target}`).split("/")) {
    if (part === "..") {
      if (!parts.length) throw new Error("Lokasi sheet Excel tidak valid.");
      parts.pop();
    } else if (part && part !== ".") parts.push(part);
  }
  const path = parts.join("/");
  if (!path.startsWith("xl/") || !path.endsWith(".xml")) throw new Error("Lokasi sheet Excel tidak didukung.");
  return path;
}

function columnIndex(reference: string): number {
  const match = /^([A-Z]{1,3})[1-9]\d*$/i.exec(reference);
  if (!match) throw new Error("Alamat sel Excel tidak valid. Simpan ulang file lalu coba lagi.");
  let index = 0;
  for (const letter of match[1].toUpperCase()) index = index * 26 + letter.charCodeAt(0) - 64;
  if (index > 16384) throw new Error("Kolom Excel melewati batas yang didukung.");
  return index - 1;
}

function stringValue(element: Element): string {
  return elements(element, "t").filter((node) => node.parentElement?.localName !== "rPh").map((node) => node.textContent ?? "").join("");
}

function sheetRows(document: Document, sharedStrings: string[]): GuestExcelSheetRow[] {
  const data = elements(document, "sheetData")[0];
  if (!data) throw new Error("Sheet Excel tidak memiliki data tamu.");
  const rows = Array.from(data.children).filter((node) => node.localName === "row");
  if (rows.length > 10002) throw new Error("Sheet berisi terlalu banyak baris kosong atau format. Salin maksimal 1.000 tamu ke template baru.");
  let totalCells = 0;
  let nextRowNumber = 1;
  const seenRows = new Set<number>();
  return rows.map((row) => {
    const rowNumber = Number(row.getAttribute("r") || nextRowNumber);
    if (!Number.isInteger(rowNumber) || rowNumber < 1 || rowNumber > 1048576 || seenRows.has(rowNumber)) throw new Error("Nomor baris Excel tidak valid atau berulang.");
    seenRows.add(rowNumber);
    nextRowNumber = rowNumber + 1;
    const cells: Record<number, GuestExcelCell> = {};
    const cellElements = Array.from(row.children).filter((node) => node.localName === "c");
    totalCells += cellElements.length;
    if (totalCells > MAX_SHEET_CELLS) throw new Error("Sheet berisi terlalu banyak sel. Sisakan lima kolom data tamu lalu coba lagi.");
    let nextColumn = 0;
    cellElements.forEach((element) => {
      const reference = element.getAttribute("r");
      const column = reference ? columnIndex(reference) : nextColumn;
      nextColumn = column + 1;
      if (reference && Number(reference.replace(/^[A-Z]+/i, "")) !== rowNumber) throw new Error(`Alamat sel pada baris ${rowNumber} tidak konsisten.`);
      if (cells[column]) throw new Error(`Alamat sel berulang pada baris ${rowNumber}.`);
      const type = element.getAttribute("t");
      const raw = elements(element, "v")[0]?.textContent ?? "";
      let value = raw;
      let kind: GuestExcelCell["kind"] = "text";
      if (type === "s") {
        const stringIndex = Number(raw);
        if (!/^\d+$/.test(raw) || !Number.isInteger(stringIndex) || sharedStrings[stringIndex] === undefined) throw new Error(`Teks Excel pada baris ${rowNumber} tidak ditemukan.`);
        value = sharedStrings[stringIndex];
      } else if (type === "inlineStr") value = stringValue(element);
      else if (!type || type === "n") kind = raw ? "number" : "text";
      else if (type !== "str") kind = "invalid";
      if (elements(element, "f").length) kind = "formula";
      if (value.length > 10000) throw new Error(`Isi sel pada baris ${rowNumber} terlalu panjang. Nama maksimal 200 karakter dan catatan maksimal 1.000 karakter.`);
      cells[column] = { value, kind };
    });
    return { rowNumber, cells };
  });
}

function checkArchiveDirectory(bytes: ArrayBuffer): void {
  const view = new DataView(bytes);
  const start = Math.max(0, bytes.byteLength - 65557);
  for (let offset = bytes.byteLength - 22; offset >= start; offset -= 1) {
    if (view.getUint32(offset, true) !== 0x06054b50 || offset + 22 + view.getUint16(offset + 20, true) !== bytes.byteLength) continue;
    const count = view.getUint16(offset + 10, true);
    if (count > MAX_ARCHIVE_ENTRIES) throw new Error("File Excel memiliki terlalu banyak bagian. Salin data tamu ke template baru.");
    return;
  }
}

export async function parseGuestExcelFile(file: Pick<File, "name" | "size" | "arrayBuffer">): Promise<GuestExcelRow[]> {
  if (!/\.xlsx$/i.test(file.name)) throw new Error("Gunakan file Excel .xlsx. File .xls dan .csv perlu disimpan ulang sebagai .xlsx.");
  if (file.size > GUEST_EXCEL_MAX_FILE_BYTES) throw new Error("Ukuran file maksimal 5 MB.");
  const bytes = await file.arrayBuffer();
  if (bytes.byteLength > GUEST_EXCEL_MAX_FILE_BYTES) throw new Error("Ukuran file maksimal 5 MB.");
  checkArchiveDirectory(bytes);
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(bytes);
  } catch {
    throw new Error("File Excel rusak, terenkripsi, atau bukan .xlsx standar. Buka dan simpan ulang tanpa kata sandi.");
  }
  const entries = Object.values(zip.files);
  if (entries.length > MAX_ARCHIVE_ENTRIES) throw new Error("File Excel memiliki terlalu banyak bagian. Salin data tamu ke template baru.");
  // Check the directory first; readXml also caps the actual inflated stream.
  let declaredXmlBytes = 0;
  for (const entry of entries) {
    if (entry.dir || !/\.xml$/i.test(entry.name)) continue;
    const declared = (entry as unknown as { _data?: { uncompressedSize?: number } })._data?.uncompressedSize ?? 0;
    declaredXmlBytes += declared;
    if (declared > MAX_XML_ENTRY_BYTES || declaredXmlBytes > MAX_XML_TOTAL_BYTES) throw new Error("Ukuran XML Excel terlalu besar. Gunakan template baru dengan maksimal 1.000 tamu.");
  }
  const budget = { used: 0 };
  const workbook = await readXml(zip, "xl/workbook.xml", budget);
  const relationships = await readXml(zip, "xl/_rels/workbook.xml.rels", budget);
  const sheets = elements(workbook, "sheet");
  const sheet = sheets.find((item) => /^(data\s*)?tamu$/i.test(item.getAttribute("name")?.trim() ?? "")) ?? sheets.find((item) => item.getAttribute("state") !== "hidden" && item.getAttribute("state") !== "veryHidden") ?? sheets[0];
  if (!sheet) throw new Error("Tidak ada sheet pada file Excel.");
  const id = sheet.getAttribute("r:id") ?? sheet.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id");
  const relationship = elements(relationships, "Relationship").find((item) => item.getAttribute("Id") === id);
  if (!relationship || relationship.getAttribute("TargetMode") === "External" || !/\/worksheet$/.test(relationship.getAttribute("Type") ?? "")) throw new Error("Sheet Excel tidak didukung. Gunakan sheet tabel biasa pada template.");
  const path = relationshipPath(relationship.getAttribute("Target") ?? "");
  const sharedStrings = zip.file("xl/sharedStrings.xml") ? elements(await readXml(zip, "xl/sharedStrings.xml", budget), "si").map(stringValue) : [];
  return parseGuestExcelRows(sheetRows(await readXml(zip, path, budget), sharedStrings));
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function inlineCell(reference: string, value: string, style = 0): string {
  return `<c r="${reference}" t="inlineStr" s="${style}"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
}

export async function createGuestExcelTemplate(): Promise<Blob> {
  const zip = new JSZip();
  const xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  const ns = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
  zip.file("[Content_Types].xml", `${xml}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`);
  zip.file("_rels/.rels", `${xml}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`);
  zip.file("xl/workbook.xml", `${xml}<workbook xmlns="${ns}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView/></bookViews><sheets><sheet name="Tamu" sheetId="1" r:id="rId1"/><sheet name="Petunjuk" sheetId="2" r:id="rId2"/></sheets></workbook>`);
  zip.file("xl/_rels/workbook.xml.rels", `${xml}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`);
  zip.file("xl/styles.xml", `${xml}<styleSheet xmlns="${ns}"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="49" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`);
  const names = ["Nama", "WhatsApp", "Kategori", "Kuota", "Catatan"];
  const letters = ["A", "B", "C", "D", "E"];
  zip.file("xl/worksheets/sheet1.xml", `${xml}<worksheet xmlns="${ns}"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="1" width="32" customWidth="1"/><col min="2" max="2" width="24" style="2" customWidth="1"/><col min="3" max="3" width="22" customWidth="1"/><col min="4" max="4" width="12" customWidth="1"/><col min="5" max="5" width="48" customWidth="1"/></cols><sheetData><row r="1">${names.map((name, index) => inlineCell(`${letters[index]}1`, name, 1)).join("")}</row><row r="2">${letters.map((letter) => inlineCell(`${letter}2`, "", letter === "B" ? 2 : 0)).join("")}</row></sheetData><autoFilter ref="A1:E1"/></worksheet>`);
  const instructions = [
    "Petunjuk impor daftar tamu",
    "Isi sheet Tamu mulai baris 2. Pertahankan header Nama, WhatsApp, Kategori, Kuota, Catatan.",
    "Nama wajib diisi. WhatsApp boleh kosong untuk tamu tanpa nomor.",
    "Kolom WhatsApp sudah berformat Teks. Pertahankan format ini agar angka 0 di awal tidak hilang.",
    "Jika nomor pernah berubah menjadi notasi ilmiah, masukkan ulang nomor lengkap dari sumber aslinya.",
    "Kategori dapat diisi Keluarga, Sahabat, Rekan Kerja, VIP, Lainnya, atau kategori sendiri. Kosong berarti Lainnya.",
    "Kuota harus bilangan bulat 1 sampai 20. Kosong berarti 1.",
    "Maksimal 1.000 tamu dan ukuran file 5 MB. Simpan sebagai Excel Workbook (.xlsx).",
    "Rumus tidak didukung. Tempel sebagai nilai atau teks sebelum mengimpor.",
    "Duplikat diperiksa dari gabungan nama dan nomor WhatsApp. Tinjau pratinjau sebelum menyimpan.",
  ];
  zip.file("xl/worksheets/sheet2.xml", `${xml}<worksheet xmlns="${ns}"><cols><col min="1" max="1" width="120" customWidth="1"/></cols><sheetData>${instructions.map((text, index) => `<row r="${index + 1}">${inlineCell(`A${index + 1}`, text, index === 0 ? 1 : 0)}</row>`).join("")}</sheetData></worksheet>`);
  const bytes = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
  return new Blob([new Uint8Array(bytes).buffer], { type: XLSX_MIME });
}
