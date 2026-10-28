import React from "react";

export interface TemplateScrollbarTheme {
  id: string;
  name: string;
  thumb: string;
  thumbHover: string;
  thumbBorder: string;
  track: string;
  accent: string;
}

export const TEMPLATE_THEMES: Record<string, TemplateScrollbarTheme> = {
  "craft-book": {
    id: "craft-book",
    name: "Craft Scrapbook (Book View)",
    thumb: "#C26D53",
    thumbHover: "#8C3B24",
    thumbBorder: "#FAF7F2",
    track: "#DFD7CC",
    accent: "#C26D53",
  },
  "paper-keepsake": {
    id: "paper-keepsake",
    name: "Paper Keepsake (Mahogany)",
    thumb: "#541E24",
    thumbHover: "#3E1217",
    thumbBorder: "#FBF8F1",
    track: "#F3EBDD",
    accent: "#541E24",
  },
  "paper-art-maroon": {
    id: "paper-art-maroon",
    name: "2D Paper Art Craft (Maroon)",
    thumb: "#7D1128",
    thumbHover: "#540914",
    thumbBorder: "#FFE58F",
    track: "#FFF5F6",
    accent: "#7D1128",
  },
  "painted-cats": {
    id: "painted-cats",
    name: "Purrfect Romance (Cute Cats)",
    thumb: "#D97736",
    thumbHover: "#C2633C",
    thumbBorder: "#FFF0E8",
    track: "#FAF6EE",
    accent: "#D97736",
  },
  "cityscape-skyline": {
    id: "cityscape-skyline",
    name: "Cityscape Urban Romance",
    thumb: "#1D78A0",
    thumbHover: "#0C4A60",
    thumbBorder: "#38B6FF",
    track: "#0B1E2E",
    accent: "#2E8BC0",
  },
  "royal-heritage": {
    id: "royal-heritage",
    name: "Royal Heritage (Emerald & Gold)",
    thumb: "#C8A97E",
    thumbHover: "#DFC49C",
    thumbBorder: "#071913",
    track: "#09221B",
    accent: "#C8A97E",
  },
  "cinematic-blur": {
    id: "cinematic-blur",
    name: "Ethereal Dreamscape (Cinematic)",
    thumb: "#DFD2BD",
    thumbHover: "#FAF8F5",
    thumbBorder: "#1A1D26",
    track: "#090B10",
    accent: "#DFD2BD",
  },
  "ambient-blur": {
    id: "ambient-blur",
    name: "Ambient Chroma",
    thumb: "#E07A5F",
    thumbHover: "#F4A261",
    thumbBorder: "rgba(255, 255, 255, 0.6)",
    track: "#F8FAFC",
    accent: "#E07A5F",
  },
};

export function normalizeTemplateThemeId(id?: string): string {
  if (!id) return "paper-art-maroon";
  const clean = id.toLowerCase().trim().replace(/_/g, "-");

  if (clean.includes("craft") || clean.includes("book")) return "craft-book";
  if (clean.includes("keepsake")) return "paper-keepsake";
  if (clean.includes("cat") || clean.includes("kucing")) return "painted-cats";
  if (clean.includes("city") || clean.includes("skyline")) return "cityscape-skyline";
  if (clean.includes("royal") || clean.includes("heritage")) return "royal-heritage";
  if (clean.includes("cinematic") || clean.includes("film") || clean.includes("cinema")) return "cinematic-blur";
  if (clean.includes("ambient") || clean.includes("chroma")) return "ambient-blur";
  if (clean.includes("paper") || clean.includes("maroon") || clean.includes("sketchbook")) return "paper-art-maroon";

  return clean;
}

export function getTemplateScrollbarVars(templateId?: string): React.CSSProperties {
  const normalized = normalizeTemplateThemeId(templateId);
  const theme = TEMPLATE_THEMES[normalized] || TEMPLATE_THEMES["paper-art-maroon"];

  return {
    "--scrollbar-thumb": theme.thumb,
    "--scrollbar-thumb-hover": theme.thumbHover,
    "--scrollbar-thumb-border": theme.thumbBorder,
    "--scrollbar-track": theme.track,
  } as React.CSSProperties;
}
