"use client";

import React, { useEffect, useRef } from "react";
import "./invitation-motion.css";

export function InvitationMotion({ children, disabled }: { children: React.ReactNode; disabled: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = root.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!container || disabled || preference.matches || typeof IntersectionObserver === "undefined") return;
    const seen = new WeakSet<Element>();
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || seen.has(entry.target)) continue;
        seen.add(entry.target);
        observer.unobserve(entry.target);
        const element = entry.target as HTMLElement;
        if (element.getAnimations().some((animation) => animation.playState === "running")) continue;
        const photo = element.tagName === "IMG";
        const animation = element.animate(
          photo
            ? [{ opacity: 0.4, translate: "18px 0" }, { opacity: 1, translate: "0 0" }]
            : [{ opacity: 0.35, translate: "0 12px" }, { opacity: 1, translate: "0 0" }],
          { duration: photo ? 750 : 600, easing: "cubic-bezier(.22,1,.36,1)" },
        );
        animations.add(animation);
        animation.finished.then(() => animations.delete(animation)).catch(() => animations.delete(animation));
      }
    }, { threshold: 0.15 });
    const observe = () => {
      container.querySelectorAll("section h2:not(:has(.cm-char)), section h3:not(:has(.cm-char)), section img[alt]:not([alt=''])").forEach((element) => {
        if (!seen.has(element)) observer.observe(element);
      });
    };
    observe();
    const mutations = new MutationObserver(observe);
    mutations.observe(container, { childList: true, subtree: true });
    const stop = () => { if (preference.matches) { observer.disconnect(); animations.forEach((animation) => animation.cancel()); } };
    preference.addEventListener("change", stop);
    return () => { observer.disconnect(); mutations.disconnect(); preference.removeEventListener("change", stop); animations.forEach((animation) => animation.cancel()); };
  }, [disabled]);

  return <div ref={root} className={`invitation-motion contents ${disabled ? "invitation-motion--disabled" : ""}`}>{children}</div>;
}
