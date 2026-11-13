import { useRef } from 'react';
import { motion, useScroll } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { useLocalTime } from '@/hooks/useLocalTime';
import { useIntroDone } from '@/lib/intro';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { LazyHeroZero } from '@/components/three/Lazy';
import { HandleText } from '@/components/ui/Handle';
import { EASE_OUT_EXPO } from '@/lib/utils';
import type { ReactNode } from 'react';

/** One masked line of the headline, rising into place after the intro. */
function Line({ children, show, delay }: { children: ReactNode; show: boolean; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block"
        initial={{ y: '105%' }}
        animate={{ y: show ? '0%' : '105%' }}
        transition={{ duration: 1, delay, ease: EASE_OUT_EXPO }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const introDone = useIntroDone();
  const time = useLocalTime();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  return (
    <section ref={ref} id="top" className="relative isolate flex h-[100svh] min-h-[620px] flex-col overflow-hidden">
      {/* Engineering paper: a faint dot grid, fading out toward the edges. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--line-strong) 1.2px, transparent 1.7px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 48%, #000 25%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 48%, #000 25%, transparent 80%)',
        }}
      />

      {/* The headline, in two blocks on either side of Zero: where I started, where I'm going. */}
      <h1 className="container-page pointer-events-none relative z-0 grid flex-1 grid-cols-1 content-between pb-6 pt-24 font-display text-[clamp(2.6rem,11vw,4.2rem)] leading-[0.86] lg:grid-cols-[1fr_minmax(0,0.85fr)_1fr] lg:content-stretch lg:text-[clamp(3rem,5.4vw,7rem)]">
        <span className="sr-only">
          {PERSONAL_INFO.name} ({PERSONAL_INFO.nickname}), {PERSONAL_INFO.role}.{' '}
        </span>
        <span className="block lg:col-start-1 lg:self-start lg:pt-[9vh]">
          <Line show={introDone} delay={0.35}>I started</Line>
          <Line show={introDone} delay={0.43}>with</Line>
          <Line show={introDone} delay={0.51}>interfaces.</Line>
        </span>
        <span className="block text-right lg:col-start-3 lg:self-end lg:pb-[6vh]">
          <Line show={introDone} delay={0.65}>Now I’m exploring</Line>
          <Line show={introDone} delay={0.73}>
            the <em>systems</em>
          </Line>
          <Line show={introDone} delay={0.81}>behind them.</Line>
        </span>
      </h1>

      <motion.div
        className="absolute inset-0 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <LazyHeroZero progress={scrollYProgress} ready={introDone} />
      </motion.div>

      {/* The strip along the bottom: who, where, and whether I'm free. */}
      <motion.div
        className="container-page relative z-20 pb-5"
        initial={{ opacity: 0, y: 24 }}
        animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.9, delay: 0.5, ease: EASE_OUT_EXPO }}
      >
        <div className="grid grid-cols-2 items-center gap-x-6 gap-y-3 border border-line-strong bg-bg/85 px-5 py-4 backdrop-blur-sm md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <p className="col-span-2 font-display text-[clamp(1.25rem,2.4vw,2rem)] leading-none md:col-span-1">
            {PERSONAL_INFO.name}
            <span className="ml-3 align-middle font-mono text-xs font-normal normal-case tracking-normal text-ink-muted">
              aka <HandleText />
            </span>
          </p>
          <p className="text-sm text-ink-muted">
            <span className="text-ink">{PERSONAL_INFO.role}</span>
            <br />
            India · {time} IST
          </p>
          <p className="inline-flex items-center gap-2 text-sm text-ink">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            Open to opportunities
          </p>
          <a href="#statement" className="tape tape-hot col-span-2 justify-self-start md:col-span-1 md:justify-self-end">
            Scroll
            <ArrowDown size={16} strokeWidth={2.5} />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
