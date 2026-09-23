import { createContext, useContext } from 'react';

/** `true` once the intro loader has handed over to the page. */
export const IntroContext = createContext(true);

export function useIntroDone() {
  return useContext(IntroContext);
}
