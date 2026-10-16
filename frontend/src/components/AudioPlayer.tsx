"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { VolumeX, Music } from "lucide-react";

export type AudioTheme = "maroon" | "cityscape" | "royal" | "cinematic" | "ambient" | "cats";

interface AudioPlayerProps {
  autoPlayTrigger?: boolean;
  theme?: AudioTheme;
}

export function AudioPlayer({ autoPlayTrigger, theme = "maroon" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  // Soft romantic acoustic melody notes (Ethereal Canon in D / Acoustic Arpeggios)
  const notesFreq = [
    293.66, 369.99, 440.0, 587.33,
    220.0, 277.18, 329.63, 440.0,
    246.94, 293.66, 369.99, 493.88,
    185.0, 220.0, 277.18, 369.99,
    196.0, 246.94, 293.66, 392.0,
    220.0, 293.66, 369.99, 440.0,
    196.0, 246.94, 293.66, 392.0,
    220.0, 277.18, 329.63, 440.0,
  ];

  const playTone = useCallback((freq: number, duration: number = 2.0) => {
    try {
      const ctx = audioContextRef.current;
      if (!ctx || ctx.state !== "running") return;

      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1500, ctx.currentTime);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);

      const gain2 = ctx.createGain();
      gain2.gain.value = 0.25;

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(filter);
      osc2.connect(gain2);
      gain2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
      osc2.stop(ctx.currentTime + duration);
    } catch {
      // ignore
    }
  }, []);

  const startMusic = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }

      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      let step = 0;
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        if (!isPlayingRef.current) return;
        const freq = notesFreq[step % notesFreq.length];
        playTone(freq, 2.0);
        if (step % 4 === 0) {
          setTimeout(() => {
            if (isPlayingRef.current) playTone(freq * 1.5, 1.8);
          }, 300);
        }
        step++;
      }, 550);

      isPlayingRef.current = true;
      setIsPlaying(true);
    } catch (e) {
      console.warn("Audio autoplay policy:", e);
    }
  }, [notesFreq, playTone]);

  const stopMusic = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state === "running") {
      audioContextRef.current.suspend();
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
  }, []);

  const toggleMusic = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  useEffect(() => {
    if (autoPlayTrigger && !isPlayingRef.current) {
      startMusic();
    }
  }, [autoPlayTrigger, startMusic]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const themeStyles = {
    maroon: {
      button:
        "bg-white/95 border-2 border-[#7D1128] text-[#5A0B17] hover:bg-[#FFF0F3] shadow-[2px_3px_0px_#7D1128]",
      circle: "bg-[#FFF0F3] border border-[#7D1128] text-[#7D1128]",
      eqBars: ["bg-[#7D1128]", "bg-[#C24155]", "bg-[#E5B869]"],
      ping: "bg-[#7D1128]",
      labelFont: "font-script font-bold text-[#7D1128]",
      labelOn: "Musik: On 🎵",
      labelOff: "Musik: Off 🔇",
      mutedIcon: "text-[#9E2A3B]",
    },
    cityscape: {
      button:
        "bg-white/95 border-2 border-[#1D78A0] text-[#0C4A60] hover:bg-[#EBF4F8] shadow-[0_4px_16px_rgba(29,120,160,0.2)]",
      circle: "bg-[#EBF4F8] border border-[#1D78A0] text-[#1D78A0]",
      eqBars: ["bg-[#1D78A0]", "bg-[#38B6FF]", "bg-[#FFE58F]"],
      ping: "bg-[#38B6FF]",
      labelFont: "font-mono font-bold text-[11px] text-[#1D78A0]",
      labelOn: "Musik: On",
      labelOff: "Musik: Off",
      mutedIcon: "text-[#1D78A0]",
    },
    royal: {
      button:
        "bg-[#09221B]/95 border border-[#C8A97E]/60 text-[#FAF8F5] hover:bg-[#0F2D24] shadow-[0_6px_20px_rgba(0,0,0,0.45)] backdrop-blur-md",
      circle: "bg-[#0F2D24] border border-[#C8A97E]/40 text-[#C8A97E]",
      eqBars: ["bg-[#C8A97E]", "bg-[#E8D7B8]", "bg-[#FAF8F5]"],
      ping: "bg-[#C8A97E]",
      labelFont: "font-serif text-[11px] text-[#C8A97E] tracking-wider",
      labelOn: "Musik: On",
      labelOff: "Musik: Off",
      mutedIcon: "text-[#C8A97E]/60",
    },
    cinematic: {
      button:
        "bg-black/80 backdrop-blur-2xl border border-white/20 text-white hover:bg-black/95 shadow-[0_4px_24px_rgba(0,0,0,0.8)]",
      circle: "bg-white/10 border border-white/20 text-white",
      eqBars: ["bg-rose-500", "bg-white", "bg-rose-400"],
      ping: "bg-rose-500",
      labelFont: "font-mono font-semibold text-[10px] text-white tracking-widest uppercase",
      labelOn: "AUDIO ON",
      labelOff: "AUDIO MUTE",
      mutedIcon: "text-white/60",
    },
    ambient: {
      button:
        "bg-white/85 backdrop-blur-2xl border border-white/80 text-slate-800 hover:bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)] ring-1 ring-slate-900/5",
      circle: "bg-slate-100 border border-slate-200 text-slate-700",
      eqBars: ["bg-[var(--ambient-accent,#E07A5F)]", "bg-[var(--ambient-secondary,#F4A261)]", "bg-amber-400"],
      ping: "bg-[var(--ambient-accent,#E07A5F)]",
      labelFont: "font-sans font-bold text-[10px] text-slate-800 tracking-wider uppercase",
      labelOn: "AUDIO ON",
      labelOff: "MUTED",
      mutedIcon: "text-slate-400",
    },
    cats: {
      button:
        "bg-[#FAF6EE]/95 border-2 border-[#EAD8C7] text-[#8C5D38] hover:bg-white shadow-[0_4px_16px_rgba(200,90,23,0.15)]",
      circle: "bg-[#FFF4EB] border border-[#EAD8C7] text-[#D97736]",
      eqBars: ["bg-[#D97736]", "bg-[#EA580C]", "bg-[#FDBA74]"],
      ping: "bg-[#EA580C]",
      labelFont: "font-mono font-bold text-[10px] text-[#C85A17] uppercase tracking-wider",
      labelOn: "MEOW ON",
      labelOff: "MEOW OFF",
      mutedIcon: "text-[#A8734C]",
    },
  }[theme];

  return (
    <div className="fixed top-4 left-4 lg:absolute lg:top-14 lg:left-4 z-40 w-fit pointer-events-auto">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMusic}
        aria-label={isPlaying ? "Mute Musik" : "Putar Musik"}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 group cursor-pointer backdrop-blur-xs min-h-[44px] ${themeStyles.button}`}
      >
        <div
          className={`relative w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${themeStyles.circle}`}
        >
          {isPlaying ? (
            /* Animated Equalizer Wave Bars */
            <div className="flex items-end gap-[2px] h-3.5 w-3.5 justify-center">
              <span className={`w-1 rounded-full animate-eq-1 ${themeStyles.eqBars[0]}`} />
              <span className={`w-1 rounded-full animate-eq-2 ${themeStyles.eqBars[1]}`} />
              <span className={`w-1 rounded-full animate-eq-3 ${themeStyles.eqBars[2]}`} />
            </div>
          ) : (
            <VolumeX className={`w-3.5 h-3.5 ${themeStyles.mutedIcon}`} />
          )}

          {/* Floating ping indicator */}
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${themeStyles.ping}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${themeStyles.ping}`} />
            </span>
          )}
        </div>

        <span className={`pr-1 ${themeStyles.labelFont}`}>
          {isPlaying ? themeStyles.labelOn : themeStyles.labelOff}
        </span>
      </motion.button>
    </div>
  );
}
