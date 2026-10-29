"use client";

import React, { useEffect, useState } from "react";
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
  const [scene, setScene] = useState({ templateId, opened: false });
  if (scene.templateId !== templateId) setScene({ templateId, opened: false });
  const templateProps = { ...props, onOpenChange: (open: boolean) => {
    setScene({ templateId, opened: open });
    props.onOpenChange?.(open);
  } };
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
        return <CraftBookTemplate {...templateProps} />;
      case "paper-keepsake":
        return <PaperKeepsakeTemplate {...templateProps} />;
      case "ambient-blur":
        return <AmbientBlurTemplate {...templateProps} />;
      case "painted-cats":
        return <PaintedCatsTemplate {...templateProps} />;
      case "cinematic-blur":
        return <CinematicBlurTemplate {...templateProps} />;
      case "royal-heritage":
        return <RoyalHeritageTemplate {...templateProps} />;
      case "cityscape-skyline":
        return <CityscapeTemplate {...templateProps} />;
      case "paper-art-maroon":
      default:
        return <PaperArtTemplate {...templateProps} />;
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
          <InvitationMotion disabled={Boolean(templateId === "paper-keepsake" || (!props.isEditor && !(scene.templateId === templateId && scene.opened)))}>{content}</InvitationMotion>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default TemplateRenderer;
