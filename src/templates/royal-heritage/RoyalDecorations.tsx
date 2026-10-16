import React from "react";

// ----------------------------------------------------------------------
// 1. ROYAL MONOGRAM CREST (Interlocking G & S with Laurel Wreath)
// ----------------------------------------------------------------------
export function RoyalMonogram({
  className = "w-24 h-24",
  color = "#C8A97E",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Fine Arch / Oval Rings */}
      <circle cx="80" cy="80" r="76" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="80" cy="80" r="71" stroke={color} strokeWidth="1.5" />
      <circle cx="80" cy="80" r="66" stroke={color} strokeWidth="0.75" opacity="0.8" />

      {/* Decorative Laurel Wreath Left */}
      <path
        d="M34 94C31 82 34 68 42 56C44 63 41 72 37 78C34 83 34 89 34 94Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M40 108C36 98 38 86 46 76C48 83 45 92 42 98C40 102 40 105 40 108Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M50 120C45 112 46 102 53 94C55 101 52 108 49 113C48 116 49 118 50 120Z"
        fill={color}
        opacity="0.85"
      />

      {/* Decorative Laurel Wreath Right */}
      <path
        d="M126 94C129 82 126 68 118 56C116 63 119 72 123 78C126 83 126 89 126 94Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M120 108C124 98 122 86 114 76C112 83 115 92 118 98C120 102 120 105 120 108Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M110 120C115 112 114 102 107 94C105 101 108 108 111 113C112 116 111 118 110 120Z"
        fill={color}
        opacity="0.85"
      />

      {/* Little Crown / Top Crest Accent */}
      <path
        d="M80 24L83 31L90 28L87 36H73L70 28L77 31L80 24Z"
        fill={color}
      />
      <circle cx="80" cy="22" r="1.5" fill={color} />
      <circle cx="70" cy="26" r="1.2" fill={color} />
      <circle cx="90" cy="26" r="1.2" fill={color} />

      {/* Intertwined Monogram Letter G (Serif) */}
      <text
        x="68"
        y="92"
        fontFamily="Cinzel, 'Playfair Display', 'Times New Roman', Georgia, serif"
        fontSize="44"
        fontWeight="600"
        fill={color}
        textAnchor="middle"
        style={{ letterSpacing: "-1px" }}
      >
        G
      </text>

      {/* Center Ampersand */}
      <text
        x="80"
        y="83"
        fontFamily="Cinzel, 'Playfair Display', 'Times New Roman', Georgia, serif"
        fontSize="20"
        fontWeight="400"
        fill={color}
        textAnchor="middle"
        opacity="0.85"
      >
        &
      </text>

      {/* Intertwined Monogram Letter S (Serif) */}
      <text
        x="93"
        y="92"
        fontFamily="Cinzel, 'Playfair Display', 'Times New Roman', Georgia, serif"
        fontSize="44"
        fontWeight="600"
        fill={color}
        textAnchor="middle"
        style={{ letterSpacing: "-1px" }}
      >
        S
      </text>

      {/* Bottom Ribbon / Bow Flourish */}
      <path
        d="M74 126C78 124 82 124 86 126C88 128 85 131 80 133C75 131 72 128 74 126Z"
        fill={color}
        opacity="0.8"
      />
      <circle cx="80" cy="127" r="1.5" fill={color} />
    </svg>
  );
}

// ----------------------------------------------------------------------
// 2. BISMILLAH CALLIGRAPHY (Authentic Classical Arabic Typography)
// ----------------------------------------------------------------------
export function BismillahCalligraphy({
  className = "w-auto mx-auto",
  color = "#C8A97E",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <span
        dir="rtl"
        lang="ar"
        style={{ color }}
        className="font-serif text-2xl sm:text-3xl font-normal leading-relaxed tracking-normal select-none block"
      >
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </span>
      <div className="flex items-center justify-center gap-2 mt-0.5 opacity-60">
        <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C8A97E]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]" />
        <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C8A97E]" />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. CORNER FILIGREE (Classic Antique Corner Accents)
// ----------------------------------------------------------------------
export function CornerFiligree({
  className = "w-8 h-8",
  position = "top-left",
  color = "#C8A97E",
}: {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color?: string;
}) {
  const getRotation = () => {
    switch (position) {
      case "top-right":
        return "rotate-90";
      case "bottom-right":
        return "rotate-180";
      case "bottom-left":
        return "-rotate-90";
      default:
        return "";
    }
  };

  return (
    <div className={`${className} ${getRotation()} pointer-events-none select-none`}>
      <svg
        viewBox="0 0 48 48"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 44V16C4 9.37 9.37 4 16 4H44"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 44V20C8 13.37 13.37 8 20 8H44"
          stroke={color}
          strokeWidth="0.75"
          opacity="0.6"
        />
        <path
          d="M12 12C16 16 16 22 12 26C8 22 8 16 12 12Z"
          fill={color}
          opacity="0.8"
        />
        <circle cx="8" cy="8" r="2.5" fill={color} />
      </svg>
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. DIVIDER ORNAMENT (Formal Antique Separator)
// ----------------------------------------------------------------------
export function DividerOrnament({
  className = "w-full my-6",
  color = "#C8A97E",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div
        className="flex-1 h-[1px]"
        style={{
          background: `linear-gradient(to right, transparent, ${color})`,
          opacity: 0.5,
        }}
      />
      <div className="flex items-center gap-1.5 shrink-0" style={{ color }}>
        <div className="w-1.5 h-1.5 rotate-45 border border-current" />
        <div className="w-2.5 h-2.5 rotate-45 bg-current" />
        <div className="w-1.5 h-1.5 rotate-45 border border-current" />
      </div>
      <div
        className="flex-1 h-[1px]"
        style={{
          background: `linear-gradient(to left, transparent, ${color})`,
          opacity: 0.5,
        }}
      />
    </div>
  );
}

// ----------------------------------------------------------------------
// 5. ARCH FRAME (Royal Cathedral Arch Border)
// ----------------------------------------------------------------------
export function RoyalArchFrame({
  children,
  className = "",
  borderColor = "#C8A97E",
}: {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
}) {
  return (
    <div
      className={`relative rounded-t-[140px] rounded-b-2xl border-2 p-5 ${className}`}
      style={{ borderColor: borderColor }}
    >
      {/* Inner fine hairline border */}
      <div
        className="absolute inset-1.5 rounded-t-[134px] rounded-b-[10px] border pointer-events-none"
        style={{ borderColor: borderColor, opacity: 0.4 }}
      />
      {children}
    </div>
  );
}
