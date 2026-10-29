"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Home,
  Users,
  Calendar,
  BookOpen,
  Image as ImageIcon,
  Gift,
  MessageSquareHeart,
} from "lucide-react";

export type NavTheme = "maroon" | "cityscape" | "royal" | "cinematic" | "ambient" | "cats";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavigationDockProps {
  theme?: NavTheme;
  customItems?: NavItem[];
}

const getTargetElement = (id: string): HTMLElement | null => {
  const direct = document.getElementById(id);
  if (direct) return direct;

  const aliases: Record<string, string[]> = {
    hero: ["beranda", "cover", "sampul"],
    beranda: ["hero", "cover", "sampul"],
    couple: ["mempelai"],
    mempelai: ["couple"],
    event: ["events", "acara"],
    events: ["event", "acara"],
    acara: ["event", "events"],
    gallery: ["galeri"],
    galeri: ["gallery"],
    gift: ["gifts", "hadiah", "kado", "amplop"],
    gifts: ["gift", "hadiah", "kado", "amplop"],
    hadiah: ["gift", "gifts", "kado", "amplop"],
    rsvp: ["ucapan", "doa"],
  };

  for (const alias of aliases[id] || []) {
    const el = document.getElementById(alias);
    if (el) return el;
  }
  return null;
};

export function NavigationDock({
  theme = "maroon",
  customItems,
}: NavigationDockProps) {
  const navRef = useRef<HTMLElement>(null);
  const [dockLayout, setDockLayout] = useState<{
    left: string;
    maxWidth: string;
  }>({
    left: "50%",
    maxWidth: "380px",
  });

  const defaultItems = useMemo<NavItem[]>(() => {
    if (customItems && customItems.length > 0) return customItems;

    if (theme === "cats") {
      return [
        { id: "hero", label: "Meow", icon: Home },
        { id: "couple", label: "Duo", icon: Users },
        { id: "event", label: "Jadwal", icon: Calendar },
        { id: "story", label: "Kisah", icon: BookOpen },
        { id: "gallery", label: "Momen", icon: ImageIcon },
        { id: "gift", label: "Kado", icon: Gift },
        { id: "rsvp", label: "Doa", icon: MessageSquareHeart },
      ];
    }

    if (theme === "royal") {
      return [
        { id: "hero", label: "Beranda", icon: Home },
        { id: "couple", label: "Mempelai", icon: Users },
        { id: "events", label: "Acara", icon: Calendar },
        { id: "gallery", label: "Galeri", icon: ImageIcon },
        { id: "gifts", label: "Hadiah", icon: Gift },
        { id: "rsvp", label: "Doa", icon: MessageSquareHeart },
      ];
    }

    if (theme === "cinematic") {
      return [
        { id: "hero", label: "Scene", icon: Home },
        { id: "couple", label: "Cast", icon: Users },
        { id: "event", label: "Acara", icon: Calendar },
        { id: "story", label: "Reel", icon: BookOpen },
        { id: "gallery", label: "Stills", icon: ImageIcon },
        { id: "gift", label: "Kado", icon: Gift },
        { id: "rsvp", label: "RSVP", icon: MessageSquareHeart },
      ];
    }

    if (theme === "ambient") {
      return [
        { id: "hero", label: "Aura", icon: Home },
        { id: "couple", label: "Mempelai", icon: Users },
        { id: "event", label: "Agenda", icon: Calendar },
        { id: "story", label: "Jejak", icon: BookOpen },
        { id: "gallery", label: "Kanvas", icon: ImageIcon },
        { id: "gift", label: "Kado", icon: Gift },
        { id: "rsvp", label: "Doa", icon: MessageSquareHeart },
      ];
    }

    if (theme === "cityscape") {
      return [
        { id: "beranda", label: "Beranda", icon: Home },
        { id: "mempelai", label: "Mempelai", icon: Users },
        { id: "acara", label: "Acara", icon: Calendar },
        { id: "galeri", label: "Galeri", icon: ImageIcon },
        { id: "hadiah", label: "Hadiah", icon: Gift },
        { id: "rsvp", label: "RSVP", icon: MessageSquareHeart },
      ];
    }

    return [
      { id: "hero", label: "Beranda", icon: Home },
      { id: "couple", label: "Mempelai", icon: Users },
      { id: "event", label: "Acara", icon: Calendar },
      { id: "gallery", label: "Galeri", icon: ImageIcon },
      { id: "gift", label: "Kado", icon: Gift },
      { id: "rsvp", label: "Doa", icon: MessageSquareHeart },
    ];
  }, [theme, customItems]);

  const [activeSection, setActiveSection] = useState<string>(
    defaultItems[0]?.id || "hero"
  );

  useEffect(() => {
    const updatePosition = () => {
      const parentMain = navRef.current?.closest("main");
      if (parentMain) {
        const rect = parentMain.getBoundingClientRect();
        const maxDockWidth = Math.min(rect.width - 24, 400);

        if (navRef.current?.offsetParent) {
          setDockLayout({
            left: "50%",
            maxWidth: `${Math.max(280, maxDockWidth)}px`,
          });
        } else {
          const centerX = rect.left + rect.width / 2;
          setDockLayout({
            left: `${centerX}px`,
            maxWidth: `${Math.max(280, maxDockWidth)}px`,
          });
        }
      } else {
        setDockLayout({
          left: "50%",
          maxWidth: "380px",
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition, { passive: true });
    window.addEventListener("scroll", updatePosition, { passive: true, capture: true });
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, { capture: true });
    };
  }, []);

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const viewportTrigger = window.innerHeight * 0.38;
      for (let i = defaultItems.length - 1; i >= 0; i--) {
        const item = defaultItems[i];
        const el = getTargetElement(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportTrigger && rect.bottom > 80) {
            setActiveSection(item.id);
            return;
          }
        }
      }
      if (window.scrollY < 120 && defaultItems.length > 0) {
        setActiveSection(defaultItems[0].id);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", handleScroll, { capture: true });
  }, [defaultItems]);

  const scrollToSection = (id: string) => {
    const element = getTargetElement(id);
    if (element) {
      element.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  const themeStyles = {
    maroon: {
      container:
        "bg-white/95 border-2 border-[#7D1128] shadow-[3px_4px_0px_#7D1128]",
      activeText: "text-white",
      inactiveText: "text-[#7D1128] hover:text-[#4A0812]",
      activePill:
        "bg-[#7D1128] border-1.5 border-[#4A0812] shadow-xs",
      font: "font-mono font-bold",
      layoutId: "dockPill-maroon",
    },
    cityscape: {
      container:
        "bg-white/95 border-2 border-[#1D78A0] shadow-[0_6px_24px_rgba(29,120,160,0.28)]",
      activeText: "text-white",
      inactiveText: "text-[#1D78A0] hover:text-[#0C4A60]",
      activePill:
        "bg-[#1D78A0] border-1.5 border-[#0C4A60] shadow-xs",
      font: "font-mono font-bold",
      layoutId: "dockPill-cityscape",
    },
    royal: {
      container:
        "bg-[#09221B]/95 border border-[#C8A97E]/60 shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
      activeText: "text-[#09221B]",
      inactiveText: "text-[#C8A97E]/75 hover:text-[#FAF8F5]",
      activePill:
        "bg-[#C8A97E] border border-[#E8D7B8] shadow-xs",
      font: "font-serif font-semibold tracking-wider",
      layoutId: "dockPill-royal",
    },
    cinematic: {
      container:
        "bg-black/75 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.85)]",
      activeText: "text-black",
      inactiveText: "text-white/60 hover:text-white",
      activePill:
        "bg-white text-black shadow-md border border-white/40",
      font: "font-mono font-semibold tracking-wider text-[10px]",
      layoutId: "dockPill-cinematic",
    },
    ambient: {
      container:
        "bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.12)] ring-1 ring-slate-900/5",
      activeText: "text-white",
      inactiveText: "text-slate-600 hover:text-slate-900",
      activePill:
        "bg-gradient-to-r from-[var(--ambient-accent,#E07A5F)] to-[var(--ambient-secondary,#F4A261)] text-white shadow-md",
      font: "font-sans font-bold text-[10px]",
      layoutId: "dockPill-ambient",
    },
    cats: {
      container:
        "bg-white/95 backdrop-blur-md border-[2.5px] border-white ring-1 ring-[#F3DFD1] shadow-[0_12px_32px_rgba(222,125,84,0.18)] text-[#8C6D58]",
      activeText: "text-white",
      inactiveText: "text-[#8C6D58] hover:text-[#DF7B54]",
      activePill:
        "bg-gradient-to-r from-[#DF7B54] to-[#F4929D] shadow-xs text-white",
      font: "font-sans font-bold text-[10px]",
      layoutId: "dockPill-cats",
    },
  }[theme];

  return (
    <motion.nav
      ref={navRef}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        left: dockLayout.left,
        maxWidth: dockLayout.maxWidth,
        x: "-50%",
      }}
      className="fixed bottom-3 sm:bottom-4 z-40 w-full px-1.5 pointer-events-auto pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div
        className={`rounded-full p-1 sm:p-1.5 backdrop-blur-md flex items-center justify-between relative transition-colors duration-300 w-full shadow-lg ${themeStyles.container}`}
      >
        {defaultItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <motion.button
              key={item.id}
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              onClick={() => scrollToSection(item.id)}
              className={`flex-1 relative flex flex-col items-center justify-center py-1 sm:py-1.5 px-0.5 rounded-full transition-colors cursor-pointer min-h-[38px] sm:min-h-[42px] z-10 ${
                isActive ? themeStyles.activeText : themeStyles.inactiveText
              }`}
              aria-label={item.label}
              title={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId={themeStyles.layoutId}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className={`absolute inset-0 rounded-full -z-10 ${themeStyles.activePill}`}
                />
              )}
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span
                className={`text-[8px] sm:text-[9px] mt-0.5 tracking-tight truncate max-w-full px-0.5 leading-none ${themeStyles.font}`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}

export default NavigationDock;
