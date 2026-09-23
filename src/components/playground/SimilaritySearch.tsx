import { lazy, Suspense, useDeferredValue, useMemo, useState, Component, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { cosine, embedQuery, PLAYGROUND_CORPUS, PRESET_QUERIES, VECTOR_DIMENSIONS } from '@/data/portfolioData';
import { normalise } from '@/lib/vectors';
import { cn } from '@/lib/utils';

const VectorSpace = lazy(() => import('./VectorSpace'));
const TOP_K = 3;

/** If WebGL is unavailable, keep the rest of the demo working. */
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return <p className="grid h-full place-items-center p-6 text-center text-sm text-ink-faint">3-d view needs WebGL — the ranking still works.</p>;
    }
    return this.props.children;
  }
}

export function SimilaritySearch() {
  const [query, setQuery] = useState(PRESET_QUERIES[0]);
  const deferred = useDeferredValue(query);
  const { vector, matched } = useMemo(() => embedQuery(deferred), [deferred]);

  const results = useMemo(() => {
    return PLAYGROUND_CORPUS.map((item) => ({ ...item, score: vector ? cosine(vector, item.vector) : 0 })).sort(
      (a, b) => b.score - a.score,
    );
  }, [vector]);

  const topIds = vector ? results.slice(0, TOP_K).map((r) => r.id) : [];
  const unit = vector ? normalise(vector) : null;

  return (
    <div className="grid grid-cols-12 gap-x-8 gap-y-10">
      <div className="col-span-12 lg:col-span-7">
        {/* 1. Query */}
        <label htmlFor="sim-query" className="label mb-3 flex items-center gap-3">
          <span className="text-accent">1</span> Query
        </label>
        <div className="flex items-center gap-3 border-b-2 border-ink pb-3 focus-within:border-accent transition-colors">
          <Search size={20} strokeWidth={1.5} className="shrink-0 text-ink-faint" aria-hidden />
          <input
            id="sim-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything…"
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent font-display text-2xl outline-none placeholder:text-ink-faint md:text-3xl"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {PRESET_QUERIES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setQuery(p)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                p === query ? 'border-ink bg-ink text-bg' : 'border-line-strong text-ink-muted hover:border-ink hover:text-ink',
              )}
            >
              {p}
            </button>
          ))}
        </div>

        {/* 2. Embedding */}
        <p className="label mb-3 mt-10 flex items-center gap-3">
          <span className="text-accent">2</span> Embedding
          <span className="normal-case tracking-normal text-ink-faint">
            {matched.length ? `from: ${[...new Set(matched)].join(', ')}` : 'no known words yet'}
          </span>
        </p>
        <div className="grid grid-cols-5 gap-3" aria-label="Query vector">
          {VECTOR_DIMENSIONS.map((d, i) => (
            <div key={d}>
              <div className="relative h-16 overflow-hidden bg-bg-raised">
                <motion.div
                  className="absolute inset-x-0 bottom-0 bg-accent"
                  animate={{ height: `${(unit?.[i] ?? 0) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                />
              </div>
              <p className="mt-1.5 flex justify-between font-mono text-[11px] text-ink-faint">
                <span>{d}</span>
                <span className="tabular-nums">{(unit?.[i] ?? 0).toFixed(2)}</span>
              </p>
            </div>
          ))}
        </div>

        {/* 3. Results */}
        <p className="label mb-3 mt-10 flex items-center gap-3">
          <span className="text-accent">3</span> Nearest neighbours
          <span className="normal-case tracking-normal text-ink-faint">cosine similarity, top {TOP_K} retrieved</span>
        </p>
        <ol aria-live="polite">
          {results.map((r, i) => {
            const retrieved = i < TOP_K && vector;
            return (
              <motion.li
                key={r.id}
                layout
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                className={cn('grid grid-cols-[2rem_1fr_auto] items-center gap-x-3 border-b border-line py-3', !retrieved && 'text-ink-faint')}
              >
                <span className="font-mono text-xs">{retrieved ? `#${i + 1}` : ''}</span>
                <span>
                  <span className={cn('block', retrieved ? 'text-ink' : '')}>{r.text}</span>
                  <span className="mt-1.5 block h-px w-full bg-line">
                    <motion.span
                      className={cn('block h-px', retrieved ? 'bg-accent' : 'bg-ink-faint')}
                      animate={{ width: `${Math.max(0, r.score) * 100}%` }}
                      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                    />
                  </span>
                </span>
                <span className="font-mono text-sm tabular-nums">{r.score.toFixed(2)}</span>
              </motion.li>
            );
          })}
        </ol>
      </div>

      <div className="col-span-12 lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <p className="label mb-3">Vector space · drag to rotate</p>
          <div className="aspect-square w-full border border-line bg-bg-sunken">
            <CanvasBoundary>
              <Suspense fallback={<p className="grid h-full place-items-center text-sm text-ink-faint">Loading space…</p>}>
                <VectorSpace corpus={PLAYGROUND_CORPUS} query={vector} topIds={topIds} />
              </Suspense>
            </CanvasBoundary>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-faint">
            Honest footnote: these are hand-made 5-dimensional vectors, projected to 3-d so you can see them. A real
            embedding model produces hundreds of dimensions — but the idea is the same. Questions that mean similar
            things end up close together, even when they share no words.
          </p>
        </div>
      </div>
    </div>
  );
}
