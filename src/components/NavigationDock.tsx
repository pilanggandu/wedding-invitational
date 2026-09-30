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
    <nav className="fixed lg:sticky bottom-4 left-0 right-0 lg:left-auto lg:right-auto z-40 max-w-[92vw] sm:max-w-sm w-full px-2 mx-auto pointer-events-auto">
      <div className="bg-white/95 rounded-full px-3 py-2 border-2 border-[#7D1128] shadow-[3px_4px_0px_#7D1128] backdrop-blur-md flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 sm:px-2.5 rounded-full transition-all duration-300 cursor-pointer min-w-[40px] min-h-[40px] ${
                isActive
                  ? "bg-[#7D1128] text-white border-1.5 border-[#4A0812] shadow-xs scale-105"
                  : "text-[#7D1128] hover:bg-[#FFF0F3]"
              }`}
              aria-label={item.label}
              title={item.label}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-mono font-bold mt-0.5 hidden sm:block">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
