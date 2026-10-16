"use client";

import React, { useEffect } from "react";
import { TemplateProps } from "./types";
import { PaperArtTemplate } from "./paper-art/PaperArtTemplate";
import { CityscapeTemplate } from "./cityscape/CityscapeTemplate";
import { RoyalHeritageTemplate } from "./royal-heritage/RoyalHeritageTemplate";
import { CinematicBlurTemplate } from "./cinematic-blur/CinematicBlurTemplate";
import { PaintedCatsTemplate } from "./painted-cats/PaintedCatsTemplate";
import { AmbientBlurTemplate } from "./ambient-blur/AmbientBlurTemplate";
import { getFontFamilyCss } from "@/lib/typography";

export function TemplateRenderer(props: TemplateProps) {
  const { data } = props;
  const templateId = data.activeTemplateId || "paper-art-maroon";
  const fontFamilyCss = getFontFamilyCss(data.themePalette?.fontStyle);

  useEffect(() => {
    if (typeof document !== "undefined" && fontFamilyCss) {
      document.documentElement.style.setProperty(
        "--font-couple-custom",
        fontFamilyCss
      );
    }
  }, [fontFamilyCss]);

  const content = (() => {
    switch (templateId) {
      case "ambient-blur":
        return <AmbientBlurTemplate {...props} />;
      case "painted-cats":
        return <PaintedCatsTemplate {...props} />;
      case "cinematic-blur":
        return <CinematicBlurTemplate {...props} />;
      case "royal-heritage":
        return <RoyalHeritageTemplate {...props} />;
      case "cityscape-skyline":
        return <CityscapeTemplate {...props} />;
      case "paper-art-maroon":
      default:
        return <PaperArtTemplate {...props} />;
    }
  })();

  return (
    <div
      style={
        {
          "--font-couple-custom": fontFamilyCss,
        } as React.CSSProperties
      }
      className="contents"
    >
      {content}
    </div>
  );
}

export default TemplateRenderer;
