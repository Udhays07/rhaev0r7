/**
 * Zero is the mascot: the slashed 0 from "rhaev0r7", come to life.
 * Anything on the page can set its mood; every Zero on screen listens.
 */
export type ZeroMood = 'idle' | 'curious' | 'happy' | 'confused';

const EVENT = 'zero:mood';

export function setZeroMood(mood: ZeroMood) {
  window.dispatchEvent(new CustomEvent<ZeroMood>(EVENT, { detail: mood }));
}

export function onZeroMood(handler: (mood: ZeroMood) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<ZeroMood>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
