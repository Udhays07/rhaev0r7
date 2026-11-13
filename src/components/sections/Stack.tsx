import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TECH_CATEGORIES, TECH_STACK_DATA } from '@/data/portfolioData';
import { cn, EASE_OUT_EXPO, prefersReducedMotion } from '@/lib/utils';

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
    tabRefs.current[id]?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <section id="stack" className="relative overflow-hidden py-[clamp(4rem,10vw,8rem)]">
      <div className="container-page">
        <SectionHeader
          spray="STACK"
          title={['The tools I reach for,', <>and <em>why.</em></>]}
          intro="Not a grid of logos and not skill percentages. Pick a sticker to see where I use the tool and what I’m still exploring."
        />

        {/* Index: every tool is a sticker; the picked one is slapped on in Zero's orange. */}
        <div role="tablist" aria-label="Technologies" className="flex flex-col gap-6">
          {TECH_CATEGORIES.map((cat) => {
            const items = TECH_STACK_DATA.filter((t) => t.category === cat.id);
            return (
              <div key={cat.id} className="grid gap-3 md:grid-cols-[11rem_1fr] md:items-baseline">
                <p className="label">{cat.label}</p>
                <div className="flex flex-wrap gap-2.5">
                  {items.map((item, i) => {
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
                        style={{ rotate: isActive ? `${i % 2 ? 2 : -2}deg` : '0deg' }}
                        className={cn(
                          'min-h-11 rounded-full border-2 px-4 py-2 font-display text-sm leading-none tracking-normal transition-[background-color,color,border-color,rotate,translate] duration-300',
                          isActive
                            ? 'border-accent bg-accent text-accent-ink'
                            : 'border-ink/25 text-ink hover:-translate-y-0.5 hover:border-ink',
                        )}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail */}
        <div
          id="stack-panel"
          role="tabpanel"
          aria-labelledby={`tab-${selected.id}`}
          className="mt-14 min-h-[30rem] border-t-2 border-ink pt-10"
        >
          <AnimatePresence mode="wait">
            <motion.article
              key={selected.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="grid grid-cols-12 gap-x-6 gap-y-10"
            >
              <div className="col-span-12 lg:col-span-7">
                <p className="label">{categoryLabel}</p>
                <h3 className="mt-3 font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.85]">{selected.name}</h3>
                <p className="mt-4 font-spray text-2xl text-accent md:text-3xl">{selected.tagline}</p>
                <p className="mt-6 max-w-[58ch] text-lg leading-relaxed">{selected.description}</p>
                <p className="mt-8 font-mono text-xs text-ink-faint">{selected.tags.join('  ·  ')}</p>
              </div>

              <div className="col-span-12 grid content-start gap-8 lg:col-span-5">
                <div>
                  <p className="label mb-3 border-b-2 border-ink pb-2 !text-ink">Where I use it</p>
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
                  <p className="label mb-3 border-b-2 border-ink pb-2 !text-ink">Exploring now</p>
                  <ul className="space-y-2 text-ink-muted">
                    {selected.exploring.map((e) => (
                      <li key={e} className="flex gap-3">
                        <span className="font-mono" aria-hidden>~</span>
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
                <blockquote className="flood -rotate-1 px-6 py-5 text-xl font-semibold leading-snug">
                  {selected.practicalInsight}
                </blockquote>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
