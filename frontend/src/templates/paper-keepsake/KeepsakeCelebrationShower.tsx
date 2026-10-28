"use client";

import React, { useEffect, useState } from "react";

interface CelebrationShowerProps {
  active: boolean;
  durationMs?: number;
  reduced?: boolean;
}

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  driftX: number;
  rotation: number;
  size: number;
  color: string;
  type: "flake" | "petal" | "spark" | "heart";
}

const COLORS = [
  "#C7887D", // rose petal
  "#E5B869", // warm gold
  "#D4AF37", // metallic gold
  "#FBF8F1", // ivory card
  "#79806B", // sage leaf
  "#DDB0A3", // soft blush
  "#E4D4B8", // kraft paper
];

const STATIC_PARTICLES: Particle[] = Array.from({ length: 22 }, (_, i) => {
  const types: ("flake" | "petal" | "spark" | "heart")[] = [
    "flake",
    "petal",
    "flake",
    "spark",
    "petal",
    "heart",
  ];
  return {
    id: i,
    left: 4 + (i * 92) / 21 + ((i * 17) % 7) - 3,
    delay: (i % 6) * 0.22 + (i > 11 ? 0.9 : 0),
    duration: 3.8 + (i % 4) * 0.7,
    driftX: ((i * 31) % 60) - 30,
    rotation: ((i * 47) % 360) - 180,
    size: 9 + (i % 5) * 3,
    color: COLORS[i % COLORS.length],
    type: types[i % types.length],
  };
});

export function KeepsakeCelebrationShower({
  active,
  durationMs = 6500,
  reduced = false,
}: CelebrationShowerProps) {
  const [visible, setVisible] = useState(active);

  useEffect(() => {
    if (!active || reduced) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [active, durationMs, reduced]);

  if (!visible || reduced) return null;

  return (
    <div
      className="pk-celebration-shower"
      aria-hidden="true"
      role="presentation"
    >
      {STATIC_PARTICLES.map((p) => {
        return (
          <span
            key={p.id}
            className={`pk-shower-item pk-shower-${p.type}`}
            style={
              {
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                "--pk-drift-x": `${p.driftX}px`,
                "--pk-rotation": `${p.rotation}deg`,
                "--pk-size": `${p.size}px`,
                "--pk-color": p.color,
              } as React.CSSProperties
            }
          >
            {p.type === "spark" ? (
              <svg
                viewBox="0 0 24 24"
                width={p.size}
                height={p.size}
                fill="none"
                stroke={p.color}
                strokeWidth="2"
              >
                <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
              </svg>
            ) : p.type === "heart" ? (
              <svg
                viewBox="0 0 24 24"
                width={p.size}
                height={p.size}
                fill={p.color}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <span
                className="pk-shower-shape"
                style={{
                  backgroundColor: p.color,
                  width: `${p.size}px`,
                  height: p.type === "petal" ? `${p.size * 1.5}px` : `${p.size}px`,
                  borderRadius: p.type === "petal" ? "50% 50% 50% 0" : "2px",
                }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}
