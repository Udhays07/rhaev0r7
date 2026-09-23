import { useLayoutEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DIRECTION_PATH, LEARNING_AREAS, LEARNING_STAGES } from '@/data/portfolioData';
import type { LearningArea } from '@/types';
import { cn, EASE_OUT_EXPO } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

/**
 * One row of the stage matrix. Visibility is observed on the row: the bars
 * start at scaleX(0), and a zero-width element is unreliable to observe.
 */
function StageRow({ area, row }: { area: LearningArea; row: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reached = LEARNING_STAGES.indexOf(area.stage);

  return (
    <li ref={ref} className="grid grid-cols-12 items-center gap-x-4 gap-y-3 border-b border-line py-5">
      <div className="col-span-12 md:col-span-5">
        <p className="text-lg">{area.topic}</p>
        <p className="text-sm text-ink-faint">{area.description}</p>
        <p className="sr-only">Current stage: {area.stage}</p>
      </div>
      <div aria-hidden className="col-span-12 grid grid-cols-4 gap-1.5 md:col-span-7">
        {LEARNING_STAGES.map((s, i) => (
          <div key={s}>
            <div className="h-1.5 overflow-hidden bg-bg-raised">
              <motion.div
                className={cn('h-full origin-left', i === reached ? 'bg-accent' : 'bg-ink-muted')}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: inView && i <= reached ? 1 : 0 }}
                transition={{ delay: row * 0.06 + i * 0.12, duration: 0.7, ease: EASE_OUT_EXPO }}
              />
            </div>
            <p className={cn('mt-1.5 text-xs md:hidden', i === reached ? 'text-accent' : 'text-ink-faint')}>{s}</p>
            {i === reached && <p className="mt-1.5 hidden text-xs text-accent md:block">● now</p>}
          </div>
        ))}
      </div>
    </li>
  );
}

/** Each step down the staircase lights up as you scroll: one layer deeper. */
function Staircase() {
  const root = useRef<HTMLOListElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-stair]',
        { opacity: 0.18, x: -24 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'bottom 55%', scrub: 0.8 },
        },
      );
      gsap.fromTo(
        '[data-stair-note]',
        { opacity: 0 },
        {
          opacity: 1,
          stagger: 0.5,
          scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 50%', scrub: 0.8 },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <ol ref={root} className="space-y-1 md:space-y-2">
      {DIRECTION_PATH.map((step, i) => (
        <li key={step.title} data-stair className="flex items-baseline gap-4" style={{ paddingLeft: `calc(${i} * clamp(0.75rem, 4vw, 4.5rem))` }}>
          <span className="font-mono text-xs text-accent">↳</span>
          <span className={cn('font-display text-[clamp(1.9rem,5.5vw,4.75rem)] leading-[1.05] font-[340]', i === DIRECTION_PATH.length - 1 && 'italic text-accent')}>
            {step.title}
          </span>
          <span data-stair-note className="hidden text-sm text-ink-faint lg:inline">
            {step.note}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Direction() {
  return (
    <section id="direction" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeader
          index="05"
          label="Direction"
          title={['Where I am,', <>and where I’m <em className="italic text-accent">heading.</em></>]}
          intro="Not proficiency scores — just an honest note of how far along each area is. These are things I am actively developing, not things I claim to have mastered."
        />

        {/* Stage matrix */}
        <div className="border-t border-line">
          <div aria-hidden className="hidden grid-cols-12 gap-x-4 border-b border-line py-3 md:grid">
            <span className="label col-span-5">Area</span>
            <span className="col-span-7 grid grid-cols-4 gap-1.5">
              {LEARNING_STAGES.map((s) => (
                <span key={s} className="label">{s}</span>
              ))}
            </span>
          </div>
          <ul>
            {LEARNING_AREAS.map((a, row) => (
              <StageRow key={a.topic} area={a} row={row} />
            ))}
          </ul>
        </div>

        {/* Staircase */}
        <div className="mt-28 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-40">
          <div className="col-span-12 md:col-span-3">
            <p className="label">The long direction</p>
            <p className="mt-3 max-w-[30ch] text-sm text-ink-muted">
              Not one area replacing another — a progression from building interfaces to understanding complete systems.
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <Staircase />
          </div>
        </div>
      </div>
    </section>
  );
}
