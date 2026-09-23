import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search, Send, Sparkles, Trash2 } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ARCHITECTURE_COMPONENTS } from '@/data/portfolioData';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { ArchitectureNodeId } from '@/types';
import { cn, EASE_OUT_EXPO } from '@/lib/utils';

type Mode = 'experience' | 'engineering';
type Point = { x: number; y: number };

const LAYOUTS: Record<'wide' | 'narrow', { w: number; h: number; nodes: Record<ArchitectureNodeId, Point> }> = {
  wide: {
    w: 1000,
    h: 400,
    nodes: {
      client: { x: 100, y: 200 },
      api: { x: 330, y: 200 },
      services: { x: 560, y: 200 },
      cache: { x: 860, y: 70 },
      database: { x: 860, y: 200 },
      vector: { x: 860, y: 330 },
    },
  },
  narrow: {
    w: 360,
    h: 620,
    nodes: {
      client: { x: 180, y: 50 },
      api: { x: 180, y: 170 },
      services: { x: 180, y: 300 },
      cache: { x: 62, y: 450 },
      database: { x: 180, y: 570 },
      vector: { x: 298, y: 450 },
    },
  },
};

const EDGES: [ArchitectureNodeId, ArchitectureNodeId][] = [
  ['client', 'api'],
  ['api', 'services'],
  ['services', 'cache'],
  ['services', 'database'],
  ['services', 'vector'],
];

interface Hop {
  to: ArchitectureNodeId;
  log: string;
}

const LOOKUP_KEY = 'questions:search:binary-trees';

function scenario(kind: 'search' | 'semantic', cacheWarm: boolean): Hop[] {
  const start: Hop[] = [
    { to: 'client', log: kind === 'search' ? 'GET /questions?q=binary+trees' : 'GET /questions/similar?q=balanced+bst' },
    { to: 'api', log: 'token verified · query validated' },
    { to: 'services', log: 'QuestionService.search()' },
  ];
  const back: Hop[] = [
    { to: 'services', log: 'map rows → response model' },
    { to: 'api', log: '200 OK' },
  ];
  if (kind === 'semantic') {
    return [
      ...start,
      { to: 'vector', log: 'embed query → top-5 by cosine (HNSW)' },
      { to: 'services', log: '5 ids, scores ≥ 0.78' },
      { to: 'database', log: 'SELECT … WHERE id = ANY($1)' },
      ...back,
      { to: 'client', log: 'rendered 5 similar questions · 61 ms' },
    ];
  }
  if (cacheWarm) {
    return [
      ...start,
      { to: 'cache', log: `GET ${LOOKUP_KEY} → HIT` },
      ...back,
      { to: 'client', log: 'rendered 12 results · 4 ms' },
    ];
  }
  return [
    ...start,
    { to: 'cache', log: `GET ${LOOKUP_KEY} → MISS` },
    { to: 'services', log: 'fall through to the database' },
    { to: 'database', log: 'SELECT … WHERE search @@ to_tsquery($1) · 18 ms' },
    { to: 'services', log: '12 rows' },
    { to: 'cache', log: `SET ${LOOKUP_KEY} EX 300` },
    ...back,
    { to: 'client', log: 'rendered 12 results · 26 ms' },
  ];
}

const HOP_MS = 650;

function ExperienceView() {
  const results = [
    { q: 'Insert a key into a binary search tree and keep it valid.', tags: ['Medium', 'Trees'], used: 34 },
    { q: 'What is the worst-case lookup time in an unbalanced BST?', tags: ['Easy', 'Complexity'], used: 58 },
    { q: 'Explain why AVL rotations keep height logarithmic.', tags: ['Hard', 'Trees'], used: 12 },
  ];
  return (
    <div className="mx-auto max-w-3xl border border-line bg-bg-raised shadow-[0_40px_80px_-40px_rgb(0_0_0/0.5)]">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="font-display text-lg">Question bank</span>
        <span className="hidden font-mono text-xs text-ink-faint sm:inline">Course · Data Structures</span>
      </div>
      <div className="p-5 md:p-8">
        <div className="flex items-center gap-3 border border-line-strong bg-bg px-4 py-3">
          <Search size={16} className="text-ink-faint" aria-hidden />
          <span className="flex-1">binary trees</span>
          <span className="hidden font-mono text-xs text-ink-faint sm:inline">12 results · 26 ms</span>
        </div>
        <ul className="mt-6">
          {results.map((r, i) => (
            <motion.li
              key={r.q}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: EASE_OUT_EXPO }}
              className="flex items-start justify-between gap-6 border-b border-line py-4"
            >
              <div>
                <p>{r.q}</p>
                <p className="mt-2 flex gap-2">
                  {r.tags.map((t) => (
                    <span key={t} className="rounded-full border border-line-strong px-2 py-0.5 text-xs text-ink-muted">
                      {t}
                    </span>
                  ))}
                </p>
              </div>
              <span className="shrink-0 font-mono text-xs text-ink-faint">used {r.used}×</span>
            </motion.li>
          ))}
        </ul>
        <p className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
          <Sparkles size={14} className="text-accent" aria-hidden /> 3 similar questions found in other courses
        </p>
      </div>
    </div>
  );
}

function EngineeringView() {
  const wide = useMediaQuery('(min-width: 768px)');
  const layout = LAYOUTS[wide ? 'wide' : 'narrow'];
  const [selected, setSelected] = useState<ArchitectureNodeId>('services');
  const [packet, setPacket] = useState<ArchitectureNodeId | null>(null);
  const [trail, setTrail] = useState<string[]>([]);
  const [log, setLog] = useState<{ node: ArchitectureNodeId; text: string }[]>([]);
  const [cacheWarm, setCacheWarm] = useState(false);
  const [running, setRunning] = useState(false);
  const runId = useRef(0);
  const logEnd = useRef<HTMLOListElement>(null);

  useEffect(() => () => void (runId.current += 1), []);
  useEffect(() => {
    logEnd.current?.scrollTo({ top: logEnd.current.scrollHeight, behavior: 'smooth' });
  }, [log]);

  const run = async (kind: 'search' | 'semantic') => {
    const id = ++runId.current;
    const hops = scenario(kind, cacheWarm);
    setRunning(true);
    setLog([]);
    setTrail([]);
    let prev: ArchitectureNodeId | null = null;
    for (const hop of hops) {
      if (runId.current !== id) return;
      setPacket(hop.to);
      if (prev) {
        const edge: string = [prev, hop.to].sort().join('-');
        setTrail((t) => [...t, edge]);
      }
      setLog((l) => [...l, { node: hop.to, text: hop.log }]);
      prev = hop.to;
      await new Promise((r) => setTimeout(r, HOP_MS));
    }
    if (runId.current !== id) return;
    if (kind === 'search') setCacheWarm(true);
    setRunning(false);
    setPacket(null);
  };

  const comp = ARCHITECTURE_COMPONENTS.find((c) => c.id === selected)!;
  const pct = (p: Point) => ({ left: `${(p.x / layout.w) * 100}%`, top: `${(p.y / layout.h) * 100}%` });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={running}
          onClick={() => run('search')}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-bg transition-colors hover:bg-accent hover:text-accent-ink disabled:opacity-40"
        >
          <Send size={14} /> {cacheWarm ? 'Search again' : 'Send a search'}
        </button>
        <button
          type="button"
          disabled={running}
          onClick={() => run('semantic')}
          className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm transition-colors hover:border-ink disabled:opacity-40"
        >
          <Sparkles size={14} /> Find similar
        </button>
        <button
          type="button"
          disabled={running || !cacheWarm}
          onClick={() => setCacheWarm(false)}
          className="inline-flex items-center gap-2 px-2 py-2 text-sm text-ink-muted hover:text-ink disabled:opacity-40"
        >
          <Trash2 size={14} /> Flush cache
        </button>
        <span className="font-mono text-xs text-ink-faint sm:ml-auto">cache: {cacheWarm ? 'warm' : 'cold'}</span>
      </div>

      {/* Diagram */}
      <div className="relative w-full border border-line bg-bg-sunken" style={{ aspectRatio: `${layout.w} / ${layout.h}` }}>
        <svg viewBox={`0 0 ${layout.w} ${layout.h}`} className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="var(--line-strong)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" opacity="0.5" />
          {EDGES.map(([a, b]) => {
            const pa = layout.nodes[a];
            const pb = layout.nodes[b];
            const key = [a, b].sort().join('-');
            const lit = trail.includes(key);
            const midX = (pa.x + pb.x) / 2;
            const d = wide
              ? `M${pa.x},${pa.y} C${midX},${pa.y} ${midX},${pb.y} ${pb.x},${pb.y}`
              : `M${pa.x},${pa.y} C${pa.x},${(pa.y + pb.y) / 2} ${pb.x},${(pa.y + pb.y) / 2} ${pb.x},${pb.y}`;
            return (
              <g key={key}>
                <path d={d} fill="none" stroke="var(--line-strong)" strokeWidth="1" />
                <motion.path
                  d={d}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  initial={false}
                  animate={{ pathLength: lit ? 1 : 0, opacity: lit ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                />
              </g>
            );
          })}
        </svg>

        {ARCHITECTURE_COMPONENTS.map((c) => {
          const here = packet === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelected(c.id)}
              aria-pressed={selected === c.id}
              style={pct(layout.nodes[c.id])}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-1/2 border bg-bg px-3 py-2 text-left transition-[border-color,box-shadow,transform] duration-300 md:px-4 md:py-3',
                selected === c.id ? 'border-ink' : 'border-line-strong hover:border-ink-muted',
                here && 'border-accent shadow-[0_0_0_4px_var(--accent-soft)] scale-105',
              )}
            >
              <span className="block text-sm font-medium md:text-base">{c.short}</span>
              <span className="block font-mono text-[10px] text-ink-faint md:text-[11px]">{c.kind}</span>
            </button>
          );
        })}

        <AnimatePresence>
          {packet && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
              initial={{ opacity: 0, scale: 0, ...pct(layout.nodes[packet]) }}
              animate={{ opacity: 1, scale: 1, ...pct(layout.nodes[packet]) }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: HOP_MS / 1000 - 0.1, ease: EASE_OUT_EXPO }}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 grid grid-cols-12 gap-x-8 gap-y-10">
        {/* Inspector */}
        <div className="col-span-12 lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            >
              <p className="label">{comp.kind}</p>
              <h3 className="mt-2 font-display text-4xl font-[360]">{comp.name}</h3>
              <dl className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="label mb-2">Responsibility</dt>
                  <dd>{comp.responsibility}</dd>
                </div>
                <div>
                  <dt className="label mb-2">Trade-off</dt>
                  <dd className="text-ink-muted">{comp.tradeoffs}</dd>
                </div>
              </dl>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-muted">
                {comp.keyPractices.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-accent" aria-hidden>+</span>
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Request log */}
        <div className="col-span-12 lg:col-span-5">
          <p className="label mb-2">Request log</p>
          <ol
            ref={logEnd}
            aria-live="polite"
            className="h-64 overflow-y-auto overscroll-contain border border-line bg-bg-sunken p-4 font-mono text-[11px] leading-6 md:text-xs"
            data-lenis-prevent
          >
            {log.length === 0 && <li className="text-ink-faint">Send a request to trace it through the system.</li>}
            {log.map((l, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                <span className="w-6 shrink-0 tabular-nums text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
                <span className="w-14 shrink-0 text-accent md:w-16">{l.node}</span>
                <span className="text-ink-muted">{l.text}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export function Systems() {
  const [mode, setMode] = useState<Mode>('experience');

  return (
    <section id="systems" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeader
          index="04"
          label="Systems"
          title={['What it looks like,', <>and how it <em className="italic text-accent">works.</em></>]}
          intro="The same feature, two ways. Switch to engineering to see the architecture underneath — then send a request through it."
        />

        <div role="group" aria-label="View" className="mb-10 inline-flex rounded-full border border-line-strong p-1">
          {(['experience', 'engineering'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={cn('relative rounded-full px-5 py-2 text-sm capitalize transition-colors', mode === m ? 'text-bg' : 'text-ink-muted hover:text-ink')}
            >
              {mode === m && (
                <motion.span layoutId="mode-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
              )}
              <span className="relative">{m}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.985 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.985 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          >
            {mode === 'experience' ? <ExperienceView /> : <EngineeringView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
