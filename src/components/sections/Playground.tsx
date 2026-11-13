import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SimilaritySearch } from '@/components/playground/SimilaritySearch';
import { RagPipeline } from '@/components/playground/RagPipeline';
import { TokenLab } from '@/components/playground/TokenLab';
import { cn, EASE_OUT_EXPO } from '@/lib/utils';

const EXPERIMENTS = [
  { id: 'similarity', title: 'Similarity search', blurb: 'Embeddings and nearest neighbours' },
  { id: 'rag', title: 'RAG pipeline', blurb: 'Retrieval before generation' },
  { id: 'tokens', title: 'Token lab', blurb: 'Design systems, live' },
] as const;

type ExperimentId = (typeof EXPERIMENTS)[number]['id'];

export function Playground() {
  const [active, setActive] = useState<ExperimentId>('similarity');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + EXPERIMENTS.length) % EXPERIMENTS.length;
    setActive(EXPERIMENTS[next].id);
    tabs.current[next]?.focus();
  };

  return (
    <section id="playground" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeader
          spray="PLAYGROUND"
          title={['Small experiments,', <>not <em>screenshots.</em></>]}
          intro="Things I have explored, shrunk down to something you can poke at. Each one runs entirely in your browser."
        />

        <div role="tablist" aria-label="Experiments" className="grid grid-cols-3 border-y border-line">
          {EXPERIMENTS.map((x, i) => (
            <button
              key={x.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`exp-tab-${x.id}`}
              aria-selected={active === x.id}
              aria-controls={`exp-panel-${x.id}`}
              tabIndex={active === x.id ? 0 : -1}
              onClick={() => setActive(x.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                'group relative py-5 pr-4 text-left transition-colors',
                i > 0 && 'border-l border-line pl-4 md:pl-6',
                active === x.id ? 'text-ink' : 'text-ink-faint hover:text-ink-muted',
              )}
            >
              <span className="font-mono text-xs">0{i + 1}</span>
              <span className="block font-display text-xl leading-tight md:text-3xl">{x.title}</span>
              <span className="mt-1 hidden text-sm text-ink-muted md:block">{x.blurb}</span>
              {active === x.id && (
                <motion.span
                  layoutId="exp-underline"
                  className="absolute inset-x-0 -bottom-px h-[2px] bg-accent"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="pt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              id={`exp-panel-${active}`}
              role="tabpanel"
              aria-labelledby={`exp-tab-${active}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            >
              {active === 'similarity' && <SimilaritySearch />}
              {active === 'rag' && <RagPipeline />}
              {active === 'tokens' && <TokenLab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
