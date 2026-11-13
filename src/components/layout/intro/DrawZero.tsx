import { PERSONAL_INFO } from '@/data/portfolioData';

/** 0→1 within [a, b] of the overall progress. */
const seg = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
const easeOut = (u: number) => 1 - Math.pow(1 - u, 3);
/** A little overshoot for things that pop into place. */
const pop = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : 1 + 2.2 * Math.pow(u - 1, 3) + 1.2 * Math.pow(u - 1, 2));

/**
 * "Draw the zero": the 0 from rhaev0r7 strokes itself on, fills with
 * Zero's orange, the slash swipes through and becomes the shades, feet
 * and eyes pop in, and the name sets underneath. The drawing is the progress.
 */
export function DrawZero({ progress: p }: { progress: number }) {
  const ring = easeOut(seg(p, 0.02, 0.4)); // the outline of the 0
  const fill = seg(p, 0.36, 0.52); // orange floods in
  const slash = easeOut(seg(p, 0.48, 0.64)); // the slash swipes through
  const feet = pop(seg(p, 0.6, 0.72));
  const eyes = pop(seg(p, 0.7, 0.8));
  const blink = p > 0.88 && p < 0.92 ? 0.1 : 1;
  const antenna = pop(seg(p, 0.78, 0.88));
  const name = easeOut(seg(p, 0.3, 0.75));
  const line = easeOut(seg(p, 0.55, 0.9));

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[clamp(1.5rem,4vh,3rem)] px-5">
      <svg viewBox="0 0 220 270" className="h-[min(48vh,64vw)] w-auto overflow-visible">
        {/* Antenna: the terminal cursor. */}
        <rect
          x="102"
          y="2"
          width="16"
          height="28"
          rx="3"
          fill="var(--ink)"
          style={{ transformOrigin: '110px 30px', transform: `scaleY(${antenna})` }}
        />

        {/* Feet. */}
        {[72, 148].map((cx) => (
          <ellipse
            key={cx}
            cx={cx}
            cy="252"
            rx="28"
            ry="15"
            fill="#0c0c0e"
            stroke="var(--ink)"
            strokeWidth="3"
            style={{ transformOrigin: `${cx}px 252px`, transform: `scale(${feet})` }}
          />
        ))}

        {/* The 0: orange fill floods in behind a drawn outline. */}
        <ellipse cx="110" cy="138" rx="80" ry="102" fill="var(--zero)" opacity={fill} />
        <ellipse cx="84" cy="96" rx="20" ry="30" fill="#ffffff" opacity={fill * 0.25} />
        {/* Drawn from the top, clockwise, like a pen making a 0. */}
        <path
          d="M110 36 A80 102 0 1 1 109.99 36"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="9"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - ring}
        />

        {/* The slash, drawn through the 0 like the one in the handle; it becomes the shades.
            An ink edge underneath keeps it visible on the black night background. */}
        <line
          x1="18"
          y1="176"
          x2="202"
          y2="96"
          stroke="var(--ink)"
          strokeWidth="54"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - slash}
        />
        <line
          x1="18"
          y1="176"
          x2="202"
          y2="96"
          stroke="#0c0c0e"
          strokeWidth="46"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - slash}
        />
        <line
          x1="40"
          y1="160"
          x2="186"
          y2="97"
          stroke="#ffffff"
          strokeOpacity="0.22"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - slash}
        />

        {/* Eyes, behind the shades. */}
        {[
          [76, 150],
          [142, 122],
        ].map(([cx, cy]) => (
          <rect
            key={cx}
            x={cx - 8}
            y={cy - 13}
            width="16"
            height="26"
            rx="8"
            fill="#fff3e8"
            style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(-23deg) scale(${eyes}, ${eyes * blink})` }}
          />
        ))}
      </svg>

      <div className="text-center">
        <p className="overflow-hidden font-display text-[clamp(2.4rem,7vw,6rem)] leading-[0.9]">
          <span className="inline-block" style={{ transform: `translateY(${(1 - name) * 105}%)` }}>
            {PERSONAL_INFO.name}
          </span>
        </p>
        <div className="mx-auto mt-4 h-[3px] w-[min(70vw,26rem)] bg-line">
          <div className="h-full origin-left bg-accent" style={{ transform: `scaleX(${line})` }} />
        </div>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-ink-muted" style={{ opacity: line }}>
          {PERSONAL_INFO.role} · India
        </p>
      </div>
    </div>
  );
}
