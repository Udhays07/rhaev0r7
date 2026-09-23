import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToTarget, setLenis } from '@/lib/scroll';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis drives scrolling; GSAP's ticker drives Lenis so ScrollTrigger and
 * Lenis share one animation frame. Skipped entirely for reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // In-page anchor links go through our scroll helper (offset for the nav).
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      history.replaceState(null, '', hash);
      // Move focus for keyboard and screen-reader users.
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    };
    document.addEventListener('click', onClick);

    if (reduce) {
      return () => document.removeEventListener('click', onClick);
    }

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    setLenis(lenis);
    // The intro loader may already be up; it restarts Lenis when it leaves.
    if (document.documentElement.dataset.loading) lenis.stop();
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
