import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDownRight } from 'lucide-react';
import { RevealLines } from '@/components/ui/RevealLines';
import { useLocalTime } from '@/hooks/useLocalTime';
import { useIntroDone } from '@/lib/intro';
import { Handle } from '@/components/ui/Handle';
import { EASE_OUT_EXPO } from '@/lib/utils';

const SESSION = [
  { cmd: 'whoami', out: 'rhaev0r7 — Udhaya Moorthy, Software Engineer' },
  { cmd: 'focus', out: 'Frontend → Backend → AI' },
  { cmd: 'currently_learning', out: 'System design · Backend engineering · AI engineering' },
];

/** Types each command, then prints its output — the `whoami` from the brief. */
function WhoAmI({ start }: { start: boolean }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? SESSION.length : 0);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (!start || reduce || step >= SESSION.length) return;
    const cmd = SESSION[step].cmd;
    if (typed.length < cmd.length) {
      const t = window.setTimeout(() => setTyped(cmd.slice(0, typed.length + 1)), 55 + Math.random() * 45);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setStep((s) => s + 1);
      setTyped('');
    }, 420);
    return () => window.clearTimeout(t);
  }, [typed, step, reduce, start]);

  return (
    <div className="border-t border-line pt-4 font-mono text-[0.82rem] leading-6">
      <p className="label mb-3 normal-case">~/rhaev0r7</p>
      {/* The finished transcript is laid out invisibly to reserve its height,
          so typing never pushes the page down (no layout shift). */}
      <div className="grid">
        <div aria-hidden className="invisible col-start-1 row-start-1">
          {SESSION.map((line) => (
            <div key={line.cmd}>
              <p>$ {line.cmd}</p>
              <p>{line.out}</p>
            </div>
          ))}
          <p>$</p>
        </div>

        <div className="col-start-1 row-start-1" aria-label="Introduction">
          {SESSION.map((line, i) => {
            if (i > step) return null;
            const done = i < step;
            return (
              <div key={line.cmd}>
                <p>
                  <span className="text-accent">$ </span>
                  <span className="text-ink">{done ? line.cmd : typed}</span>
                  {!done && <span className="ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] animate-pulse bg-ink" />}
                </p>
                {done && (
                  <motion.p
                    className="text-ink-muted"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {line.out}
                  </motion.p>
                )}
              </div>
            );
          })}
          {step >= SESSION.length && (
            <p>
              <span className="text-accent">$ </span>
              <span className="inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] animate-pulse bg-ink" />
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const introDone = useIntroDone();
  const time = useLocalTime();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const headlineY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);

  const meta: [string, ReactNode][] = [
    ['Handle', <Handle key="h" play="mount" enabled={introDone} delay={700} className="text-ink" />],
    ['Role', 'Software Engineer'],
    ['Based in', `India · ${time} IST`],
  ];

  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] flex-col pt-24 pb-8">
      <div className="container-page flex flex-1 flex-col">
        <motion.dl
          className="grid grid-cols-2 gap-x-6 gap-y-3 border-b border-line pb-4 md:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: introDone ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt className="label">{k}</dt>
              <dd className="text-sm text-ink-muted">{v}</dd>
            </div>
          ))}
          <div className="md:text-right">
            <dt className="label">Status</dt>
            <dd className="inline-flex items-center gap-2 text-sm text-ink-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative h-2 w-2 rounded-full bg-accent" />
              </span>
              Open to opportunities
            </dd>
          </div>
        </motion.dl>

        <motion.div className="flex flex-1 items-center py-8" style={{ y: headlineY, opacity: headlineOpacity }}>
          <RevealLines
            as="h1"
            play={introDone}
            delay={0.25}
            className="text-[clamp(2.75rem,7.6vw,8.25rem)] leading-[0.9] font-[340] tracking-[-0.035em]"
            lines={[
              'I started with',
              'interfaces. Now I’m',
              <>
                exploring the <em className="font-[300] italic text-accent">systems</em>
              </>,
              'behind them.',
            ]}
          />
        </motion.div>

        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <motion.div
            className="col-span-12 md:col-span-6 lg:col-span-5"
            initial={{ opacity: 0, y: 16 }}
            animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1, delay: 0.7, ease: EASE_OUT_EXPO }}
          >
            <p className="max-w-[46ch] text-lg leading-relaxed text-ink-muted">
              Hi, I’m <span className="text-ink">Udhaya Moorthy</span> — <Handle className="text-ink" /> on the internet. I
              build products where technology, design and real-world problems meet, and I’m going one layer deeper each time.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#thinking"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent hover:text-accent-ink"
              >
                See how I think
                <ArrowDownRight size={16} className="transition-transform duration-500 group-hover:rotate-[-45deg]" />
              </a>
              <a href="#direction" className="link-draw px-2 py-3 text-sm text-ink-muted hover:text-ink">
                Where I’m heading
              </a>
            </div>
          </motion.div>

          <motion.div
            className="col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: introDone ? 1 : 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <WhoAmI start={introDone} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
