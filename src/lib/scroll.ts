import type Lenis from 'lenis';

/** Nav height plus breathing room, used when jumping to a section. */
export const SCROLL_OFFSET = -72;

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

/** Scroll to an element or `#id`, using Lenis when it is running. */
export function scrollToTarget(target: string | HTMLElement) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (instance) {
    // `force` so links inside the (scroll-locked) mobile menu still work.
    instance.scrollTo(el, { offset: SCROLL_OFFSET, duration: 1.2, force: true });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + SCROLL_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
