import { useEffect, useRef, useState, type RefObject } from 'react';
import type { LookRef } from './Zero';

/**
 * True only while the element is near the viewport and the tab is visible.
 * Scenes stop rendering otherwise, so no GPU work happens off-screen.
 */
export function useStageActive(ref: RefObject<HTMLElement | null>, margin = '120px') {
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    const onVis = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [ref, margin]);

  return inView && pageVisible;
}

/**
 * Where the pointer is relative to an element's centre, normalised so ±1 is
 * about half a viewport away. Zero follows the cursor anywhere on the page,
 * not only over its own canvas.
 */
export function usePointerLook(ref: RefObject<HTMLElement | null>): LookRef {
  const look = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el || e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      look.current.x = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2));
      look.current.y = clamp(-(e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [ref]);
  return look;
}
