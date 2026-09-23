import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { RAG_SAMPLE } from '@/data/portfolioData';
import { cn, EASE_OUT_EXPO } from '@/lib/utils';

const STAGES = [
  { id: 'chunk', title: 'Chunk', note: 'Split the source into passages small enough to retrieve precisely.' },
  { id: 'embed', title: 'Embed', note: 'Turn every passage into a vector, once, ahead of time.' },
  { id: 'retrieve', title: 'Retrieve', note: 'Embed the question and pull the closest passages.' },
  { id: 'generate', title: 'Generate', note: 'Give the model only that context — and ask it to cite.' },
] as const;

const STEP_MS = 2600;

/** Deterministic pseudo-vector per chunk, just for display. */
function fakeVector(seed: string, n = 12) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return Array.from({ length: n }, (_, i) => {
    h = (h * 1103515245 + 12345 + i) >>> 0;
    return ((h % 2000) / 1000 - 1).toFixed(2);
  });
}

export function RagPipeline() {
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { chunks, question, topK, answer } = RAG_SAMPLE;
  const ranked = useMemo(() => [...chunks].sort((a, b) => b.score - a.score), [chunks]);
  const context = ranked.slice(0, topK);

  useEffect(() => {
    if (!playing) return;
    if (stage >= STAGES.length - 1) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setStage((s) => s + 1), STEP_MS);
    return () => window.clearTimeout(t);
  }, [playing, stage]);

  const run = () => {
    if (stage >= STAGES.length - 1) setStage(0);
    setPlaying((p) => !p);
  };

  return (
    <div>
      {/* Stage rail */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-[48ch] text-ink-muted">
          Question: <span className="font-display text-xl italic text-ink">“{question}”</span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={run}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-bg transition-colors hover:bg-accent hover:text-accent-ink"
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
            {playing ? 'Pause' : stage === STAGES.length - 1 ? 'Run again' : 'Run pipeline'}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setStage(0);
            }}
            aria-label="Reset pipeline"
            className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-ink-muted hover:text-ink"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      <ol className="relative mt-8 grid grid-cols-4 gap-2" aria-label="Pipeline stages">
        <span aria-hidden className="absolute left-0 right-0 top-[5px] h-px bg-line" />
        <motion.span
          aria-hidden
          className="absolute left-0 top-[5px] h-px bg-accent"
          animate={{ width: `${(stage / (STAGES.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        />
        {STAGES.map((s, i) => (
          <li key={s.id} className="relative">
            <button
              type="button"
              onClick={() => {
                setPlaying(false);
                setStage(i);
              }}
              aria-current={i === stage ? 'step' : undefined}
              className="group w-full pt-6 text-left"
            >
              <span
                aria-hidden
                className={cn(
                  'absolute top-0 h-[11px] w-[11px] rounded-full border transition-colors duration-500',
                  i <= stage ? 'border-accent bg-accent' : 'border-line-strong bg-bg',
                )}
              />
              <span className="font-mono text-xs text-ink-faint">0{i + 1}</span>
              <span className={cn('block text-lg transition-colors', i === stage ? 'text-ink' : 'text-ink-faint group-hover:text-ink-muted')}>
                {s.title}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-8 min-h-[26rem] border-t border-line pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          >
            <p className="mb-6 max-w-[56ch] text-ink-muted">{STAGES[stage].note}</p>

            {stage === 0 && (
              <ol className="grid gap-3 md:grid-cols-2">
                {chunks.map((c, i) => (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.5, ease: EASE_OUT_EXPO }}
                    className="border border-dashed border-line-strong p-4"
                  >
                    <span className="font-mono text-xs text-accent">{c.id}</span>
                    <p className="mt-1">{c.text}</p>
                  </motion.li>
                ))}
              </ol>
            )}

            {stage === 1 && (
              <ol className="space-y-2 font-mono text-xs md:text-sm">
                {chunks.map((c, i) => (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex gap-4 overflow-hidden border-b border-line pb-2 whitespace-nowrap"
                  >
                    <span className="text-accent">{c.id}</span>
                    <span className="text-ink-muted">[{fakeVector(c.id).join(', ')}, …]</span>
                  </motion.li>
                ))}
                <li className="pt-2 font-sans text-sm text-ink-faint">Illustrative values. Real embeddings have hundreds of dimensions.</li>
              </ol>
            )}

            {stage === 2 && (
              <ol>
                {ranked.map((c, i) => {
                  const hit = i < topK;
                  return (
                    <motion.li
                      key={c.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hit ? 1 : 0.4 }}
                      transition={{ delay: i * 0.08 }}
                      className="grid grid-cols-[3rem_1fr_3.5rem] items-center gap-3 border-b border-line py-3"
                    >
                      <span className="font-mono text-xs text-accent">{hit ? `#${i + 1}` : c.id}</span>
                      <span>{c.text}</span>
                      <span className="text-right font-mono text-sm tabular-nums">{c.score.toFixed(2)}</span>
                    </motion.li>
                  );
                })}
              </ol>
            )}

            {stage === 3 && (
              <div className="grid gap-6 lg:grid-cols-2">
                <pre className="overflow-x-auto whitespace-pre-wrap border border-line bg-bg-sunken p-5 font-mono text-xs leading-6 text-ink-muted md:text-[13px]">
                  <span className="text-ink-faint"># system{'\n'}</span>
                  Answer using only the context. Cite chunk ids.{'\n\n'}
                  <span className="text-ink-faint"># context{'\n'}</span>
                  {context.map((c) => (
                    <span key={c.id}>
                      <span className="text-accent">[{c.id}]</span> {c.text}
                      {'\n'}
                    </span>
                  ))}
                  {'\n'}
                  <span className="text-ink-faint"># question{'\n'}</span>
                  {question}
                </pre>
                <div>
                  <p className="label mb-3">Grounded answer</p>
                  <TypedText text={answer} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function TypedText({ text }: { text: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(text.length);
      return;
    }
    if (n >= text.length) return;
    const t = window.setTimeout(() => setN((x) => Math.min(text.length, x + 2)), 18);
    return () => window.clearTimeout(t);
  }, [n, text]);

  return (
    <p className="font-display text-2xl leading-snug" aria-label={text}>
      <span aria-hidden>
        {text.slice(0, n)}
        {n < text.length && <span className="ml-0.5 inline-block h-[0.9em] w-[0.45em] animate-pulse bg-accent align-middle" />}
      </span>
    </p>
  );
}
