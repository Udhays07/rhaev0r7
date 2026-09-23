import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { THOUGHT_NODES } from '@/data/portfolioData';
import { scrollToTarget } from '@/lib/scroll';
import { cn, EASE_OUT_EXPO } from '@/lib/utils';

export function Thinking() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ['start 55%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const els = THOUGHT_NODES.map((n) => document.getElementById(`step-${n.id}`)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const current = THOUGHT_NODES[active];

  return (
    <section id="thinking" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeader
          index="03"
          label="How I think"
          title={['From a problem', <>to a <em className="italic text-accent">product.</em></>]}
          intro="The technology is the easy part to list. This is the part I actually care about: the questions I ask before, during and after writing code."
        />

        <div className="grid grid-cols-12 gap-x-6">
          {/* Sticky rail */}
          <aside className="col-span-12 hidden md:col-span-4 md:block">
            <div className="sticky top-28">
              <div className="relative h-[7.5rem] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={current.stepNumber}
                    className="absolute font-display text-[7rem] leading-none font-[300] text-accent"
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-100%' }}
                    transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                  >
                    {current.stepNumber}
                  </motion.span>
                </AnimatePresence>
              </div>

              <nav aria-label="Thinking steps" className="relative mt-8 pl-6">
                <span aria-hidden className="absolute left-0 top-1 bottom-1 w-px bg-line" />
                <motion.span aria-hidden className="absolute left-0 top-1 bottom-1 w-px origin-top bg-accent" style={{ scaleY: fill }} />
                <ol className="space-y-1">
                  {THOUGHT_NODES.map((n, i) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => scrollToTarget(`#step-${n.id}`)}
                        aria-current={i === active ? 'step' : undefined}
                        className={cn(
                          'flex w-full items-baseline gap-3 py-1.5 text-left transition-colors duration-300',
                          i === active ? 'text-ink' : 'text-ink-faint hover:text-ink-muted',
                        )}
                      >
                        <span className="font-mono text-xs">{n.stepNumber}</span>
                        <span className="text-lg">{n.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>

              <p className="mt-10 max-w-[28ch] text-sm text-ink-faint">
                Problem → architecture → implementation → data &amp; AI → validation. Then around again.
              </p>
            </div>
          </aside>

          {/* Steps */}
          <div ref={stepsRef} className="col-span-12 md:col-span-8">
            {THOUGHT_NODES.map((n, i) => (
              <article
                key={n.id}
                id={`step-${n.id}`}
                data-index={i}
                className={cn(
                  'border-t border-line py-12 transition-opacity duration-700 md:min-h-[70vh] md:py-16',
                  i === active ? 'md:opacity-100' : 'md:opacity-30',
                )}
              >
                <p className="label flex items-center gap-3">
                  <span className="text-accent">{n.stepNumber}</span>
                  {n.subtitle}
                </p>
                <h3 className="mt-4 font-display text-[clamp(2.25rem,5vw,4rem)] leading-none font-[360]">{n.title}</h3>
                <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-muted">{n.description}</p>

                <ul className="mt-10">
                  {n.keyQuestions.map((q) => (
                    <li key={q} className="flex gap-4 border-b border-line py-3.5 text-lg md:text-xl">
                      <span className="font-mono text-sm text-accent pt-1" aria-hidden>?</span>
                      {q}
                    </li>
                  ))}
                </ul>

                <p className="mt-8 text-sm text-ink-muted">
                  <span className="label mr-3">Decides by</span>
                  {n.decisionCriteria.join(' — ')}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
