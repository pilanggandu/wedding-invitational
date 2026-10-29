interface ScrollMotionOptions {
  selector: string;
  rootClass: string;
  itemClass: string;
  prefix: string;
  photoSelector: string;
}

export function bindScrollMotion(root: HTMLElement, options: ScrollMotionOptions) {
  const elements = Array.from(root.querySelectorAll<HTMLElement>(options.selector))
    .filter((element, _, candidates) => {
      for (let parent = element.parentElement; parent && parent !== root; parent = parent.parentElement) {
        if (candidates.includes(parent)) return false;
      }
      return true;
    });
  const items = elements.map((element, index) => {
    const clips: HTMLElement[] = [];
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(parent).overflowY)) clips.push(parent);
    }
    return { element, clips, y: 0, direction: index % 2 ? -1 : 1,
      photo: Boolean(element.matches(options.photoSelector) || element.querySelector(options.photoSelector)) };
  });
  let frame = 0;
  let disposed = false;
  const update = () => {
    frame = 0;
    if (disposed) return;
    const measurements = items.map((item) => {
      let top = 0;
      let bottom = window.innerHeight;
      for (const clip of item.clips) {
        const rect = clip.getBoundingClientRect();
        top = Math.max(top, rect.top + clip.clientTop);
        bottom = Math.min(bottom, rect.top + clip.clientTop + clip.clientHeight);
      }
      const height = bottom - top;
      const anchor = item.element.getBoundingClientRect().top - item.y;
      // Fully revealed by 60% of the scrollport; reverse across the same range.
      const progress = height > 0 ? Math.min(1, Math.max(0, (top + height * 0.96 - anchor) / (height * 0.36))) : 1;
      return { item, progress };
    });
    for (const { item, progress } of measurements) {
      item.y = (1 - progress) * 22;
      item.element.style.setProperty(`${options.prefix}-opacity`, String(0.12 + progress * 0.88));
      item.element.style.setProperty(`${options.prefix}-x`, `${item.photo ? (1 - progress) * 28 * item.direction : 0}px`);
      item.element.style.setProperty(`${options.prefix}-y`, `${item.y}px`);
      item.element.classList.add(options.itemClass);
    }
  };
  const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(update); };
  root.classList.add(options.rootClass);
  update();
  window.addEventListener("scroll", schedule, { capture: true, passive: true });
  window.addEventListener("resize", schedule);
  const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
  const observed = new Set<HTMLElement>([root, ...elements, ...items.flatMap((item) => item.clips)]);
  observed.forEach((element) => resize?.observe(element));
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", schedule, true);
    window.removeEventListener("resize", schedule);
    resize?.disconnect();
    root.classList.remove(options.rootClass);
    elements.forEach((element) => {
      element.classList.remove(options.itemClass);
      [`${options.prefix}-opacity`, `${options.prefix}-x`, `${options.prefix}-y`].forEach((name) => element.style.removeProperty(name));
    });
  };
}
