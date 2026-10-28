import type { EventDetail } from "@/types/wedding";

const MONTHS = [
  "januari",
  "februari",
  "maret",
  "april",
  "mei",
  "juni",
  "juli",
  "agustus",
  "september",
  "oktober",
  "november",
  "desember",
];
const ZONE_OFFSETS: Record<string, number> = { WIB: 420, WITA: 480, WIT: 540 };

export interface KeepsakeSchedule {
  start: number;
  end?: number;
}

function validDate(year: number, month: number, day: number): boolean {
  if (year < 1000 || month < 1 || month > 12 || day < 1) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function parseConfiguredDate(value?: string): number | null {
  if (!value) return null;
  const normalized = value
    .trim()
    .replace(
      /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
      "$1-$2-$3T$4:$5:$6Z",
    );
  const match = normalized.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/i,
  );
  if (
    !match ||
    !validDate(Number(match[1]), Number(match[2]), Number(match[3])) ||
    Number(match[4]) > 23 ||
    Number(match[5]) > 59 ||
    Number(match[6] || 0) > 59
  )
    return null;
  const timestamp = Date.parse(normalized);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function parseDisplayDate(
  value: string,
): { year: number; month: number; day: number } | null {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(
      /^(?:senin|selasa|rabu|kamis|jumat|jum'at|sabtu|minggu)\s*,?\s+/,
      "",
    );
  const iso = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const indonesian = normalized.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/);
  const year = Number(iso?.[1] || indonesian?.[3]);
  const month = iso
    ? Number(iso[2])
    : MONTHS.indexOf(indonesian?.[2] || "") + 1;
  const day = Number(iso?.[3] || indonesian?.[1]);
  return validDate(year, month, day) ? { year, month, day } : null;
}

function configuredOffset(value: string): number | null {
  if (!parseConfiguredDate(value)) return null;
  if (/Z$/i.test(value)) return 0;
  const offset = value.match(/([+-])(\d{2}):(\d{2})$/);
  if (!offset) return null;
  return (
    (offset[1] === "+" ? 1 : -1) * (Number(offset[2]) * 60 + Number(offset[3]))
  );
}

export function getKeepsakeSchedule(
  event: EventDetail,
): KeepsakeSchedule | null {
  const configuredStart =
    parseConfiguredDate(event.calendarEvent?.startDate) ??
    parseConfiguredDate(event.dateStr);
  const configuredEnd = parseConfiguredDate(event.calendarEvent?.endDate);
  const displayDate = event.displayDate?.trim() || "";
  const displayTime = event.time?.trim() || "";

  if (!displayDate && !displayTime) {
    return configuredStart === null
      ? null
      : {
          start: configuredStart,
          ...(configuredEnd !== null && configuredEnd > configuredStart
            ? { end: configuredEnd }
            : {}),
        };
  }

  const date = parseDisplayDate(displayDate);
  const time = displayTime.match(
    /^(\d{1,2})[:.](\d{2})\s*(WIB|WITA|WIT)?(?:\s*[-–—]\s*(\d{1,2})[:.](\d{2})\s*(WIB|WITA|WIT)?)?$/i,
  );
  if (!date || !time) return null;
  const startHour = Number(time[1]);
  const startMinute = Number(time[2]);
  const endHour = time[4] === undefined ? null : Number(time[4]);
  const endMinute = Number(time[5] || 0);
  if (
    startHour > 23 ||
    startMinute > 59 ||
    (endHour !== null && (endHour > 23 || endMinute > 59))
  )
    return null;
  const firstZone = time[3]?.toUpperCase();
  const lastZone = time[6]?.toUpperCase();
  if (firstZone && lastZone && firstZone !== lastZone) return null;
  const zone = firstZone || lastZone;
  const offset = zone ? ZONE_OFFSETS[zone] : configuredOffset(event.dateStr);
  if (offset === null) return null;

  const midnight =
    Date.UTC(date.year, date.month - 1, date.day) - offset * 60000;
  const start = midnight + (startHour * 60 + startMinute) * 60000;
  if (endHour !== null) {
    const end = midnight + (endHour * 60 + endMinute) * 60000;
    return end > start ? { start, end } : null;
  }
  return {
    start,
    ...(start === configuredStart &&
    configuredEnd !== null &&
    configuredEnd > start
      ? { end: configuredEnd }
      : {}),
  };
}

function calendarTimestamp(timestamp: number): string {
  return new Date(timestamp)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function escapeCalendarText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldCalendarLine(line: string): string {
  const encoder = new TextEncoder();
  let length = 0;
  let result = "";
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (length + size > 75) {
      result += "\r\n ";
      length = 1;
    }
    result += character;
    length += size;
  }
  return result;
}

export function createKeepsakeCalendar(
  event: EventDetail,
  coupleNames = "",
): string | null {
  const schedule = getKeepsakeSchedule(event);
  if (!schedule) return null;
  const title =
    [event.title.trim(), coupleNames.trim()].filter(Boolean).join(" — ") ||
    "Pernikahan";
  const location = [event.venueName, event.venueAddress]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(", ");
  const description = [
    event.subTitle,
    [event.displayDay, event.displayDate].filter(Boolean).join(", "),
    event.time,
  ]
    .filter(Boolean)
    .join("\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Paper Keepsake//Wedding//ID",
    "BEGIN:VEVENT",
    `UID:${escapeCalendarText(event.id)}-${calendarTimestamp(schedule.start)}@paper-keepsake`,
    `DTSTAMP:${calendarTimestamp(Date.now())}`,
    `DTSTART:${calendarTimestamp(schedule.start)}`,
    ...(schedule.end ? [`DTEND:${calendarTimestamp(schedule.end)}`] : []),
    `SUMMARY:${escapeCalendarText(title)}`,
    `DESCRIPTION:${escapeCalendarText(description)}`,
    `LOCATION:${escapeCalendarText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ]
    .map(foldCalendarLine)
    .join("\r\n");
}
