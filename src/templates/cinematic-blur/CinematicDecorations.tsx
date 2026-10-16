"use client";

import React from "react";

export function FilmClapperIcon({
  className = "w-5 h-5",
  color = "#FFFFFF",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20.2 6 3 11l-.9-2.4c-.3-.8.2-1.8 1.1-2.1l13.1-4.4c.8-.3 1.8.2 2.1 1.1l1.8 4.8Z" />
      <path d="m6.2 5.3 3.1 4" />
      <path d="m12.2 3.3 3.1 4" />
      <path d="m18.2 1.3 3.1 4" />
      <path d="M4 11v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9H4Z" />
    </svg>
  );
}

export function FilmTimecodeBadge({
  scene = "SCENE 01",
  take = "ACT I",
  fps = "24 FPS",
  className = "",
}: {
  scene?: string;
  take?: string;
  fps?: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-mono tracking-widest text-white/90 select-none ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
      <span className="text-white font-semibold">{scene}</span>
      <span className="text-white/40">•</span>
      <span className="text-white/80">{take}</span>
      <span className="text-white/40">•</span>
      <span className="text-white/60">{fps}</span>
    </div>
  );
}

export function ModernHairlineDivider({
  className = "my-6",
}: {
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-3 max-w-xs mx-auto ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </div>
  );
}

export function CameraCropMarks({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`pointer-events-none absolute inset-3 z-10 opacity-40 ${className}`}>
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white" />
    </div>
  );
}
