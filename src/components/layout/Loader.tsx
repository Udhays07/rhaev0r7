import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { getLenis } from '@/lib/scroll';
import { EASE_OUT_EXPO, prefersReducedMotion } from '@/lib/utils';
import { DrawZero } from './intro/DrawZero';
import { HandleText } from '@/components/ui/Handle';

/**
 * The intro is on screen for a standard five seconds, unless skipped:
 * 3.8s for the scene, a 0.5s sweep of colour, then 0.7s lifting away.
 * The scene in the middle is swappable; this shell owns timing, skip and exit.
 */
const DURATION = 3800;
const SWEEP = 0.5;
const LIFT = 0.7;

const easeInOut = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

interface LoaderProps {
  /** Fired as the curtain starts lifting — the page can begin its entrance. */
  onReveal: () => void;
  /** Fired once the loader has fully left the screen. */
  onDone: () => void;
}

export function Loader({ onReveal, onDone }: LoaderProps) {
  const [reduce] = useState(prefersReducedMotion);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'playing' | 'wipe' | 'gone'>('playing');
  const finished = useRef(false);
  const skipRef = useRef<HTMLButtonElement>(null);

  const finish = (skipped = false) => {
    if (finished.current) return;
    finished.current = true;
    setProgress(1);
    // A skip goes straight out, and reduced motion has no sweep: just leave.
    if (reduce || skipped) {
      onReveal();
      setPhase('gone');
    } else {
      setPhase('wipe');
    }
  };

  // Hold the page still underneath, and put focus on Skip without a ring.
  useEffect(() => {
    document.documentElement.dataset.loading = 'true';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    skipRef.current?.focus({ preventScroll: true, focusVisible: false } as FocusOptions);
    return () => {
      delete document.documentElement.dataset.loading;
      document.body.style.overflow = '';
      // Smooth scrolling was held while the intro played.
      getLenis()?.start();
    };
  }, []);

  // The scene plays out over the duration; the finish also waits for fonts,
  // though on any normal connection they're long done.
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    let fontsIn = false;
    document.fonts.ready.then(() => (fontsIn = true));
    const tick = (now: number) => {
      const u = Math.min(1, (now - start) / DURATION);
      setProgress(easeInOut(u));
      if (u >= 1 && fontsIn) return finish();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Esc, Enter or Space skips.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['Escape', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        finish(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {phase !== 'gone' && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-bg text-ink"
          initial={false}
          exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: reduce ? 0.3 : LIFT, ease: [0.76, 0, 0.24, 1] }}
        >
          <p role="status" className="sr-only">
            {phase === 'playing' ? 'Loading portfolio' : 'Portfolio ready'}
          </p>

          <div className="container-page relative z-10 flex h-[4.5rem] shrink-0 items-center justify-between">
            <span aria-hidden className="font-mono text-sm text-ink-muted">
              <HandleText /> <span className="text-ink-faint">/ portfolio</span>
            </span>
            <button ref={skipRef} type="button" onClick={() => finish(true)} className="tape tape-hot">
              Skip
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>

          <div aria-hidden className="relative flex min-h-0 flex-1 flex-col pb-[4.5rem]">
            <DrawZero progress={reduce ? 1 : progress} />
          </div>

          {/* The finish: a sheet of the brand colour sweeps up, then lifts away with the loader. */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="flood absolute inset-0 z-20"
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              animate={phase === 'wipe' ? { clipPath: 'inset(0% 0 0 0)' } : { clipPath: 'inset(100% 0 0 0)' }}
              transition={{ duration: SWEEP, ease: EASE_OUT_EXPO }}
              onAnimationComplete={() => {
                if (phase !== 'wipe') return;
                onReveal();
                setPhase('gone');
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
