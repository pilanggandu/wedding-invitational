"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Users, Calendar, BookOpen, Image as ImageIcon, Gift, MessageSquareHeart } from "lucide-react";

export function NavigationDock() {
  const [activeSection, setActiveSection] = useState<string>("beranda");

  const navItems = [
    { id: "beranda", label: "Beranda", icon: Home },
    { id: "mempelai", label: "Mempelai", icon: Users },
    { id: "acara", label: "Acara", icon: Calendar },
    { id: "cerita", label: "Cerita", icon: BookOpen },
    { id: "galeri", label: "Galeri", icon: ImageIcon },
    { id: "hadiah", label: "Hadiah", icon: Gift },
    { id: "rsvp", label: "RSVP", icon: MessageSquareHeart },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed lg:sticky bottom-4 left-0 right-0 lg:left-auto lg:right-auto z-40 max-w-[92vw] sm:max-w-sm w-full px-2 mx-auto pointer-events-auto">
      <div className="bg-white/95 rounded-full px-2 py-1.5 border-2 border-[#7D1128] shadow-[3px_4px_0px_#7D1128] backdrop-blur-md flex items-center justify-around relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => scrollToSection(item.id)}
              className={`relative flex flex-col items-center justify-center p-1.5 sm:px-2 rounded-full transition-colors cursor-pointer min-w-[38px] min-h-[42px] z-10 ${
                isActive ? "text-white" : "text-[#7D1128] hover:text-[#4A0812]"
              }`}
              aria-label={item.label}
              title={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="activeDockPill"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  className="absolute inset-0 bg-[#7D1128] rounded-full border-1.5 border-[#4A0812] -z-10 shadow-xs"
                />
              )}
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-[9px] font-mono font-bold mt-0.5 hidden sm:block leading-none">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
