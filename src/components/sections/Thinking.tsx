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
    <section id="thinking" className="flood relative overflow-hidden py-[clamp(4rem,10vw,8rem)]">
      <div className="container-page">
        <SectionHeader
          spray="THINK"
          title={['From a problem', <>to a <em className="underline decoration-[0.07em] underline-offset-[0.1em]">product.</em></>]}
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
                    className="absolute font-spray text-[7.5rem] leading-none text-ink"
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
                <span aria-hidden className="absolute left-0 top-1 bottom-1 w-[3px] bg-line" />
                <motion.span aria-hidden className="absolute left-0 top-1 bottom-1 w-[3px] origin-top bg-ink" style={{ scaleY: fill }} />
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
                        <span className="font-display text-xl tracking-normal">{n.title}</span>
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
                data-active={i === active}
                className="group/step border-t-2 border-ink py-12 md:min-h-[54vh] md:py-16"
              >
                <p className="label flex items-center gap-3">
                  <span className="text-accent">{n.stepNumber}</span>
                  {n.subtitle}
                </p>
                {/* Focus moves by colour, not opacity: a resting step stays readable
                    (ink-muted passes AA in both themes), the active one comes forward. */}
                <h3 className="mt-4 font-display text-[clamp(2.8rem,6.5vw,6rem)] leading-[0.85] transition-colors duration-500 md:text-ink-muted md:group-data-[active=true]/step:text-ink">
                  {n.title}
                </h3>
                <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-muted">{n.description}</p>

                <ul className="mt-10">
                  {n.keyQuestions.map((q) => (
                    <li
                      key={q}
                      className="flex gap-4 border-b border-line py-3.5 text-lg transition-colors duration-500 md:text-xl md:text-ink-muted md:group-data-[active=true]/step:text-ink"
                    >
                      <span className="pt-1 font-mono text-sm text-ink-faint transition-colors duration-500 group-data-[active=true]/step:text-accent max-md:text-accent" aria-hidden>
                        ?
                      </span>
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
