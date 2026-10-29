import { bindScrollMotion } from "../scrollMotion";

export function bindKeepsakeScrollMotion(root: HTMLElement) {
  return bindScrollMotion(root, {
    selector: ".pk-pages [data-pk-reveal]",
    rootClass: "pk-scroll-linked",
    itemClass: "pk-scroll-reveal",
    prefix: "--pk-scroll",
    photoSelector: ".pk-gallery-frame, .pk-person, .pk-photo",
  });
}
