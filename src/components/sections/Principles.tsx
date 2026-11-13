import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PRINCIPLES } from '@/data/portfolioData';
import { cn } from '@/lib/utils';

export function Principles() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="principles" className="relative overflow-hidden py-[clamp(4rem,10vw,8rem)]">
      <div className="container-page">
        <SectionHeader
          spray="RULES"
          title={['Five things I', <>try not to <em>compromise.</em></>]}
        />

        <ul className="border-b-2 border-ink">
          {PRINCIPLES.map((p, i) => {
            const isOpen = open === i;
            return (
              <li key={p.title} className={cn('border-t-2 border-ink transition-colors duration-500', isOpen && 'flood')}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`principle-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group grid w-full grid-cols-12 items-center gap-x-4 px-0 py-6 text-left md:px-4 md:py-8"
                  >
                    <span className="col-span-2 font-mono text-xs text-ink-faint md:col-span-1">0{i + 1}</span>
                    <span
                      className={cn(
                        'col-span-8 font-display text-[clamp(2.4rem,6vw,5.4rem)] leading-[0.85] transition-transform duration-500 md:col-span-6',
                        !isOpen && 'group-hover:translate-x-2',
                      )}
                    >
                      {p.title}
                    </span>
                    <span className="hidden text-lg text-ink-muted md:col-span-4 md:block">{p.summary}</span>
                    <span className="col-span-2 flex justify-end md:col-span-1">
                      <span
                        className={cn(
                          'grid h-12 w-12 place-items-center rounded-full border-2 border-ink transition-[transform,background-color,color] duration-500',
                          isOpen ? 'rotate-45 bg-ink text-bg' : 'group-hover:bg-ink group-hover:text-bg',
                        )}
                      >
                        <Plus size={16} strokeWidth={1.5} />
                      </span>
                    </span>
                  </button>
                </h3>
                {/* Rows animate 0fr → 1fr, so the panel opens to its natural height
                    without measuring it. Once it settles, scroll-linked effects
                    further down re-measure their start and end points. */}
                <div
                  id={`principle-${i}`}
                  inert={!isOpen}
                  onTransitionEnd={(e) => {
                    if (e.target === e.currentTarget && e.propertyName === 'grid-template-rows') ScrollTrigger.refresh();
                  }}
                  className={cn(
                    'grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)]',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                      <div className="grid grid-cols-12 gap-x-4 gap-y-6 pb-10">
                        <p className="col-span-12 text-ink-muted md:hidden">{p.summary}</p>
                        <blockquote className="col-span-12 font-spray text-2xl leading-snug md:col-span-6 md:col-start-1 md:px-4 md:text-3xl">
                          “{p.quote}”
                        </blockquote>
                        <ul className="col-span-12 space-y-2 md:col-span-5 md:col-start-8">
                          {p.points.map((pt) => (
                            <li key={pt} className="flex gap-3 border-b-2 border-line pb-2 text-lg">
                              <span aria-hidden>+</span>
                              {pt}
                            </li>
                          ))}
                        </ul>
                      </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
