"use client";

import React from "react";

export function SketchbookSpiralBinding({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full flex items-center justify-around px-4 py-2 bg-[#EADCC9] border-b border-[#D8C6B0] select-none ${className}`}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-2.5 h-6 rounded-full bg-gradient-to-r from-[#8C7A68] via-[#F5EFE6] to-[#6A5A4A] shadow-xs border border-[#5A4A3A]/40 -my-1 transform rotate-[-8deg]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#3D2F22]/70 -mt-0.5" />
        </div>
      ))}
    </div>
  );
}

export function BrassPaperclip({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none drop-shadow-md ${className}`}
    >
      <path
        d="M 16 6 L 16 46 A 8 8 0 0 0 32 46 L 32 18 A 6 6 0 0 0 20 18 L 20 48 A 4 4 0 0 0 28 48 L 28 24"
        stroke="#C5A059"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 16 6 L 16 46 A 8 8 0 0 0 32 46 L 32 18 A 6 6 0 0 0 20 18 L 20 48 A 4 4 0 0 0 28 48 L 28 24"
        stroke="#FFF2D6"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
}

export function BotanicalBranchSvg({
  className = "w-16 h-8",
  color = "#7D1128",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none ${className}`}
    >
      <path
        d="M 10 20 Q 60 12 110 22"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M 28 18 Q 32 8 40 12 Q 34 20 28 18 Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M 46 17 Q 52 26 60 22 Q 54 15 46 17 Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M 64 16 Q 70 6 78 10 Q 72 18 64 16 Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M 82 18 Q 88 27 96 23 Q 90 16 82 18 Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M 98 19 Q 106 12 112 18 Q 106 23 98 19 Z"
        fill={color}
        opacity="0.85"
      />
    </svg>
  );
}

export function BotanicalWreathSvg({
  className = "w-24 h-24",
  color = "#7D1128",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none ${className}`}
    >
      <path
        d="M 50 12 C 26 12 14 32 14 52 C 14 74 30 88 50 88"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M 50 12 C 74 12 86 32 86 52 C 86 74 70 88 50 88"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M 20 32 Q 12 28 16 22 Q 22 24 20 32 Z" fill={color} opacity="0.85" />
      <path d="M 14 50 Q 6 52 8 44 Q 16 46 14 50 Z" fill={color} opacity="0.85" />
      <path d="M 22 68 Q 16 74 22 80 Q 26 72 22 68 Z" fill={color} opacity="0.85" />
      <path d="M 80 32 Q 88 28 84 22 Q 78 24 80 32 Z" fill={color} opacity="0.85" />
      <path d="M 86 50 Q 94 52 92 44 Q 84 46 86 50 Z" fill={color} opacity="0.85" />
      <path d="M 78 68 Q 84 74 78 80 Q 74 72 78 68 Z" fill={color} opacity="0.85" />
      <circle cx="50" cy="88" r="3" fill={color} />
    </svg>
  );
}

export function CrayonUnderlineSvg({
  className = "w-32 h-3",
  color = "#7D1128",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none ${className}`}
    >
      <path
        d="M 4 7 Q 40 2 80 7 T 156 5"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}
