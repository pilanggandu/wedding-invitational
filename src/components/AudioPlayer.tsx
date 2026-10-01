"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { VolumeX, Music } from "lucide-react";

interface AudioPlayerProps {
  autoPlayTrigger?: boolean;
}

export function AudioPlayer({ autoPlayTrigger }: AudioPlayerProps) {
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

  return (
    <div className="fixed top-4 left-4 lg:absolute lg:top-14 lg:left-4 z-40 w-fit pointer-events-auto">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMusic}
        aria-label={isPlaying ? "Mute Musik" : "Putar Musik"}
        className="bg-white/95 flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[#7D1128] text-[#5A0B17] hover:bg-[#FFF0F3] shadow-[2px_3px_0px_#7D1128] transition-all duration-300 group cursor-pointer backdrop-blur-xs min-h-[44px]"
      >
        <div className="relative w-7 h-7 rounded-full bg-[#FFF0F3] border border-[#7D1128] flex items-center justify-center text-[#7D1128] shrink-0">
          {isPlaying ? (
            /* Animated Equalizer Wave Bars */
            <div className="flex items-end gap-[2px] h-3.5 w-3.5 justify-center">
              <span className="w-1 bg-[#7D1128] rounded-full animate-eq-1" />
              <span className="w-1 bg-[#C24155] rounded-full animate-eq-2" />
              <span className="w-1 bg-[#E5B869] rounded-full animate-eq-3" />
            </div>
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-[#9E2A3B]" />
          )}

          {/* Floating ping indicator */}
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7D1128] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7D1128]" />
            </span>
          )}
        </div>

        <span className="text-[11px] font-script font-bold text-[#7D1128] pr-1">
          {isPlaying ? "Musik: On 🎵" : "Musik: Off 🔇"}
        </span>
      </motion.button>
    </div>
  );
}
