import { useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Loader } from '@/components/layout/Loader';
import { IntroContext } from '@/lib/intro';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Statement } from '@/components/sections/Statement';
import { SprayDefs } from '@/components/ui/Spray';
import { About } from '@/components/sections/About';
import { Stack } from '@/components/sections/Stack';
import { Thinking } from '@/components/sections/Thinking';
// Temporarily hidden — re-enable with the matching JSX below.
// import { Playground } from '@/components/sections/Playground';
// import { Systems } from '@/components/sections/Systems';
import { Principles } from '@/components/sections/Principles';
import { Direction } from '@/components/sections/Direction';
import { Connect } from '@/components/sections/Connect';

// Everyone gets the five-second intro; reduced-motion visitors see a still version.
const skipIntro = false;

export function App() {
  const [revealed, setRevealed] = useState(skipIntro);
  const [loaderGone, setLoaderGone] = useState(skipIntro);

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={revealed}>
      <SmoothScroll>
        {!loaderGone && <Loader onReveal={() => setRevealed(true)} onDone={() => setLoaderGone(true)} />}
        {/* The page can't take focus or be read underneath the opaque loader. */}
        <div inert={!revealed}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <SprayDefs />
        <div aria-hidden className="grain" />
        <Nav />
        <main id="main">
          <Hero />
          <Statement />
          <About />
          <Stack />
          <Thinking />
          {/* <Playground /> */}
          {/* <Systems /> */}
          <Principles />
          <Direction />
          <Connect />
        </main>
        <Footer />
        </div>
      </SmoothScroll>
      </IntroContext.Provider>
    </MotionConfig>
  );
}
