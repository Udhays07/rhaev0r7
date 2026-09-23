import { useMemo, useState, type CSSProperties } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

const SCALES = [
  { label: 'Minor third', ratio: 1.2 },
  { label: 'Major third', ratio: 1.25 },
  { label: 'Perfect fourth', ratio: 1.333 },
];
const DENSITY = [
  { label: 'Compact', unit: 3 },
  { label: 'Regular', unit: 4 },
  { label: 'Roomy', unit: 5 },
];
const FACES = [
  { label: 'Serif', value: '"Fraunces Variable", Georgia, serif' },
  { label: 'Sans', value: '"Geist Variable", system-ui, sans-serif' },
  { label: 'Mono', value: '"Geist Mono Variable", ui-monospace, monospace' },
];

function Segmented<T>({ options, value, onChange, label, getLabel }: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  getLabel: (v: T) => string;
}) {
  return (
    <fieldset>
      <legend className="label mb-2">{label}</legend>
      <div className="inline-flex rounded-full border border-line-strong p-0.5">
        {options.map((o) => (
          <button
            key={getLabel(o)}
            type="button"
            aria-pressed={o === value}
            onClick={() => onChange(o)}
            className={cn('rounded-full px-3 py-1 text-sm transition-colors', o === value ? 'bg-ink text-bg' : 'text-ink-muted hover:text-ink')}
          >
            {getLabel(o)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function TokenLab() {
  const [hue, setHue] = useState(38);
  const [radius, setRadius] = useState(10);
  const [scale, setScale] = useState(SCALES[1]);
  const [density, setDensity] = useState(DENSITY[1]);
  const [face, setFace] = useState(FACES[0]);
  const [copied, setCopied] = useState(false);

  const tokens = useMemo(() => {
    const step = (n: number) => `${(Math.pow(scale.ratio, n)).toFixed(3)}rem`;
    return {
      '--color-accent': `oklch(0.68 0.19 ${hue})`,
      '--color-accent-contrast': `oklch(0.2 0.03 ${hue})`,
      '--radius': `${radius}px`,
      '--space-1': `${density.unit}px`,
      '--space-2': `${density.unit * 2}px`,
      '--space-4': `${density.unit * 4}px`,
      '--space-6': `${density.unit * 6}px`,
      '--text-sm': step(-1),
      '--text-base': step(0),
      '--text-xl': step(2),
      '--text-3xl': step(4),
      '--font-heading': face.value,
    };
  }, [hue, radius, scale, density, face]);

  const css = `:root {\n${Object.entries(tokens).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — the code is still selectable */
    }
  };

  const v = (name: keyof typeof tokens) => `var(${name})`;

  return (
    <div className="grid grid-cols-12 gap-x-8 gap-y-10">
      {/* Controls */}
      <div className="col-span-12 space-y-7 lg:col-span-4">
        <div>
          <label htmlFor="tok-hue" className="label mb-2 flex justify-between">
            <span>Accent hue</span>
            <span className="tabular-nums">{hue}°</span>
          </label>
          <input
            id="tok-hue"
            type="range"
            min={0}
            max={360}
            value={hue}
            onChange={(e) => setHue(+e.target.value)}
            className="h-2 w-full cursor-pointer appearance-none rounded-full"
            style={{
              background: 'linear-gradient(to right, oklch(0.68 0.19 0), oklch(0.68 0.19 60), oklch(0.68 0.19 120), oklch(0.68 0.19 180), oklch(0.68 0.19 240), oklch(0.68 0.19 300), oklch(0.68 0.19 360))',
            }}
          />
        </div>
        <div>
          <label htmlFor="tok-radius" className="label mb-2 flex justify-between">
            <span>Radius</span>
            <span className="tabular-nums">{radius}px</span>
          </label>
          <input id="tok-radius" type="range" min={0} max={28} value={radius} onChange={(e) => setRadius(+e.target.value)} className="w-full accent-[var(--accent)]" />
        </div>
        <Segmented label="Type scale" options={SCALES} value={scale} onChange={setScale} getLabel={(o) => o.label} />
        <Segmented label="Density" options={DENSITY} value={density} onChange={setDensity} getLabel={(o) => o.label} />
        <Segmented label="Heading face" options={FACES} value={face} onChange={setFace} getLabel={(o) => o.label} />
        <p className="text-sm text-ink-faint">
          Change a token, and every component that uses it follows. That is the whole point of a design system.
        </p>
      </div>

      <div className="col-span-12 grid gap-x-8 gap-y-10 lg:col-span-8 xl:grid-cols-[1.4fr_1fr]">
      {/* Preview */}
      <div>
        <p className="label mb-3">Components</p>
        <div
          style={tokens as CSSProperties}
          className="border border-line bg-bg-raised transition-all"
        >
          <div style={{ padding: v('--space-6') }}>
            <span
              className="inline-block font-mono uppercase tracking-wider"
              style={{
                fontSize: '0.7rem',
                background: `color-mix(in oklch, ${v('--color-accent')} 18%, transparent)`,
                color: v('--color-accent'),
                borderRadius: v('--radius'),
                padding: `${v('--space-1')} ${v('--space-2')}`,
              }}
            >
              New
            </span>
            <h4 style={{ fontFamily: v('--font-heading'), fontSize: v('--text-3xl'), lineHeight: 1.05, marginTop: v('--space-4') }}>
              Question bank
            </h4>
            <p className="text-ink-muted" style={{ fontSize: v('--text-base'), marginTop: v('--space-2') }}>
              Search, tag and reuse assessment questions across courses.
            </p>
            <div
              className="flex items-center border border-line-strong bg-bg"
              style={{ borderRadius: v('--radius'), marginTop: v('--space-6'), padding: v('--space-2'), gap: v('--space-2') }}
            >
              <span className="flex-1 text-ink-faint" style={{ fontSize: v('--text-sm'), paddingInline: v('--space-2') }}>
                binary search trees
              </span>
              <span
                className="font-medium"
                style={{
                  background: v('--color-accent'),
                  color: v('--color-accent-contrast'),
                  borderRadius: `calc(${v('--radius')} * 0.75)`,
                  padding: `${v('--space-2')} ${v('--space-4')}`,
                  fontSize: v('--text-sm'),
                }}
              >
                Search
              </span>
            </div>
            <div className="flex flex-wrap" style={{ gap: v('--space-2'), marginTop: v('--space-4') }}>
              {['Easy', 'Data structures', 'Python'].map((t) => (
                <span key={t} className="border border-line-strong text-ink-muted" style={{ borderRadius: v('--radius'), padding: `${v('--space-1')} ${v('--space-2')}`, fontSize: v('--text-sm') }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Output */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="label">tokens.css</p>
          <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
            {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="overflow-x-auto border border-line bg-bg-sunken p-4 font-mono text-[12px] leading-6 text-ink-muted">{css}</pre>
      </div>
      </div>
    </div>
  );
}
