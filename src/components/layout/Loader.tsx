import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { getLenis } from '@/lib/scroll';
import { EASE_OUT_EXPO } from '@/lib/utils';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { Handle } from '@/components/ui/Handle';

const COMMAND = 'npm run portfolio';
const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const BAR_CELLS = 24;

/**
 * Every line is a real task: it resolves when that thing actually finishes,
 * and the time shown is measured, not invented. A small floor per task keeps
 * each line readable on fast connections.
 */
const TASKS: { label: string; detail: string; run: () => Promise<unknown>; floor: number }[] = [
  { label: 'resolve fonts', detail: 'Fraunces · Geist · Geist Mono', run: () => document.fonts.ready, floor: 260 },
  { label: 'mount interface', detail: '6 sections', run: () => Promise.resolve(), floor: 240 },
  {
    label: 'load assets',
    detail: 'styles · scripts',
    run: () =>
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((r) => window.addEventListener('load', r, { once: true })),
    floor: 240,
  },
  {
    label: 'warm up interactions',
    detail: 'scroll · motion',
    run: () =>
      new Promise((r) => ('requestIdleCallback' in window ? requestIdleCallback(() => r(null), { timeout: 400 }) : setTimeout(r, 120))),
    floor: 220,
  },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function Spinner() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % SPINNER.length), 80);
    return () => window.clearInterval(id);
  }, []);
  return <span className="text-accent">{SPINNER[i]}</span>;
}

interface LoaderProps {
  /** Fired as the curtain starts lifting — the page can begin its entrance. */
  onReveal: () => void;
  /** Fired once the loader has fully left the screen. */
  onDone: () => void;
}

export function Loader({ onReveal, onDone }: LoaderProps) {
  const [typed, setTyped] = useState('');
  const [current, setCurrent] = useState(-1);
  const [times, setTimes] = useState<number[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [visible, setVisible] = useState(true);
  const finished = useRef(false);
  const started = useRef(performance.now());

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    onReveal();
    setVisible(false);
  };

  // Lock scrolling underneath while the loader is up.
  useEffect(() => {
    document.documentElement.dataset.loading = 'true';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    return () => {
      delete document.documentElement.dataset.loading;
      document.body.style.overflow = '';
      getLenis()?.start();
    };
  }, []);

  // Type the command, then run each task in order.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (let i = 1; i <= COMMAND.length; i++) {
        await wait(28 + Math.random() * 30);
        if (cancelled) return;
        setTyped(COMMAND.slice(0, i));
      }
      await wait(180);
      for (let i = 0; i < TASKS.length; i++) {
        if (cancelled) return;
        setCurrent(i);
        const t0 = performance.now();
        await Promise.all([TASKS[i].run(), wait(TASKS[i].floor)]);
        if (cancelled) return;
        setTimes((ts) => [...ts, Math.round(performance.now() - t0)]);
      }
      setCurrent(TASKS.length);
      setTotal((performance.now() - started.current) / 1000);
      await wait(650);
      if (!cancelled) finish();
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Any of Esc / Enter / Space skips.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['Escape', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const doneCount = times.length;
  const target = (doneCount / TASKS.length) * 100;
  const [pct, setPct] = useState(0);

  // Ease the readout toward the real progress so the bar fills cell by cell.
  useEffect(() => {
    let raf = 0;
    const step = () => {
      setPct((p) => {
        const next = p + (target - p) * 0.18;
        return Math.abs(target - next) < 0.5 ? target : next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const filled = Math.round((pct / 100) * BAR_CELLS);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="loader"
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
          onClick={finish}
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col bg-bg text-ink"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Faint grid, like graph paper under the terminal. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]"
            style={{
              backgroundImage:
                'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          <div className="container-page relative flex items-center justify-between pt-6 font-mono text-xs text-ink-faint">
            <span>
              <span className="text-ink-muted">{PERSONAL_INFO.nickname}</span>@portfolio:~
            </span>
            <button type="button" onClick={finish} className="rounded-full border border-line-strong px-3 py-1 transition-colors hover:border-ink hover:text-ink">
              skip <span className="hidden sm:inline">· esc</span>
            </button>
          </div>

          <div className="container-page relative flex-1 pt-[clamp(4rem,24vh,15rem)]">
            <div className="w-full max-w-xl font-mono text-[13px] leading-7 sm:text-sm">
              <p>
                <span className="text-accent">❯ </span>
                <span>{typed}</span>
                {current === -1 && <span className="ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] animate-pulse bg-ink" />}
              </p>

              <ul className="mt-3 space-y-0.5">
                {TASKS.map((task, i) => {
                  if (i > current) return null;
                  const isDone = i < doneCount;
                  return (
                    <motion.li
                      key={task.label}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                      className="grid grid-cols-[1.25rem_1fr_auto] gap-x-2"
                    >
                      {isDone ? <span className="text-accent">✓</span> : <Spinner />}
                      <span className={isDone ? 'text-ink' : 'text-ink-muted'}>
                        {task.label}
                        <span className="hidden text-ink-faint sm:inline"> — {task.detail}</span>
                      </span>
                      <span className="tabular-nums text-ink-faint">{isDone ? `${times[i]}ms` : ''}</span>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-6 flex items-center gap-3 text-ink-faint" aria-hidden>
                <span className="tracking-[-0.05em]">
                  [<span className="text-accent">{'█'.repeat(filled)}</span>
                  <span className="text-line-strong">{'░'.repeat(BAR_CELLS - filled)}</span>]
                </span>
                <span className="tabular-nums text-ink">{String(Math.round(pct)).padStart(3, '\u00a0')}%</span>
              </div>

              <AnimatePresence>
                {total !== null && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}>
                    <p className="mt-6 text-ink-muted">
                      <span className="text-accent">✓</span> ready in <span className="text-ink">{total.toFixed(2)}s</span>
                    </p>
                    <Handle play="mount" className="mt-6 block text-[clamp(3rem,9vw,6.5rem)] leading-none font-medium tracking-[-0.04em]" />
                    <p className="mt-3 font-display text-xl italic text-ink-muted sm:text-2xl">
                      {PERSONAL_INFO.name} — Software Engineer
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="container-page relative flex justify-between pb-6 font-mono text-xs text-ink-faint">
            <span>Software Engineer</span>
            <span>Frontend → Backend → AI</span>
          </div>
          {/* Accent edge on the curtain as it lifts. */}
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-accent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
