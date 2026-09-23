import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PRINCIPLES } from '@/data/portfolioData';
import { cn, EASE_OUT_EXPO } from '@/lib/utils';

export function Principles() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="principles" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeader
          index="04"
          label="Principles"
          title={['Five things I', <>try not to <em className="italic text-accent">compromise.</em></>]}
        />

        <ul className="border-b border-line">
          {PRINCIPLES.map((p, i) => {
            const isOpen = open === i;
            return (
              <li key={p.title} className="border-t border-line">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`principle-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group grid w-full grid-cols-12 items-center gap-x-4 py-6 text-left md:py-8"
                  >
                    <span className="col-span-2 font-mono text-xs text-ink-faint md:col-span-1">0{i + 1}</span>
                    <span
                      className={cn(
                        'col-span-8 font-display text-[clamp(2rem,5vw,4rem)] leading-none font-[360] transition-colors duration-500 md:col-span-5',
                        isOpen ? 'text-accent' : 'group-hover:text-accent',
                      )}
                    >
                      {p.title}
                    </span>
                    <span className="hidden text-ink-muted md:col-span-5 md:block">{p.summary}</span>
                    <span className="col-span-2 flex justify-end md:col-span-1">
                      <span
                        className={cn(
                          'grid h-10 w-10 place-items-center rounded-full border border-line-strong transition-[transform,background-color,color] duration-500',
                          isOpen ? 'rotate-45 bg-ink text-bg' : 'group-hover:border-ink',
                        )}
                      >
                        <Plus size={16} strokeWidth={1.5} />
                      </span>
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`principle-${i}`}
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-12 gap-x-4 gap-y-6 pb-10">
                        <p className="col-span-12 text-ink-muted md:hidden">{p.summary}</p>
                        <blockquote className="col-span-12 font-display text-2xl italic leading-snug md:col-span-5 md:col-start-2 md:text-3xl">
                          “{p.quote}”
                        </blockquote>
                        <ul className="col-span-12 space-y-2 md:col-span-5 md:col-start-7">
                          {p.points.map((pt) => (
                            <li key={pt} className="flex gap-3 border-b border-line pb-2">
                              <span className="text-accent" aria-hidden>+</span>
                              {pt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
