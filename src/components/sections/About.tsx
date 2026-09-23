import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/Reveal';
import { APPROACH, BUILD_INTERESTS, JOURNEY } from '@/data/portfolioData';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

function Journey() {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(0);

  // The rule fills as you read across; each phase lights up as the fill passes it.
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReached(JOURNEY.length);
      return;
    }
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        gsap.fromTo(line.current, { scaleX: 0 }, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 80%',
            end: 'bottom 55%',
            scrub: 0.6,
            onUpdate: (self) => setReached(Math.min(JOURNEY.length, Math.floor(self.progress * JOURNEY.length + 0.35))),
          },
        });
      });
      mm.add('(max-width: 767px)', () => {
        gsap.fromTo(line.current, { scaleY: 0 }, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 75%',
            end: 'bottom 60%',
            scrub: 0.6,
            onUpdate: (self) => setReached(Math.min(JOURNEY.length, Math.floor(self.progress * JOURNEY.length + 0.35))),
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative">
      {/* Track: horizontal on desktop, vertical on mobile. */}
      <div aria-hidden className="absolute left-[5px] top-0 bottom-0 w-px bg-line md:left-0 md:right-0 md:top-[5px] md:bottom-auto md:h-px md:w-auto">
        <div ref={line} className="h-full w-full origin-top bg-accent md:origin-left" />
      </div>

      <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
        {JOURNEY.map((j, i) => {
          const on = i < reached;
          return (
            <li key={j.title} className="relative pl-8 md:pl-0 md:pt-10">
              <span
                aria-hidden
                className={cn(
                  'absolute left-0 top-1 h-[11px] w-[11px] rounded-full border transition-colors duration-500 md:top-0',
                  on ? 'border-accent bg-accent' : 'border-line-strong bg-bg',
                )}
              />
              <p className={cn('label transition-colors duration-500', on && 'text-accent')}>{j.stage}</p>
              <h4 className="mt-2 text-xl font-medium">{j.title}</h4>
              <p className="mt-2 text-ink-muted">{j.summary}</p>
              <p className="mt-4 font-display text-lg italic leading-snug text-ink">“{j.takeaway}”</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeader
          index="01"
          label="About"
          title={['Good software is more', <>than code that <em className="italic text-accent">works.</em></>]}
          intro="I don’t want to be someone who only builds what is visible on the screen. I want to understand the system behind it, the decisions that shape it, and how the pieces fit together."
        />

        {/* What good software should be */}
        <div className="grid grid-cols-12 gap-x-6">
          <p className="label col-span-12 mb-6 md:col-span-3 md:mb-0 md:pt-4">It should be</p>
          <ol className="col-span-12 md:col-span-9">
            {APPROACH.map((a, i) => (
              <Reveal as="li" key={a.title} delay={i * 0.05} y={16} className="group grid grid-cols-12 items-baseline gap-x-4 border-b border-line py-5 md:py-6">
                  <span className="col-span-2 font-mono text-xs text-ink-faint md:col-span-1">0{i + 1}</span>
                  <span className="col-span-10 font-display text-[clamp(1.9rem,4vw,3.25rem)] leading-none font-[360] transition-[color,transform] duration-500 group-hover:translate-x-2 group-hover:text-accent md:col-span-5">
                    {a.title}
                  </span>
                  <span className="col-span-10 col-start-3 mt-3 max-w-[42ch] text-ink-muted transition-colors duration-500 group-hover:text-ink md:col-span-6 md:col-start-auto md:mt-0">
                    {a.desc}
                  </span>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Journey */}
        <div className="mt-28 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-40">
          <div className="col-span-12 md:col-span-3">
            <p className="label">The path so far</p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <Reveal>
              <p className="mb-14 max-w-[36ch] font-display text-3xl leading-tight font-[360] md:text-4xl">
                I started with interfaces. Along the way I got curious about what happens after the request leaves the browser.
              </p>
            </Reveal>
            <Journey />
          </div>
        </div>

        {/* Things I enjoy building */}
        <div className="mt-28 grid grid-cols-12 gap-x-6 gap-y-8 md:mt-40">
          <div className="col-span-12 md:col-span-3">
            <p className="label">Things I enjoy building</p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <ul className="grid gap-x-10 sm:grid-cols-2">
              {BUILD_INTERESTS.map((b, i) => (
                <Reveal as="li" key={b.title} delay={(i % 2) * 0.06} y={12} className="flex gap-4 border-t border-line py-5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    <div>
                      <h4 className="font-medium">{b.title}</h4>
                      <p className="text-ink-muted">{b.desc}</p>
                    </div>
                </Reveal>
              ))}
            </ul>
            <Reveal>
              <p className="mt-12 max-w-[40ch] font-display text-2xl italic leading-snug text-ink">
                The common thread: I enjoy turning an idea into something people can actually use.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
