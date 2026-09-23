import type { ReactNode } from 'react';
import { RevealLines } from './RevealLines';
import { Reveal } from './Reveal';

interface SectionHeaderProps {
  index: string;
  label: string;
  title: ReactNode[];
  intro?: ReactNode;
}

/**
 * Every section opens the same way: a numbered margin label on the left,
 * a serif headline on the right. The repetition is the system.
 */
export function SectionHeader({ index, label, title, intro }: SectionHeaderProps) {
  return (
    <header className="grid grid-cols-12 gap-x-6 gap-y-6 border-t border-line pt-6 mb-14 md:mb-20">
      <div className="col-span-12 md:col-span-3">
        <p className="label flex items-center gap-3">
          <span className="text-accent">{index}</span>
          <span aria-hidden className="h-px w-6 bg-line-strong" />
          <span>{label}</span>
        </p>
      </div>
      <div className="col-span-12 md:col-span-9">
        <RevealLines
          lines={title}
          className="text-[clamp(2.25rem,5.5vw,4.75rem)] leading-[0.98] font-[380] text-ink"
        />
        {intro && (
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-ink-muted">{intro}</p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
