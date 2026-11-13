import { ArrowUp } from 'lucide-react';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { useLocalTime } from '@/hooks/useLocalTime';
import { Handle, HandleText } from '@/components/ui/Handle';

export function Footer() {
  const time = useLocalTime();

  return (
    <footer className="overflow-hidden">
      <div className="container-page grid grid-cols-2 gap-y-6 py-10 text-sm md:grid-cols-4">
        <p className="col-span-2 md:col-span-1">
          <span className="font-display text-2xl leading-none">{PERSONAL_INFO.name}</span>
          <span className="block text-ink-faint">
            aka <HandleText className="font-mono text-ink-muted" /> · © {new Date().getFullYear()}
          </span>
        </p>
        <p className="text-ink-muted">
          <span className="label mb-1 block">Local time</span>
          {time} IST
        </p>
        <p className="text-ink-muted">
          <span className="label mb-1 block">Built with</span>
          React, TypeScript, three.js, Tailwind, Motion, GSAP &amp; Lenis
        </p>
        <div className="col-span-2 flex items-end md:col-span-1 md:justify-end">
          <a href="#top" className="tape">
            Back to top
            <ArrowUp size={16} strokeWidth={2.5} />
          </a>
        </div>
      </div>

      {/* Signature wordmark — sized so the handle spans the page width. */}
      <div className="container-page pb-6 md:pb-10" aria-hidden>
        <Handle
          play="view"
          className="block select-none text-[clamp(4rem,20vw,18rem)] leading-[0.8] font-bold tracking-[-0.07em] text-ink"
        />
      </div>
    </footer>
  );
}
