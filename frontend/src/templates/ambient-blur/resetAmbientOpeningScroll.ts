export function resetAmbientOpeningScroll(root: HTMLElement) {
  root.scrollTo({ top: 0, behavior: "instant" });
  let nestedScroll = false;
  for (let parent = root.parentElement; parent; parent = parent.parentElement) {
    if (parent === document.body || parent === document.documentElement) continue;
    if (/(auto|scroll)/.test(getComputedStyle(parent).overflowY)) {
      parent.scrollTo({ top: 0, behavior: "instant" });
      nestedScroll = true;
    }
  }
  // A preview scrolls inside its modal; the page behind it keeps its position.
  if (!nestedScroll) window.scrollTo({ top: 0, behavior: "instant" });
}
