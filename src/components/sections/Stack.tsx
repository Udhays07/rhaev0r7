import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TECH_CATEGORIES, TECH_STACK_DATA } from '@/data/portfolioData';
import { cn, EASE_OUT_EXPO } from '@/lib/utils';

export function Stack() {
  const [selectedId, setSelectedId] = useState('react');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const selected = TECH_STACK_DATA.find((t) => t.id === selectedId) ?? TECH_STACK_DATA[0];
  const categoryLabel = TECH_CATEGORIES.find((c) => c.id === selected.category)?.label;

  // Arrow keys walk the whole index, across categories.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const idx = TECH_STACK_DATA.findIndex((t) => t.id === selectedId);
    const last = TECH_STACK_DATA.length - 1;
    const next =
      e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : e.key === 'ArrowDown' || e.key === 'ArrowRight' ? Math.min(last, idx + 1)
      : Math.max(0, idx - 1);
    const id = TECH_STACK_DATA[next].id;
    select(id);
    tabRefs.current[id]?.focus();
  };

  // On mobile the index is a horizontal strip; keep the chosen chip in view.
  const select = (id: string) => {
    setSelectedId(id);
    tabRefs.current[id]?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
  };

  return (
    <section id="stack" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeader
          index="02"
          label="Stack"
          title={['The tools I reach for,', <>and <em className="italic text-accent">why</em> I reach for them.</>]}
          intro="Not a grid of logos and not skill percentages — engineering ability doesn’t fit on a progress bar. Pick a tool to see where I use it and what I’m still exploring."
        />

        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          {/* Index */}
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Technologies"
            className="col-span-12 -mx-5 flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 pb-2 [mask-image:linear-gradient(to_right,transparent,#000_1.25rem,#000_calc(100%-3rem),transparent)] [scrollbar-width:none] md:col-span-4 md:mx-0 md:block md:overflow-visible md:px-0 md:pb-0 md:[mask-image:none]"
          >
            {TECH_CATEGORIES.map((cat) => {
              const items = TECH_STACK_DATA.filter((t) => t.category === cat.id);
              return (
                <div key={cat.id} className="flex shrink-0 gap-2 md:mb-8 md:block">
                  <p className="label hidden md:mb-2 md:flex md:justify-between md:border-b md:border-line md:pb-2">
                    <span>{cat.label}</span>
                    <span>{String(items.length).padStart(2, '0')}</span>
                  </p>
                  {items.map((item) => {
                    const isActive = item.id === selectedId;
                    return (
                      <button
                        key={item.id}
                        ref={(el) => {
                          tabRefs.current[item.id] = el;
                        }}
                        role="tab"
                        id={`tab-${item.id}`}
                        aria-selected={isActive}
                        aria-controls="stack-panel"
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => select(item.id)}
                        onKeyDown={onKeyDown}
                        className={cn(
                          'group relative shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2 text-left text-sm transition-colors',
                          'md:flex md:w-full md:items-center md:justify-between md:rounded-none md:border-0 md:px-0 md:py-1.5 md:text-base',
                          isActive
                            ? 'border-ink bg-ink text-bg md:bg-transparent md:text-ink'
                            : 'border-line-strong text-ink-muted hover:text-ink',
                        )}
                      >
                        <span className="relative flex items-center">
                          {isActive && (
                            <motion.span
                              layoutId="stack-marker"
                              className="absolute -left-4 hidden h-4 w-[2px] bg-accent md:block"
                              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                            />
                          )}
                          <span className="transition-transform duration-500 md:group-hover:translate-x-1">{item.name}</span>
                        </span>
                        {isActive && <span className="hidden font-mono text-xs text-accent md:inline">→</span>}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Detail */}
          <div className="col-span-12 md:col-span-8">
            <div
              id="stack-panel"
              role="tabpanel"
              aria-labelledby={`tab-${selected.id}`}
              className="md:sticky md:top-28 min-h-[34rem] border-t border-line pt-6"
            >
              <AnimatePresence mode="wait">
                <motion.article
                  key={selected.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                >
                  <p className="label">{categoryLabel}</p>
                  <h3 className="mt-3 font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] font-[360]">{selected.name}</h3>
                  <p className="mt-3 font-display text-2xl italic text-ink-muted">{selected.tagline}</p>
                  <p className="mt-6 max-w-[60ch] text-lg leading-relaxed">{selected.description}</p>

                  <div className="mt-10 grid gap-8 sm:grid-cols-2">
                    <div>
                      <p className="label mb-3 border-b border-line pb-2">Where I use it</p>
                      <ul className="space-y-2">
                        {selected.usedFor.map((u) => (
                          <li key={u} className="flex gap-3">
                            <span className="font-mono text-accent" aria-hidden>+</span>
                            {u}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="label mb-3 border-b border-line pb-2">Exploring now</p>
                      <ul className="space-y-2 text-ink-muted">
                        {selected.exploring.map((e) => (
                          <li key={e} className="flex gap-3">
                            <span className="font-mono text-ink-faint" aria-hidden>~</span>
                            {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <blockquote className="mt-10 border-l-2 border-accent pl-5 font-display text-xl leading-snug">
                    {selected.practicalInsight}
                  </blockquote>

                  <p className="mt-8 font-mono text-xs text-ink-faint">{selected.tags.join('  ·  ')}</p>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
