import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

/**
 * The spray-paint filter used by every wall tag: marker strokes get a
 * rough edge and a soft overspray halo. Rendered once, near the root.
 */
export function SprayDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="pointer-events-none absolute">
      <defs>
        <filter id="spray" x="-10%" y="-25%" width="120%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feGaussianBlur in="rough" stdDeviation="9" result="halo" />
          <feComponentTransfer in="halo" result="overspray">
            <feFuncA type="linear" slope="0.6" />
          </feComponentTransfer>
          <feGaussianBlur in="rough" stdDeviation="0.9" result="core" />
          <feMerge>
            <feMergeNode in="overspray" />
            <feMergeNode in="core" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

interface SprayProps {
  children: string;
  className?: string;
  /** Font size, e.g. "28vw". */
  size: string;
  tilt?: number;
  /** Use the theme's hot spray colour instead of the dim wall tag. */
  hot?: boolean;
  style?: CSSProperties;
}

/** A huge graffiti word sprayed on the wall behind a section. Decorative only. */
export function Spray({ children, className, size, tilt = -6, hot, style }: SprayProps) {
  return (
    <span
      aria-hidden
      className={cn('spray absolute', hot && 'text-spray-hot', className)}
      style={{ fontSize: size, transform: `rotate(${tilt}deg)`, ...style }}
    >
      {children}
    </span>
  );
}
