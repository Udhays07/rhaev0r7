import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { JOURNEY } from '@/data/portfolioData';
import { useIntroDone } from '@/lib/intro';
import { Spray } from '@/components/ui/Spray';
import { LazyStackScene } from '@/components/three/Lazy';
import { cn } from '@/lib/utils';

const STATEMENT = 'I build products where technology, design and real-world problems meet.';
/** Words that carry the line, set in Zero's orange-on-ink tape once read. */
const KEY = new Set(['technology,', 'design', 'real-world']);

/** One word of the statement: it goes from muted to full ink as you read down. */
function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const color = useTransform(progress, range, ['var(--flood-muted)', 'var(--flood-ink)']);
  return (
    <motion.span style={{ color }} className={cn('inline-block', KEY.has(word) && 'underline decoration-[0.08em] underline-offset-[0.12em]')}>
      {word}&nbsp;
    </motion.span>
  );
}

export function Statement() {
  const introDone = useIntroDone();
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ['start start', 'end end'] });
  const words = STATEMENT.split(' ');

  return (
    <section id="statement" className="flood relative">
      {/* A tall track with a pinned stage: scrolling reads the line and opens the stack. */}
      <div ref={stage} className="relative h-[230vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Spray size="clamp(8rem,27vw,30rem)" tilt={7} className="static">
              DEEPER
            </Spray>
          </div>

          <h2 className="font-display container-page relative z-10 pt-[clamp(5.5rem,13vh,9rem)] text-center text-[clamp(2.3rem,6.4vw,6.4rem)] leading-[0.9]">
            <span className="sr-only">{STATEMENT}</span>
            <span aria-hidden>
              {words.map((w, i) => (
                <Word key={i} word={w} progress={scrollYProgress} range={[(i / words.length) * 0.45, ((i + 1) / words.length) * 0.45]} />
              ))}
            </span>
          </h2>

          {/* Interface → api → database → model: Zero goes one layer deeper as you scroll. */}
          <div className="relative mt-auto h-[54%] w-full">
            <LazyStackScene progress={scrollYProgress} ready={introDone} />
          </div>
        </div>
      </div>

      {/* The layers I work in, in the order I learned them. */}
      <div className="container-page pb-[clamp(5rem,12vw,10rem)]">
        <h3 className="label mb-6 !text-ink">The path so far</h3>
        <ol className="border-b-2 border-ink">
          {JOURNEY.map((j) => (
            <li key={j.title} className="group grid grid-cols-12 items-start gap-x-6 gap-y-4 border-t-2 border-ink py-8 md:py-10">
              <p className="col-span-12 font-display text-[clamp(2.4rem,6.6vw,6.2rem)] leading-[0.86] md:col-span-7">{j.title}</p>
              <div className="col-span-12 md:col-span-5 md:pt-2">
                <span className="tape tape-hot !min-h-0 !py-1.5 text-xs">{j.stage}</span>
                <p className="mt-4 max-w-[46ch] text-lg leading-snug">{j.summary}</p>
                <p className="mt-3 max-w-[46ch] font-mono text-sm text-ink-muted">// {j.takeaway}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
