import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { cn } from '@/lib/utils';

const GLYPHS = '!<>-_\\/[]{}=+*^?#01';
const HANDLE = PERSONAL_INFO.nickname;

type Trigger = 'hover' | 'view' | 'mount';

interface HandleProps {
  className?: string;
  /** When to play the decode effect. Hover is always on. */
  play?: Exclude<Trigger, 'hover'>;
  /** Start decoding only once this is true (e.g. after the loader lifts). */
  enabled?: boolean;
  /** Delay before a `view`/`mount` decode, in ms. */
  delay?: number;
}

/**
 * The rhaev0r7 signature: set in mono, with the zero in the accent colour.
 * It "decodes" from random glyphs — once on view/mount, and again on hover.
 */
export function Handle({ className, play, enabled = true, delay = 0 }: HandleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const [chars, setChars] = useState<string[]>(() => HANDLE.split(''));
  const frame = useRef(0);
  const played = useRef(false);

  const decode = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const perChar = 55;
    const tick = (now: number) => {
      const elapsed = now - start;
      const next = HANDLE.split('').map((c, i) =>
        elapsed > 120 + i * perChar ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      );
      setChars(next);
      if (elapsed < 120 + HANDLE.length * perChar) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!play || !enabled || played.current) return;
    if (play === 'view' && !inView) return;
    played.current = true;
    const t = window.setTimeout(decode, delay);
    return () => window.clearTimeout(t);
  }, [play, enabled, inView, delay, decode]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <span
      ref={ref}
      onMouseEnter={decode}
      aria-label={HANDLE}
      className={cn('inline-block whitespace-nowrap font-mono tabular-nums', className)}
    >
      {chars.map((c, i) => (
        <span key={i} aria-hidden className={HANDLE[i] === '0' && c === '0' ? 'text-accent' : undefined}>
          {c}
        </span>
      ))}
    </span>
  );
}
