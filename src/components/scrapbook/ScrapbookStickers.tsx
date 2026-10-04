import type { CSSProperties } from "react";
import styles from "./scrapbook.module.css";

type StickerKind = "rainbow" | "camera" | "smile" | "heart" | "bow" | "coffee" | "clip" | "gift" | "butterfly" | "rings" | "drink";

export function Sticker({ kind, className = "", style }: { kind: StickerKind; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="#796957" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${styles.sticker} ${className}`} style={style} aria-hidden="true">
      {kind === "rainbow" && <>
        <path d="M12 69V49a38 38 0 0 1 76 0v20H72V49a22 22 0 0 0-44 0v20Z" fill="#f3b7c5" stroke="#fffdf0" strokeWidth="8" />
        <path d="M14 65V49a36 36 0 0 1 72 0v16" stroke="#84746a" strokeWidth="2" />
        <path d="M20 63V49a30 30 0 0 1 60 0v14" stroke="#edb0ba" strokeWidth="7" />
        <path d="M27 63V49a23 23 0 0 1 46 0v14" stroke="#f2d68d" strokeWidth="7" />
        <path d="M34 63V49a16 16 0 0 1 32 0v14" stroke="#a9c9ba" strokeWidth="7" />
        <path d="M9 79C-2 70 5 59 15 62c-2-15 21-17 24-4 14-4 20 17 5 21Z" fill="#fffcf0" />
        <path d="M67 79c-15-3-13-20 0-20 2-15 23-13 23 1 15 0 15 20 3 21Z" fill="#fffcf0" />
      </>}
      {kind === "camera" && <>
        <path d="m9 31 20-2 5-11 26-2 7 10 22-2 6 53-80 8Z" fill="#eac7aa" stroke="#fffdf0" strokeWidth="8" />
        <path d="m9 31 20-2 5-11 26-2 7 10 22-2 6 53-80 8Z" fill="#e9c5a9" />
        <path d="m11 42 79-7 3 31-78 8Z" fill="#b3cbbd" />
        <circle cx="52" cy="52" r="22" fill="#fff6df" />
        <circle cx="52" cy="52" r="15" fill="#8d9585" />
        <circle cx="52" cy="52" r="10" fill="#5d685f" />
        <path d="m44 48 5-4" stroke="#fffbed" strokeWidth="3" />
        <path d="m72 32 10-1 1 7-10 1Z" fill="#fff9e9" />
      </>}
      {kind === "smile" && <>
        <circle cx="50" cy="50" r="39" fill="#f5d883" stroke="#fff8e2" strokeWidth="8" />
        <circle cx="50" cy="50" r="35" fill="#f5d883" />
        <path d="M36 37v10m27-11v10M30 57c8 21 31 25 43-2" strokeWidth="3" />
        <path d="m23 48 4-1m47 0 4 1" stroke="#dc9e89" strokeWidth="5" />
      </>}
      {kind === "heart" && <>
        <path d="M48 86C30 67 6 43 16 23 25 6 45 15 51 28 62 9 86 11 88 32 90 51 68 74 48 86Z" fill="#eaa8ba" stroke="#fff5e9" strokeWidth="7" />
        <path d="M48 83C30 64 10 43 19 25 27 11 45 19 51 32 62 14 82 14 85 33 86 51 66 72 48 83Z" stroke="#bd798f" />
        <path d="M27 26c-7 7-2 18 2 22" stroke="#fbe1de" strokeWidth="4" />
      </>}
      {kind === "bow" && <>
        <path d="M48 48C3 5 1 58 42 56L24 86l24-11 8 13 2-32C99 64 94 3 54 46Z" fill="#afd1bf" stroke="#fffaf0" strokeWidth="7" />
        <path d="M48 48C3 5 1 58 42 56L24 86l24-11 8 13 2-32C99 64 94 3 54 46Z" fill="#afd1bf" />
        <path d="M45 48 23 31m33 18 22-20M44 58 33 75m20-18 1 19" />
        <ellipse cx="50" cy="51" rx="8" ry="9" fill="#f6d68e" />
      </>}
      {kind === "coffee" && <>
        <path d="M12 49h61v5c33-9 35 29-5 26-13 14-45 6-49-7Zm-4 37h81" stroke="#fffaf0" strokeWidth="9" />
        <path d="M72 54c27-8 29 22-5 21m7-15c17-3 16 10-3 10" fill="#ebc7ab" />
        <path d="M13 49h59l-5 24c-4 19-42 18-47 0Z" fill="#f6e8cf" />
        <ellipse cx="43" cy="49" rx="30" ry="8" fill="#bc967c" />
        <path d="M25 86c-35-5-17 10 20 10s54-15 22-10M34 33c-13-9 14-13 2-24m12 26c-9-8 9-12 4-20" />
        <path d="M34 64c3-9 10-3 10 1 9-12 17 1 0 10Z" fill="#dbacb1" stroke="none" />
      </>}
      {kind === "clip" && <>
        <path d="m63 21-36 48c-14 22 6 37 21 17l35-49C101 11 75-8 58 14L22 63c-8 12 4 21 13 10l33-44" stroke="#fff9e9" strokeWidth="10" />
        <path d="m63 21-36 48c-14 22 6 37 21 17l35-49C101 11 75-8 58 14L22 63c-8 12 4 21 13 10l33-44" stroke="#d68eaa" strokeWidth="5" />
      </>}
      {kind === "gift" && <>
        <path d="m18 42 63-5 3 48-62 6Zm-5-11 73-5 2 18-74 6Z" fill="#cebddb" stroke="#fff9ed" strokeWidth="7" />
        <path d="m18 42 63-5 3 48-62 6Z" fill="#cfc1df" />
        <path d="m13 31 73-5 2 18-74 6Z" fill="#e8bbca" />
        <path d="m41 31 15-1 5 58-15 1Z" fill="#f6d989" />
        <path d="M49 28C-4 13 35-12 49 28c31-52 55-9 0 0Z" fill="#f7d990" />
        <path d="m49 28-14-12m14 12 15-14" />
      </>}
      {kind === "butterfly" && <>
        <path d="M50 48C-2-9-7 58 37 63c-32 39 13 42 14 5 8 40 46 25 17-7 50-19 26-65-18-13Z" fill="#d6c1e2" stroke="#fff8e9" strokeWidth="6" />
        <path d="M50 48C-2-9-7 58 37 63c-32 39 13 42 14 5 8 40 46 25 17-7 50-19 26-65-18-13Z" stroke="#ac92b5" />
        <path d="m50 47 3 24m-3-24-9-14m9 14 9-15" />
      </>}
      {kind === "rings" && <>
        <ellipse cx="36" cy="60" rx="26" ry="32" transform="rotate(-25 36 60)" stroke="#fff7e8" strokeWidth="9" />
        <ellipse cx="68" cy="43" rx="26" ry="32" transform="rotate(-25 68 43)" stroke="#fff7e8" strokeWidth="9" />
        <ellipse cx="36" cy="60" rx="26" ry="32" transform="rotate(-25 36 60)" stroke="#9b8b76" strokeWidth="4" strokeDasharray="3 3" />
        <ellipse cx="68" cy="43" rx="26" ry="32" transform="rotate(-25 68 43)" stroke="#9b8b76" strokeWidth="4" strokeDasharray="3 3" />
        <path d="m27 29-8-10m12 8 1-15m-5 17-17-2" stroke="#809987" strokeWidth="4" />
      </>}
      {kind === "drink" && <>
        <path d="m30 37 6 53h38l8-53ZM57 39 65 7h9" stroke="#fff9ea" strokeWidth="8" />
        <path d="m30 37 6 53h38l8-53Z" fill="#efd2da" />
        <path d="m38 53 4 32h26l5-32" fill="#c3d9cd" />
        <path d="m57 39 8-32h9" stroke="#899e9e" strokeWidth="4" />
        <ellipse cx="56" cy="37" rx="26" ry="7" fill="#fff0de" />
        <path d="m43 56 3 23m12-23v23m10-23-2 23" stroke="#fff8e7" />
      </>}
    </svg>
  );
}

const stickers: [StickerKind, number, number, number, number][] = [
  ["smile", 23, 12.7, 7, -12], ["heart", 73, 12.8, 10, 12],
  ["rings", 14, 24, 18, -12], ["rainbow", 68, 25.3, 17, 12],
  ["smile", 27, 31.7, 4.7, 8], ["rainbow", 9, 38.5, 14, -14],
  ["bow", 81, 35.1, 10, 12], ["gift", 78, 39.5, 9, -8],
  ["clip", 88, 39, 8, -5], ["clip", 90, 44, 7, -22],
  ["heart", 64, 43.8, 9, -12], ["camera", 3, 56.9, 8, -20],
  ["coffee", 87, 56.6, 10, 12], ["camera", 88, 62.5, 8.5, 13],
  ["drink", 6, 64.5, 9, -10], ["drink", 3, 69.1, 10, -23],
  ["smile", 15, 71.4, 5.5, 7], ["gift", 39, 69.3, 10, 14],
  ["camera", 55, 70.9, 9, -9], ["butterfly", 78, 74.4, 8, -15],
  ["butterfly", 93, 61.8, 6, 22],
];

const stars = [
  [9, 10, 3.4], [69, 24.2, 4.5], [83, 24.8, 4.5], [88, 23.4, 4],
  [94, 32, 5], [95, 34.6, 4.5], [11, 32.5, 5], [8, 37.5, 3.5],
  [5, 42, 5], [18, 41.8, 3.5], [2, 64.9, 5], [88, 53.8, 4.5],
  [94, 70, 4], [48, 71.9, 5.5], [22, 75.4, 5], [12, 78.6, 4.5],
  [13, 80.9, 5], [90, 66.5, 3], [24, 31, 3], [69, 71.8, 4],
];

export function ScrapbookDecorations() {
  return <div className={styles.decorations} aria-hidden="true">
    {stickers.map(([kind, left, top, width, rotate], index) => <Sticker key={index} kind={kind} style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, transform: `rotate(${rotate}deg)` }} />)}
    {stars.map(([left, top, size], index) => <span key={`star-${index}`} className={styles.star} style={{ left: `${left}%`, top: `${top}%`, width: `${size}%`, background: ["#dbc18a", "#dbb7ce", "#aecbd2", "#e9baaa"][index % 4], transform: `rotate(${index * 23}deg)` }} />)}
    {Array.from({ length: 28 }, (_, index) => <span key={`confetti-${index}`} className={styles.confetti} style={{ left: `${79 + ((index * 7) % 21)}%`, top: `${78 + ((index * 11) % 22)}%`, background: ["#edb9bd", "#a8cfc2", "#f1d19d", "#aec4dc"][index % 4], transform: `rotate(${index * 37}deg)` }} />)}
    <span className={`${styles.miniPolaroid} ${styles.miniTop}`} />
    <span className={`${styles.miniPolaroid} ${styles.miniLeft}`} />
    <span className={`${styles.miniPolaroid} ${styles.miniBottom}`} />
    <span className={`${styles.tape} ${styles.cornerTape}`} />
    <span className={`${styles.tape} ${styles.bottomTape}`} />
    <span className={`${styles.tape} ${styles.rightTape}`} />
  </div>;
}
