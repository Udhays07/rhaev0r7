import type { ReactNode } from 'react';
import { RevealLines } from './RevealLines';
import { Spray } from './Spray';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  /** The wall tag sprayed behind the heading. */
  spray: string;
  title: ReactNode[];
  intro?: ReactNode;
  align?: 'center' | 'left';
}

/**
 * A section opens like a poster on a wall: a huge sprayed tag behind,
 * the heading pasted over it in heavy type.
 */
export function SectionHeader({ spray, title, intro, align = 'center' }: SectionHeaderProps) {
  const center = align === 'center';
  return (
    <header className={cn('relative isolate mb-16 py-[clamp(3rem,9vw,8rem)] md:mb-24', center && 'text-center')}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-visible">
        <Spray size="clamp(7rem,24vw,22rem)" className="static">
          {spray}
        </Spray>
      </div>
      <RevealLines
        lines={title}
        className={cn(
          'font-display text-[clamp(2.6rem,7.4vw,7rem)] leading-[0.88]',
          center && '[&>span]:mx-auto',
        )}
      />
      {intro && (
        <p className={cn('mt-8 max-w-[56ch] text-lg leading-relaxed text-ink-muted md:text-xl', center && 'mx-auto')}>{intro}</p>
      )}
    </header>
  );
}
