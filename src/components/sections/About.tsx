import { SectionHeader } from '@/components/ui/SectionHeader';
import { APPROACH, BUILD_INTERESTS } from '@/data/portfolioData';

export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-[clamp(4rem,10vw,8rem)]">
      <div className="container-page">
        <SectionHeader
          spray="USEFUL"
          title={['Good software is', <>more than code</>, <>that <em>works.</em></>]}
          intro="I don’t want to be someone who only builds what is visible on the screen. I want to understand the system behind it, the decisions that shape it, and how the pieces fit together."
        />

        {/* What good software should be: each quality is a strip that floods when you point at it. */}
        <ul className="border-b-2 border-ink">
          {APPROACH.map((a) => (
            <li key={a.title} className="group relative isolate overflow-hidden border-t-2 border-ink">
              <span
                aria-hidden
                className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-[var(--flood)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100"
              />
              <div className="grid grid-cols-12 items-center gap-x-6 gap-y-2 py-5 transition-colors duration-300 group-hover:text-[var(--flood-ink)] md:py-6">
                <p className="col-span-12 font-display text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.85] md:col-span-7">{a.title}</p>
                <p className="col-span-12 max-w-[42ch] text-lg leading-snug md:col-span-5">{a.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Things I enjoy building, taped to the wall. */}
        <div className="mt-[clamp(5rem,10vw,8rem)]">
          <h3 className="font-display text-[clamp(2rem,4.4vw,3.8rem)] leading-[0.9]">
            Things I enjoy <em>building</em>
          </h3>
          <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {BUILD_INTERESTS.map((b, i) => (
              <li key={b.title}>
                <p className="tape" style={{ ['--tilt' as string]: `${i % 2 ? 1.5 : -2}deg` }}>
                  {b.title}
                </p>
                <p className="mt-4 max-w-[34ch] text-lg leading-snug text-ink-muted">{b.desc}</p>
              </li>
            ))}
            <li className="flex items-end">
              <p className="max-w-[26ch] font-spray text-2xl leading-tight text-accent">
                The common thread: turning an idea into something people can actually use.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
