export function bindKeepsakeScrollMotion(root: HTMLElement) {
  const elements = Array.from(root.querySelectorAll<HTMLElement>(".pk-pages [data-pk-reveal]"))
    .filter((element) => !element.parentElement?.closest("[data-pk-reveal]"));
  const items = elements.map((element, index) => {
    const clips: HTMLElement[] = [];
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(parent).overflowY)) clips.push(parent);
    }
    return { element, clips, y: 0, direction: index % 2 ? -1 : 1,
      photo: Boolean(element.matches(".pk-gallery-frame, .pk-person") || element.querySelector(".pk-photo")) };
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
      item.element.style.setProperty("--pk-scroll-opacity", String(0.12 + progress * 0.88));
      item.element.style.setProperty("--pk-scroll-x", `${item.photo ? (1 - progress) * 28 * item.direction : 0}px`);
      item.element.style.setProperty("--pk-scroll-y", `${item.y}px`);
      item.element.classList.add("pk-scroll-reveal");
    }
  };
  const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(update); };
  root.classList.add("pk-scroll-linked");
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
    root.classList.remove("pk-scroll-linked");
    elements.forEach((element) => {
      element.classList.remove("pk-scroll-reveal");
      ["--pk-scroll-opacity", "--pk-scroll-x", "--pk-scroll-y"].forEach((name) => element.style.removeProperty(name));
    });
  };
}
