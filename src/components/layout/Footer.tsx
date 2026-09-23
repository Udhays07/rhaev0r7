import { ArrowUp } from 'lucide-react';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { useLocalTime } from '@/hooks/useLocalTime';
import { Handle } from '@/components/ui/Handle';

export function Footer() {
  const time = useLocalTime();

  return (
    <footer className="overflow-hidden border-t border-line">
      <div className="container-page grid grid-cols-2 gap-y-6 py-10 text-sm md:grid-cols-4">
        <p className="col-span-2 md:col-span-1">
          <span className="font-display text-lg">{PERSONAL_INFO.name}</span>
          <span className="block text-ink-faint">
            aka <span className="font-mono text-ink-muted">{PERSONAL_INFO.nickname}</span> · © {new Date().getFullYear()}
          </span>
        </p>
        <p className="text-ink-muted">
          <span className="label mb-1 block">Local time</span>
          {time} IST
        </p>
        <p className="text-ink-muted">
          <span className="label mb-1 block">Built with</span>
          React, TypeScript, Tailwind, Motion, GSAP &amp; Lenis
        </p>
        <div className="col-span-2 flex items-end md:col-span-1 md:justify-end">
          <a href="#top" className="group inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ink">
            Back to top
            <span className="grid h-8 w-8 place-items-center rounded-full border border-line-strong transition-transform duration-500 group-hover:-translate-y-1">
              <ArrowUp size={14} strokeWidth={1.75} />
            </span>
          </a>
        </div>
      </div>

      {/* Signature wordmark — sized so the handle spans the page width. */}
      <div className="container-page pb-6 md:pb-10" aria-hidden>
        <Handle
          play="view"
          className="block select-none text-[clamp(4rem,19.5vw,17rem)] leading-[0.8] font-semibold tracking-[-0.06em] text-ink"
        />
      </div>
    </footer>
  );
}
