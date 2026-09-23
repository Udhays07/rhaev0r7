import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'motion/react';
import { cn, EASE_OUT_EXPO } from '@/lib/utils';

interface RevealLinesProps {
  lines: ReactNode[];
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  delay?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
  /** Explicit control; overrides both `immediate` and in-view detection. */
  play?: boolean;
}

/**
 * Masked line-by-line reveal. Lines are passed explicitly so breaks are
 * authored, not left to the browser — headlines should wrap on purpose.
 *
 * Visibility is observed on the heading, not on each line: a line starts
 * translated out of its overflow mask, so observing it directly would
 * never report it as visible.
 */
export function RevealLines({ lines, as: Tag = 'h2', className, delay = 0, immediate, play }: RevealLinesProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const show = play ?? (immediate || inView);

  return (
    <Tag ref={ref} className={cn('font-display', className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="block"
            initial={{ y: '105%' }}
            animate={{ y: show ? '0%' : '105%' }}
            transition={{ duration: 1.1, delay: delay + i * 0.08, ease: EASE_OUT_EXPO }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
