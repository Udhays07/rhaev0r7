import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { RevealLines } from '@/components/ui/RevealLines';
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons';
import { Handle } from '@/components/ui/Handle';
import { PERSONAL_INFO, TERMINAL_COMMANDS } from '@/data/portfolioData';
import { cn } from '@/lib/utils';

type Line = { kind: 'cmd' | 'out' | 'ok' | 'muted'; text: string };

const BOOT: Line[] = [
  { kind: 'cmd', text: './connect-with-rhaev0r7' },
  { kind: 'muted', text: '> Checking availability…' },
  { kind: 'ok', text: 'GitHub' },
  { kind: 'ok', text: 'LinkedIn' },
  { kind: 'ok', text: 'Email' },
  { kind: 'muted', text: '> Ready to connect. Type `help` to look around.' },
];

const COMMAND_NAMES = TERMINAL_COMMANDS.map((c) => c.command);

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function Terminal() {
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { once: true, margin: '0px 0px -20% 0px' });
  const [lines, setLines] = useState<Line[]>([]);
  const [booted, setBooted] = useState(false);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);

  // Play the connect script once, when the terminal first scrolls into view.
  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setLines(BOOT);
      setBooted(true);
      return;
    }
    const timers = BOOT.map((line, i) => window.setTimeout(() => setLines((l) => [...l, line]), 250 + i * 380));
    timers.push(window.setTimeout(() => setBooted(true), 250 + BOOT.length * 380));
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines]);

  const run = async (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    setHistory((h) => [raw, ...h]);
    setCursor(-1);
    setValue('');
    if (cmd === 'clear') return setLines([]);

    const out: Line[] = [{ kind: 'cmd', text: raw }];
    if (cmd === 'help') {
      TERMINAL_COMMANDS.forEach((c) => out.push({ kind: 'out', text: `${c.command.padEnd(12)} ${c.description}` }));
    } else if (cmd === 'email') {
      const ok = await copyText(PERSONAL_INFO.email);
      out.push(ok ? { kind: 'ok', text: `Copied ${PERSONAL_INFO.email}` } : { kind: 'out', text: PERSONAL_INFO.email });
    } else {
      const found = TERMINAL_COMMANDS.find((c) => c.command === cmd);
      if (found) found.output.forEach((t) => out.push({ kind: 'out', text: t }));
      else out.push({ kind: 'muted', text: `command not found: ${cmd} — try \`help\`` });
    }
    setLines((l) => [...l, ...out]);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') run(value);
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(history.length - 1, cursor + 1);
      if (next >= 0) {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = cursor - 1;
      setCursor(next);
      setValue(next >= 0 ? history[next] : '');
    } else if (e.key === 'Tab' && value) {
      const match = COMMAND_NAMES.find((c) => c.startsWith(value.toLowerCase()));
      if (match) {
        e.preventDefault();
        setValue(match);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div ref={box} className="border border-line bg-bg-sunken">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="font-mono text-xs text-ink-faint">
          <span className="text-ink-muted">{PERSONAL_INFO.nickname}</span>@connect:~
        </span>
        <span className="hidden font-mono text-xs text-ink-faint sm:inline">↑↓ history · tab completes</span>
      </div>
      <div
        ref={scroller}
        data-lenis-prevent
        onClick={() => input.current?.focus()}
        className="h-72 overflow-y-auto overscroll-contain p-4 font-mono text-[12px] leading-6 md:h-80 md:text-[13px]"
      >
        <div role="log" aria-live="polite">
          {lines.map((l, i) => (
            <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="whitespace-pre-wrap break-words">
              {l.kind === 'cmd' && (
                <>
                  <span className="text-accent">$ </span>
                  <span className="text-ink">{l.text}</span>
                </>
              )}
              {l.kind === 'out' && <span className="text-ink-muted">{l.text}</span>}
              {l.kind === 'muted' && <span className="text-ink-faint">{l.text}</span>}
              {l.kind === 'ok' && (
                <span className="text-ink">
                  <span className="text-accent">✓</span> {l.text}
                </span>
              )}
            </motion.p>
          ))}
        </div>
        <label className={cn('flex items-center gap-2 transition-opacity', booted ? 'opacity-100' : 'opacity-0')}>
          <span className="text-accent">$</span>
          <span className="sr-only">Terminal command</span>
          <input
            ref={input}
            value={value}
            disabled={!booted}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-base text-ink caret-accent outline-none md:text-[13px]"
          />
        </label>
      </div>
    </div>
  );
}

export function Connect() {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (await copyText(PERSONAL_INFO.email)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  const links = [
    { label: 'GitHub', handle: PERSONAL_INFO.githubHandle, href: PERSONAL_INFO.github, icon: <GithubIcon size={18} /> },
    { label: 'LinkedIn', handle: PERSONAL_INFO.linkedinHandle, href: PERSONAL_INFO.linkedin, icon: <LinkedinIcon size={18} /> },
  ];

  return (
    <section id="contact" className="pb-16 pt-20 md:pt-28">
      <div className="container-page">
        <div className="grid grid-cols-12 gap-x-6 border-t border-line pt-6">
          <p className="label col-span-12 flex items-center gap-3 md:col-span-3">
            <span className="text-accent">06</span>
            <span aria-hidden className="h-px w-6 bg-line-strong" />
            Connect
          </p>
        </div>

        <RevealLines
          className="mt-14 text-[clamp(3rem,10vw,10rem)] leading-[0.9] font-[330] tracking-[-0.035em]"
          lines={['Let’s build', <>something <em className="italic text-accent">useful.</em></>]}
        />

        <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-14 md:mt-20">
          <div className="col-span-12 lg:col-span-6">
            <p className="max-w-[44ch] text-lg text-ink-muted">
              I’m looking for teams where I can work with experienced engineers, take ownership across the stack, and
              keep learning how production systems are built.
            </p>
            <p className="mt-4 text-ink-muted">
              Find me as <Handle play="view" className="text-ink" /> — same name, most places.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 border-b border-line pb-6">
              <a href={`mailto:${PERSONAL_INFO.email}`} className="link-draw font-display text-[clamp(1.4rem,3.2vw,2.5rem)] leading-tight">
                {PERSONAL_INFO.email}
              </a>
              <button
                type="button"
                onClick={onCopy}
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-sm text-ink-muted transition-colors hover:border-ink hover:text-ink"
              >
                {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
                <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <ul>
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-11 items-center gap-4 border-b border-line py-5 transition-colors hover:text-accent"
                  >
                    <span className="text-ink-muted transition-colors group-hover:text-accent">{l.icon}</span>
                    <span className="text-xl">{l.label}</span>
                    <span className="font-mono text-sm text-ink-faint">{l.handle}</span>
                    <ArrowUpRight size={20} strokeWidth={1.5} className="ml-auto transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <Terminal />
          </div>
        </div>
      </div>
    </section>
  );
}
