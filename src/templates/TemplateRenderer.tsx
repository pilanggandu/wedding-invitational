"use client";

import React from "react";
import { TemplateProps } from "./types";
import { PaperArtTemplate } from "./paper-art/PaperArtTemplate";

export function TemplateRenderer(props: TemplateProps) {
  const { data } = props;
  const templateId = data.activeTemplateId || "paper-art-maroon";

  // When more template layouts are created, switch by templateId
  switch (templateId) {
    case "paper-art-sage":
    case "paper-art-gold":
    case "paper-art-maroon":
    default:
      return <PaperArtTemplate {...props} />;
  }
}

export default TemplateRenderer;
