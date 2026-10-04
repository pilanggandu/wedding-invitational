"use client";

import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties } from "react";
import { ScrapbookDecorations } from "./ScrapbookStickers";
import styles from "./scrapbook.module.css";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const PAPER_COLORS = ["#f9e8bf", "#b2d4c5", "#edc2d0", "#d6c5e2", "#f8d0b5", "#e9ecd8"];
const INK_COLORS = ["#5e8c83", "#9c5873", "#927343", "#826897", "#b36a50", "#557c78"];

function CutoutLetters({ text, offset = 0 }: { text: string; offset?: number }) {
  return <>{Array.from(text).map((letter, index) => {
    const n = index + offset;
    return <span key={index} className={letter === " " ? styles.letterSpace : styles.letter} style={{
      backgroundColor: PAPER_COLORS[n % PAPER_COLORS.length],
      color: INK_COLORS[n % INK_COLORS.length],
      transform: `rotate(${[-7, 3, -3, 6, -4, 2][n % 6]}deg) translateY(${[0, 2, -1, 1][n % 4]}%)`,
      fontFamily: n % 3 === 0 ? "Georgia, serif" : n % 3 === 1 ? "var(--font-playfair), Georgia, serif" : "var(--font-jakarta), sans-serif",
    }}>{letter}</span>;
  })}</>;
}

function PhotoFrame({ position, caption, number }: { position: string; caption: string; number: number }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrl = useRef<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => () => { if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); }, []);

  const choosePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
      setError("Pilih foto JPG, PNG, WebP, atau AVIF.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("Ukuran foto maksimal 15 MB.");
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    const probe = new Image();
    probe.onload = () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = nextUrl;
      setPhoto(nextUrl);
      setError("");
    };
    probe.onerror = () => {
      URL.revokeObjectURL(nextUrl);
      setError("Foto tidak bisa dibuka. Coba file lain.");
    };
    probe.src = nextUrl;
  };

  return <div className={`${styles.photoFrame} ${position}`}>
    <span className={`${styles.tape} ${styles.photoTape}`} aria-hidden="true" />
    <button type="button" className={styles.photoButton} onClick={() => inputRef.current?.click()} aria-label={`${photo ? "Ganti" : "Tambah"} foto ${number}`}>
      {photo && <img src={photo} alt={`Kenangan ${number}: ${caption}`} className={styles.photo} />}
      <span className={`${styles.photoHint} ${photo ? styles.hasPhoto : ""}`}>
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M5 10h6l2-4h7l2 4h5v16H5Z" /><circle cx="16" cy="18" r="5" /><path d="M23 13h1" /></svg>
        <span>{photo ? "ganti foto" : "taruh foto di sini"}</span>
      </span>
    </button>
    <span className={styles.photoCaption}>{caption}</span>
    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={choosePhoto} className={styles.fileInput} aria-label={`Pilih foto ${number}`} tabIndex={-1} />
    {error && <span className={styles.photoError} role="alert">{error}</span>}
  </div>;
}

function Calendar({ date }: { date: string }) {
  const [year, month, day] = (date || "2026-06-01").split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const totalDays = new Date(year, month, 0).getDate();
  const cells = Array.from({ length: Math.ceil((firstDay + totalDays) / 7) * 7 }, (_, i) => {
    const value = i - firstDay + 1;
    return value > 0 && value <= totalDays ? value : null;
  });

  return <section className={styles.calendar} aria-label={`Kalender ${MONTHS[month - 1]} ${year}`}>
    <div className={styles.calendarInner}>
      <h2>{MONTHS[month - 1]} {year}</h2>
      <table>
        <thead><tr>{["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((label) => <th key={label} scope="col">{label}</th>)}</tr></thead>
        <tbody>{Array.from({ length: cells.length / 7 }, (_, row) => <tr key={row}>{cells.slice(row * 7, row * 7 + 7).map((value, col) => <td key={col}><span className={date && value === day ? styles.birthdayDate : undefined} aria-label={date && value === day ? `${value}, hari ulang tahun` : undefined}>{value}</span></td>)}</tr>)}</tbody>
      </table>
    </div>
  </section>;
}

export function BirthdayScrapbook() {
  const [name, setName] = useState("Bestie");
  const [birthday, setBirthday] = useState("");
  const [captions, setCaptions] = useState(["our happy little moments", "you, me & all the memories", "more adventures with you"]);
  const [draftName, setDraftName] = useState(name);
  const [draftBirthday, setDraftBirthday] = useState(birthday);
  const [draftCaptions, setDraftCaptions] = useState(captions);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [year, month] = (birthday || "2026-06-01").split("-").map(Number);
  const displayName = name.trim() || "Bestie";

  function openEditor() {
    setDraftName(name);
    setDraftBirthday(birthday);
    setDraftCaptions([...captions]);
    dialogRef.current?.showModal();
  }

  return <div className={styles.workspace}>
    <header className={styles.toolbar}>
      <div className={styles.brand}>
        <svg viewBox="0 0 34 38" fill="none" aria-hidden="true"><path d="m8 4 21 2-2 29-22-2Z" fill="#bad3c2" stroke="#587365" /><path d="m10 9 15 1-1 17-16-1Z" fill="#fff8e8" /><path d="M15 15c-5-5-8 3 2 8 11-5 7-13 2-8l-2 2Z" fill="#d697a5" /><path d="M3 9h6M2 16h6M2 23h5M1 30h6" stroke="#786c5e" strokeWidth="2" /></svg>
        <div><span className={styles.brandName}>little keepsakes</span><span className={styles.brandSub}>birthday scrapbook</span></div>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.editButton} onClick={openEditor}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="m4 13 9-9 3 3-9 9-4 1Zm7-7 3 3M12 17h5" /></svg>
          Ubah isi
        </button>
        <button type="button" className={styles.printButton} onClick={() => window.print()}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M10 2v11m-4-4 4 4 4-4M3 13v4h14v-4" /></svg>
          Simpan PDF
        </button>
      </div>
    </header>

    <main className={styles.main}>
      <p className={styles.intro}>a little paper, a lot of love <span aria-hidden="true">♡</span></p>
      <div className={styles.scrapbookWrap}>
        <article className={styles.scrapbook} aria-label={`Scrapbook ulang tahun untuk ${displayName}`}>
          <div className={styles.paperLayers} aria-hidden="true">
            <span className={styles.peachPaper} /><span className={styles.lilacPaper} /><span className={styles.notebookPaper} /><span className={styles.topNote} /><span className={styles.leftTear} /><span className={styles.bottomTear} />
          </div>

          <h1 className={styles.title} aria-label={`Happy Birthday ${displayName}`}>
            <span className={styles.birthdayHeading} aria-hidden="true"><CutoutLetters text="HaPpY" /><span className={styles.wordSpace} /><CutoutLetters text="BiRThDaY" offset={3} /></span>
            <span className={styles.nameHeading} style={{ "--name-size": `${Math.min(11.8, 76 / Math.max(displayName.length, 1))}cqw` } as CSSProperties} aria-hidden="true"><CutoutLetters text={displayName} offset={2} /></span>
          </h1>
          <p className={styles.dateLabel}>{MONTHS[month - 1]} {year}</p>

          <ScrapbookDecorations />

          <span className={`${styles.note} ${styles.foreverNote}`}>Forever<br />friends</span>
          <span className={`${styles.note} ${styles.laughNote}`}>Laughs<br />& love</span>
          <span className={`${styles.note} ${styles.familyNote}`}>Friends<br />become<br />our chosen<br />family</span>
          <span className={`${styles.note} ${styles.adventureNote}`}>Better<br />adventures</span>
          <span className={`${styles.note} ${styles.roadNote}`}>Road trip<br />memories</span>
          <span className={`${styles.note} ${styles.beachNote}`}>Beach days</span>
          <span className={`${styles.note} ${styles.chosenNote}`}>Friends become<br />our chosen family</span>
          <span className={`${styles.note} ${styles.memoryNote}`}>Friendship<br />& a million<br />little things</span>
          <span className={`${styles.note} ${styles.littleNote}`}>sunny days</span>

          <PhotoFrame position={styles.photoTop} caption={captions[0]} number={1} />
          <PhotoFrame position={styles.photoLeft} caption={captions[1]} number={2} />
          <PhotoFrame position={styles.photoRight} caption={captions[2]} number={3} />

          <Calendar date={birthday} />
          <p className={styles.pageSignoff}>with love, always.</p>
        </article>
      </div>
      <p className={styles.helpText}>Klik bingkai untuk menambahkan foto. <span>Satu halaman, sejuta cerita.</span></p>
      <p className={styles.sessionNote}>Foto tetap di perangkatmu. Simpan ke PDF sebelum menutup halaman.</p>
    </main>

    <dialog ref={dialogRef} className={styles.editor} onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
      <form onSubmit={(event) => {
        event.preventDefault();
        setName(draftName.trim() || "Bestie");
        setBirthday(draftBirthday);
        setCaptions(draftCaptions.map((caption) => caption.trim()));
        dialogRef.current?.close();
      }}>
        <div className={styles.editorHeading}><div><p>make it yours</p><h2>Untuk siapa hari istimewa ini?</h2></div><button type="button" aria-label="Tutup editor" onClick={() => dialogRef.current?.close()}>×</button></div>
        <label>Nama panggilan<input name="name" autoFocus maxLength={14} value={draftName} onChange={(event) => setDraftName(event.target.value)} placeholder="Bestie" /></label>
        <label>Tanggal ulang tahun<input name="birthday" type="date" min="1900-01-01" max="2100-12-31" value={draftBirthday} onChange={(event) => setDraftBirthday(event.target.value)} /><span>Kosongkan untuk memakai kalender Juni 2026 seperti referensi.</span></label>
        <fieldset><legend>Catatan di bawah foto</legend>{draftCaptions.map((caption, index) => <label key={index}>Foto {index + 1}<input maxLength={40} value={caption} onChange={(event) => setDraftCaptions((current) => current.map((item, i) => i === index ? event.target.value : item))} /></label>)}</fieldset>
        <button type="submit" className={styles.saveButton}>Pasang di scrapbook</button>
      </form>
    </dialog>
  </div>;
}
