"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

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
    // D major chord arpeggios
    293.66, 369.99, 440.0, 587.33,
    // A major
    220.0, 277.18, 329.63, 440.0,
    // B minor
    246.94, 293.66, 369.99, 493.88,
    // F# minor
    185.0, 220.0, 277.18, 369.99,
    // G major
    196.0, 246.94, 293.66, 392.0,
    // D major
    220.0, 293.66, 369.99, 440.0,
    // G major
    196.0, 246.94, 293.66, 392.0,
    // A7
    220.0, 277.18, 329.63, 440.0,
  ];

  // Play a soft acoustic harp/guitar harmonic tone
  const playTone = useCallback((freq: number, duration: number = 1.6) => {
    try {
      const ctx = audioContextRef.current;
      if (!ctx || ctx.state !== "running") return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft triangle/sine blend for warm acoustic feel
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Gentle attack and decay envelope
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio playback gracefully suppressed if not supported
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
        // Occasionally play a high octave chime
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
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? "Mute Musik" : "Putar Musik"}
        className="paper-sheet flex items-center gap-2 p-2.5 sm:px-3 sm:py-2 rounded-full border border-[#D5C4AF] bg-[#FFFDF9]/95 text-[#5C4D41] hover:text-[#A85A42] hover:border-[#C29B7F] shadow-lg transition-all duration-300 group cursor-pointer"
      >
        <div className="relative w-8 h-8 rounded-full bg-[#EFE6D6] flex items-center justify-center text-[#7F6B58] group-hover:bg-[#EADBC7]">
          {isPlaying ? (
            <div className="relative">
              <Volume2 className="w-4 h-4 animate-gentle-pulse text-[#A85A42]" />
              {/* Spinning mini vinyl aura */}
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C26D53] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A85A42]" />
              </span>
            </div>
          ) : (
            <VolumeX className="w-4 h-4 text-[#9C8B7B]" />
          )}
        </div>

        <div className="hidden sm:flex flex-col text-left pr-1">
          <div className="flex items-center gap-1.5">
            <Music className="w-3 h-3 text-[#A85A42]" />
            <span className="text-[11px] font-medium font-sans text-[#4A3E37]">
              {isPlaying ? "Musik Diputar" : "Musik Hening"}
            </span>
          </div>
          <span className="text-[9px] font-script text-[#8F7D6D] tracking-wide">
            Acoustic Serenade
          </span>
        </div>
      </button>
    </div>
  );
}
