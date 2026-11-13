import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { Moon, Sun, X } from 'lucide-react';
import { NAV_SECTIONS, PERSONAL_INFO } from '@/data/portfolioData';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useTheme } from '@/hooks/useTheme';
import { useIntroDone } from '@/lib/intro';
import { Handle, HandleText } from '@/components/ui/Handle';
import { Spray } from '@/components/ui/Spray';
import { getLenis } from '@/lib/scroll';
import { cn, EASE_OUT_EXPO } from '@/lib/utils';

const LINKS = [...NAV_SECTIONS, { id: 'contact', label: 'Contact' }];
const SECTION_IDS = LINKS.map((s) => s.id);

export function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const { theme, toggle } = useTheme();
  const introDone = useIntroDone();
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Tuck the bar away while reading downward; bring it back on any upward scroll.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (y > 480 && y > prev + 4) setHidden(true);
    if (y < prev - 4) setHidden(false);
  });

  // While the menu is open it owns the page: scrolling stops, the page behind
  // goes inert, and focus starts inside. Closing hands focus back to the button.
  useEffect(() => {
    if (!menuOpen) return;
    const lenis = getLenis();
    lenis?.stop();
    const behind = [document.querySelector('main'), document.querySelector('footer')].filter(Boolean) as HTMLElement[];
    behind.forEach((el) => (el.inert = true));
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>('a')?.focus(), 60);
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      lenis?.start();
      behind.forEach((el) => (el.inert = false));
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const close = (returnFocus = true) => {
    setMenuOpen(false);
    if (returnFocus) window.setTimeout(() => menuButton.current?.focus(), 0);
  };

  // Keep Tab cycling inside the open menu.
  const trap = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !panel.current) return;
    const items = [...panel.current.querySelectorAll<HTMLElement>('a, button')];
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !menuOpen ? '-110%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        // A tucked-away bar slides back the moment keyboard focus reaches it.
        onFocusCapture={() => setHidden(false)}
      >
        <div className={cn('transition-colors duration-500', scrolled ? 'bg-bg/90 backdrop-blur-md' : 'bg-transparent')}>
          <nav aria-label="Primary" className="container-page flex h-[4.5rem] items-center justify-between gap-4">
            <a href="#top" className="flex items-baseline" aria-label={`${PERSONAL_INFO.nickname}, back to top`}>
              <Handle play="mount" enabled={introDone} delay={500} className="text-lg font-bold tracking-tight" />
            </a>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={toggle}
                aria-label={`Switch to ${theme === 'dark' ? 'day' : 'night'} shift`}
                className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink/30 text-ink transition-colors hover:border-ink"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {theme === 'dark' ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
                  </motion.span>
                </AnimatePresence>
              </button>

              <button
                ref={menuButton}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                className="tape"
              >
                Menu
              </button>
              <a href="#contact" className="tape tape-hot hidden sm:inline-flex">
                Say hi
              </a>
            </div>
          </nav>
          <motion.div aria-hidden className="h-[3px] origin-left bg-accent" style={{ scaleX: progress }} />
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="site-menu"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            onKeyDown={trap}
            className="flood fixed inset-0 z-[70] flex flex-col overflow-y-auto"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 flex items-end justify-end overflow-hidden">
              <Spray size="clamp(8rem,30vw,30rem)" tilt={-8} className="static -mb-[0.1em] -mr-[0.05em]">
                GO
              </Spray>
            </div>

            <div className="container-page relative flex h-[4.5rem] shrink-0 items-center justify-between">
              <HandleText className="font-mono text-lg font-bold" />
              <button type="button" onClick={() => close()} className="tape tape-hot">
                Close
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            <ul className="container-page relative my-auto py-6">
              {LINKS.map((s, i) => (
                <motion.li
                  key={s.id}
                  className="border-b-2 border-ink first:border-t-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.6, ease: EASE_OUT_EXPO }}
                >
                  <a
                    href={`#${s.id}`}
                    onClick={() => close(false)}
                    aria-current={active === s.id ? 'location' : undefined}
                    className="group flex items-center justify-between gap-6 py-2 font-display text-[min(8.5vw,9.5svh)] leading-[0.9]"
                  >
                    <span className="transition-transform duration-500 group-hover:translate-x-4">{s.label}</span>
                    {active === s.id && <span className="font-mono text-sm normal-case tracking-normal">you are here</span>}
                  </a>
                </motion.li>
              ))}
            </ul>

            <p className="container-page relative flex flex-wrap items-baseline justify-between gap-3 pb-8 font-mono text-sm">
              <span>{PERSONAL_INFO.name}</span>
              <a href={`mailto:${PERSONAL_INFO.email}`} className="link-draw">
                {PERSONAL_INFO.email}
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
