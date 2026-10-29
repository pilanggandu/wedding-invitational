"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TemplateProps } from "./types";
import { InvitationMotion } from "./InvitationMotion";
import { PaperArtTemplate } from "./paper-art/PaperArtTemplate";
import { CityscapeTemplate } from "./cityscape/CityscapeTemplate";
import { RoyalHeritageTemplate } from "./royal-heritage/RoyalHeritageTemplate";
import { CinematicBlurTemplate } from "./cinematic-blur/CinematicBlurTemplate";
import { PaintedCatsTemplate } from "./painted-cats/PaintedCatsTemplate";
import { AmbientBlurTemplate } from "./ambient-blur/AmbientBlurTemplate";
import { PaperKeepsakeTemplate } from "./paper-keepsake/PaperKeepsakeTemplate";
import { CraftBookTemplate } from "./craft-book/CraftBookTemplate";
import { getFontFamilyCss } from "@/lib/typography";
import {
  getTemplateScrollbarVars,
  normalizeTemplateThemeId as normalizeTemplateId,
} from "@/lib/templateTheme";

export { normalizeTemplateId };

export function TemplateRenderer(props: TemplateProps) {
  const { data } = props;
  const templateId = normalizeTemplateId(data.activeTemplateId);
  const fontFamilyCss = getFontFamilyCss(data.themePalette?.fontStyle);
  const scrollbarVars = getTemplateScrollbarVars(templateId);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (fontFamilyCss) {
        document.documentElement.style.setProperty(
          "--font-couple-custom",
          fontFamilyCss
        );
      }
      document.documentElement.setAttribute("data-template-theme", templateId);
    }
  }, [fontFamilyCss, templateId]);

  const content = (() => {
    switch (templateId) {
      case "craft-book":
        return <CraftBookTemplate {...props} />;
      case "paper-keepsake":
        return <PaperKeepsakeTemplate {...props} />;
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
      data-template-theme={templateId}
      style={
        {
          "--font-couple-custom": fontFamilyCss,
          ...scrollbarVars,
        } as React.CSSProperties
      }
      className="contents"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={templateId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="contents"
        >
          <InvitationMotion disabled={Boolean(props.isEditor || props.isPreview || templateId === "paper-keepsake")}>{content}</InvitationMotion>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default TemplateRenderer;
