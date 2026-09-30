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

  const playTone = useCallback((freq: number, duration: number = 1.6) => {
    try {
      const ctx = audioContextRef.current;
      if (!ctx || ctx.state !== "running") return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
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
    <div className="fixed lg:sticky bottom-20 sm:bottom-6 right-4 lg:ml-auto lg:mr-4 z-40 w-fit pointer-events-auto">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMusic}
        aria-label={isPlaying ? "Mute Musik" : "Putar Musik"}
        className="bg-white/95 flex items-center gap-2.5 p-2 sm:px-3.5 sm:py-2.5 rounded-full border-2 border-[#7D1128] text-[#5A0B17] hover:bg-[#FFF0F3] shadow-[3px_4px_0px_#7D1128] transition-all duration-300 group cursor-pointer backdrop-blur-xs"
      >
        <div className="relative w-8 h-8 rounded-full bg-[#FFF0F3] border border-[#7D1128] flex items-center justify-center text-[#7D1128]">
          {isPlaying ? (
            /* Animated Equalizer Wave Bars */
            <div className="flex items-end gap-[3px] h-4 w-4 justify-center">
              <span className="w-1 bg-[#7D1128] rounded-full animate-eq-1" />
              <span className="w-1 bg-[#C24155] rounded-full animate-eq-2" />
              <span className="w-1 bg-[#E5B869] rounded-full animate-eq-3" />
            </div>
          ) : (
            <VolumeX className="w-4 h-4 text-[#9E2A3B]" />
          )}

          {/* Floating ping indicator */}
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7D1128] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7D1128]" />
            </span>
          )}
        </div>

        <div className="hidden sm:flex flex-col text-left pr-1">
          <div className="flex items-center gap-1.5">
            <Music className="w-3 h-3 text-[#7D1128]" />
            <span className="text-[11px] font-bold font-sans text-[#4A0812]">
              {isPlaying ? "Musik Diputar" : "Musik Hening"}
            </span>
          </div>
          <span className="text-[9px] font-script text-[#8A1C2C] font-bold tracking-wide">
            Acoustic Serenade
          </span>
        </div>
      </motion.button>
    </div>
  );
}
