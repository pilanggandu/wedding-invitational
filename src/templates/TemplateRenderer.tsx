"use client";

import React from "react";
import { TemplateProps } from "./types";
import { PaperArtTemplate } from "./paper-art/PaperArtTemplate";
import { CityscapeTemplate } from "./cityscape/CityscapeTemplate";

export function TemplateRenderer(props: TemplateProps) {
  const { data } = props;
  const templateId = data.activeTemplateId || "paper-art-maroon";

  switch (templateId) {
    case "cityscape-skyline":
      return <CityscapeTemplate {...props} />;
    case "paper-art-sage":
    case "paper-art-gold":
    case "paper-art-maroon":
    default:
      return <PaperArtTemplate {...props} />;
  }
}

export default TemplateRenderer;
