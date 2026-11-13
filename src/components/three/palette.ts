import { useMemo } from 'react';
import * as THREE from 'three';
import { useCssColor } from '@/hooks/useCssColor';

/**
 * Scene colours come from the same CSS tokens as the page, so the 3D layer
 * changes theme with everything else. Zero is a glossy vinyl toy: safety
 * orange in both themes, doodled with code in ink.
 */
export interface ScenePalette {
  dark: boolean;
  bg: string;
  ink: string;
  muted: string;
  /** The theme's flood colour and the ink that sits on it. */
  flood: string;
  floodInk: string;
  /** Zero's body. */
  body: string;
  /** Doodles drawn on Zero's skin. */
  doodle: string;
  /** The slash across Zero's face, worn as shades. */
  visor: string;
  /** Zero's eyes and its terminal-cursor antenna. */
  glow: string;
}

export function useScenePalette(): ScenePalette {
  const bg = useCssColor('--bg');
  const ink = useCssColor('--ink');
  const muted = useCssColor('--ink-muted');
  const flood = useCssColor('--flood');
  const floodInk = useCssColor('--flood-ink');
  const zero = useCssColor('--zero');

  return useMemo(() => {
    // Read darkness from the live token: theme state is local to each useTheme().
    const dark = new THREE.Color(bg).getHSL({ h: 0, s: 0, l: 0 }).l < 0.5;
    return {
      dark,
      bg,
      ink,
      muted,
      flood,
      floodInk,
      body: zero,
      doodle: '#2a0e05',
      visor: '#0c0c0e',
      glow: '#fff3e8',
    };
  }, [bg, ink, muted, flood, floodInk, zero]);
}
