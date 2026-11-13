import { useLayoutEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DIRECTION_PATH, LEARNING_AREAS, LEARNING_STAGES } from '@/data/portfolioData';
import type { LearningArea } from '@/types';
import { cn, EASE_OUT_EXPO, prefersReducedMotion } from '@/lib/utils';

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
    <li ref={ref} className="grid grid-cols-12 items-center gap-x-4 gap-y-3 border-b-2 border-line py-6">
      <div className="col-span-12 md:col-span-5">
        <p className="font-display text-2xl leading-none tracking-normal">{area.topic}</p>
        <p className="mt-2 text-ink-muted">{area.description}</p>
        <p className="sr-only">Current stage: {area.stage}</p>
      </div>
      <div aria-hidden className="col-span-12 grid grid-cols-4 gap-1.5 md:col-span-7">
        {LEARNING_STAGES.map((s, i) => (
          <div key={s}>
            <div className="h-3 overflow-hidden bg-line">
              <motion.div
                className={cn('h-full origin-left', i === reached ? 'bg-accent' : 'bg-ink')}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: inView && i <= reached ? 1 : 0 }}
                transition={{ delay: row * 0.06 + i * 0.12, duration: 0.7, ease: EASE_OUT_EXPO }}
              />
            </div>
            <p className={cn('mt-1.5 text-xs md:hidden', i === reached ? 'text-accent' : 'text-ink-faint')}>{s}</p>
            {i === reached && <p className="mt-2 hidden font-mono text-xs text-ink md:block">← now</p>}
          </div>
        ))}
      </div>
    </li>
  );
}

/**
 * The staircase builds itself as you scroll: every step starts stacked flush
 * left and slides out to its own depth, one layer deeper at a time. Text never
 * drops below 0.6 opacity, which keeps it above 4.5:1 in both themes.
 */
function Staircase() {
  const root = useRef<HTMLOListElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>('[data-stair]');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'bottom 60%', scrub: 0.8, invalidateOnRefresh: true },
      });
      steps.forEach((step, i) => {
        tl.fromTo(
          step,
          // Undo this step's indent, so all steps begin as one flush column.
          { x: () => -parseFloat(getComputedStyle(step).paddingLeft), opacity: 0.6 },
          { x: 0, opacity: 1, ease: 'power3.out', duration: 1 },
          i * 0.55,
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <ol ref={root} className="space-y-1 md:space-y-2">
      {DIRECTION_PATH.map((step, i) => (
        <li key={step.title} data-stair className="flex items-baseline gap-4" style={{ paddingLeft: `calc(${i} * clamp(0.75rem, 4vw, 4.5rem))` }}>
          <span className="font-mono text-sm text-accent">↳</span>
          <span
            className={cn(
              i === DIRECTION_PATH.length - 1
                ? 'font-spray text-[clamp(2.4rem,7vw,6.4rem)] leading-[1.1] text-accent'
                : 'font-display text-[clamp(2rem,6vw,5.4rem)] leading-[0.95]',
            )}
          >
            {step.title}
          </span>
          <span className="hidden text-sm text-ink-muted lg:inline">
            {step.note}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Direction() {
  return (
    <section id="direction" className="relative overflow-hidden py-[clamp(4rem,10vw,8rem)]">
      <div className="container-page">
        <SectionHeader
          spray="NEXT"
          title={['Where I am,', <>and where I’m <em>heading.</em></>]}
          intro="Not proficiency scores — just an honest note of how far along each area is. These are things I am actively developing, not things I claim to have mastered."
        />

        {/* Stage matrix */}
        <div className="border-t-2 border-ink">
          <div aria-hidden className="hidden grid-cols-12 gap-x-4 border-b-2 border-line py-3 md:grid">
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
