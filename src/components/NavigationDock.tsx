"use client";

import React, { useState, useEffect } from "react";
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
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] sm:max-w-md w-full px-2">
      <div className="paper-sheet rounded-full px-3 py-2 border border-[#D5C2AA] bg-[#FFFDF9]/95 backdrop-blur-md shadow-xl flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 sm:px-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-[#A85A42] text-[#FFFDF9] shadow-xs scale-105"
                  : "text-[#756251] hover:text-[#A85A42] hover:bg-[#F7EFE4]"
              }`}
              aria-label={item.label}
              title={item.label}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-sans font-medium mt-0.5 hidden sm:block">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
