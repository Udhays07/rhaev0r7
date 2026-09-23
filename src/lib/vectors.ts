import type { Vector5 } from '@/types';

/**
 * Fixed linear projection from the 5-d toy space to 3-d for display.
 * Each dimension gets its own direction so topics form visible clusters.
 */
const AXES: [number, number, number][] = [
  [-1.7, 0.5, 0.2], // place
  [0.2, 1.5, 0.9], // ai
  [1.0, 1.0, -0.9], // math
  [1.5, -0.8, 0.5], // frontend
  [0.1, -1.0, -1.4], // backend
];

export function project(v: Vector5): [number, number, number] {
  const norm = Math.hypot(...v) || 1;
  const out: [number, number, number] = [0, 0, 0];
  v.forEach((value, i) => {
    const w = value / norm;
    out[0] += AXES[i][0] * w;
    out[1] += AXES[i][1] * w;
    out[2] += AXES[i][2] * w;
  });
  return out;
}

export function normalise(v: Vector5): Vector5 {
  const norm = Math.hypot(...v) || 1;
  return v.map((x) => x / norm) as Vector5;
}
