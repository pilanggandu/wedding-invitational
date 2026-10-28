"use client";

import React from "react";
import { motion } from "framer-motion";

export function PaintedCanvasBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#FAF5ED]">
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#DE7D54 0.75px, transparent 0.75px), radial-gradient(#6E5345 0.75px, #FAF5ED 0.75px)`,
          backgroundSize: "18px 18px",
          backgroundPosition: "0 0, 9px 9px",
        }}
      />

      <div className="absolute inset-0 overflow-hidden opacity-35 pointer-events-none">
        <motion.div
          animate={{
            x: [0, 20, -15, 0],
            y: [0, -25, 10, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-16 -left-16 w-96 h-96 rounded-full bg-[#FCD5CE]/40 blur-[80px]"
        />
        <motion.div
          animate={{
            x: [0, -25, 15, 0],
            y: [0, 20, -20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -right-20 w-[420px] h-[420px] rounded-full bg-[#FCEADE]/45 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, 15, -20, 0],
            y: [0, -15, 25, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/4 w-80 h-80 rounded-full bg-[#EBF4E5]/40 blur-[90px]"
        />
      </div>

      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_45%,rgba(247,238,228,0.4)_85%,rgba(243,230,217,0.7)_100%]" />
    </div>
  );
}
