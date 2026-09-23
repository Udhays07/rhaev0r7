import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { NAV_SECTIONS, PERSONAL_INFO } from '@/data/portfolioData';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useTheme } from '@/hooks/useTheme';
import { useIntroDone } from '@/lib/intro';
import { Handle } from '@/components/ui/Handle';
import { getLenis } from '@/lib/scroll';
import { cn, EASE_OUT_EXPO } from '@/lib/utils';

const SECTION_IDS = [...NAV_SECTIONS.map((s) => s.id), 'contact'];

export function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const { theme, toggle } = useTheme();
  const introDone = useIntroDone();

  // Tuck the bar away while reading downward; bring it back on any upward scroll.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 480 && y > prev + 4);
    if (y < prev - 4) setHidden(false);
  });

  useEffect(() => {
    const lenis = getLenis();
    if (menuOpen) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !menuOpen ? '-100%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      >
        <div
          className={cn(
            'transition-[background-color,border-color,backdrop-filter] duration-500',
            scrolled || menuOpen
              ? 'bg-bg/80 backdrop-blur-md border-b border-line'
              : 'bg-transparent border-b border-transparent',
          )}
        >
          <nav aria-label="Primary" className="container-page flex h-16 items-center justify-between gap-6">
            <a href="#top" className="group flex items-baseline gap-3" aria-label={`${PERSONAL_INFO.nickname} — ${PERSONAL_INFO.name}, back to top`}>
              <Handle play="mount" enabled={introDone} delay={500} className="text-[1.05rem] font-medium tracking-tight" />
              <span className="hidden font-display text-[0.95rem] italic text-ink-faint transition-colors group-hover:text-ink-muted sm:inline">
                {PERSONAL_INFO.name}
              </span>
            </a>

            <ul className="hidden items-center gap-1 lg:flex">
              {NAV_SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? 'true' : undefined}
                    className={cn(
                      'relative flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors',
                      active === s.id ? 'text-ink' : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {active === s.id && (
                      <motion.span
                        layoutId="nav-dot"
                        className="h-1.5 w-1.5 rounded-full bg-accent"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                className="grid h-11 w-11 place-items-center rounded-full text-ink-muted lg:h-9 lg:w-9 transition-colors hover:bg-bg-raised hover:text-ink"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {theme === 'dark' ? <Sun size={16} strokeWidth={1.75} /> : <Moon size={16} strokeWidth={1.75} />}
                  </motion.span>
                </AnimatePresence>
              </button>

              <a
                href="#contact"
                className="hidden rounded-full border border-line-strong px-4 py-1.5 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-bg sm:inline-block"
              >
                Get in touch
              </a>

              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="relative -mr-2 grid h-11 w-11 place-items-center rounded-full lg:hidden"
              >
                <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
                <span
                  aria-hidden
                  className={cn('absolute h-px w-4 bg-ink transition-transform duration-300', menuOpen ? 'rotate-45' : '-translate-y-[3px]')}
                />
                <span
                  aria-hidden
                  className={cn('absolute h-px w-4 bg-ink transition-transform duration-300', menuOpen ? '-rotate-45' : 'translate-y-[3px]')}
                />
              </button>
            </div>
          </nav>
          <motion.div aria-hidden className="h-px origin-left bg-accent" style={{ scaleX: progress }} />
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-bg pt-24 lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          >
            <ul className="container-page flex flex-col">
              {[...NAV_SECTIONS, { id: 'contact', label: 'Contact' }].map((s, i) => (
                <motion.li
                  key={s.id}
                  className="border-b border-line"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.6, ease: EASE_OUT_EXPO }}
                >
                  <a
                    href={`#${s.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline justify-between py-4 font-display text-4xl"
                  >
                    {s.label}
                    <span className="font-mono text-xs text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.p
              className="container-page mt-auto flex items-baseline justify-between pb-8 text-sm text-ink-faint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Handle play="mount" className="text-2xl text-ink" />
              <span>{PERSONAL_INFO.name}</span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
