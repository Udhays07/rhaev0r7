import { motion, type HTMLMotionProps } from 'motion/react';
import { EASE_OUT_EXPO } from '@/lib/utils';

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number;
  y?: number;
  /** Render as a list item so lists stay valid markup. */
  as?: 'div' | 'li';
};

/** Fades and lifts content into place the first time it scrolls into view. */
export function Reveal({ delay = 0, y = 24, as = 'div', children, ...rest }: RevealProps) {
  const Comp = (as === 'li' ? motion.li : motion.div) as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT_EXPO }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
