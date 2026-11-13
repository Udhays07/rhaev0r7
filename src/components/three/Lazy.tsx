import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import type { MotionValue } from 'motion/react';
import { useReducedMotion } from 'motion/react';

/*
 * three.js is heavy, so the scenes load as their own chunk, only after the
 * intro has handed over and the browser is idle. The page never waits on
 * them, and a failed load or missing WebGL leaves no trace.
 */
const HeroZeroChunk = lazy(() => import('./HeroZero'));
const StackSceneChunk = lazy(() => import('./StackScene'));
const ZeroCameoChunk = lazy(() => import('./ZeroCameo'));

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Waits for the intro and an idle moment before mounting heavy content. */
function useDeferredMount(after: boolean) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (!after || go || !webglAvailable()) return;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const id = ric(() => setGo(true), { timeout: 900 });
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id);
  }, [after, go]);
  return go;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Start downloading the 3D code while the intro plays; mounting still waits. */
let preloaded = false;
function preload() {
  if (preloaded) return;
  preloaded = true;
  void import('./HeroZero');
  void import('./StackScene');
  void import('./ZeroCameo');
}

function Deferred({ ready, children }: { ready: boolean; children: ReactNode }) {
  useEffect(preload, []);
  const go = useDeferredMount(ready);
  if (!go) return null;
  return (
    <SceneBoundary>
      <Suspense fallback={null}>{children}</Suspense>
    </SceneBoundary>
  );
}

export function LazyHeroZero({ progress, ready }: { progress: MotionValue<number>; ready: boolean }) {
  const reduce = !!useReducedMotion();
  return (
    <Deferred ready={ready}>
      <HeroZeroChunk progress={progress} ready={ready} reduce={reduce} />
    </Deferred>
  );
}

export function LazyStackScene({ progress, ready }: { progress: MotionValue<number>; ready: boolean }) {
  const reduce = !!useReducedMotion();
  return (
    <Deferred ready={ready}>
      <StackSceneChunk progress={progress} ready={ready} reduce={reduce} />
    </Deferred>
  );
}

export function LazyZeroCameo({ ready }: { ready: boolean }) {
  const reduce = !!useReducedMotion();
  return (
    <Deferred ready={ready}>
      <ZeroCameoChunk reduce={reduce} />
    </Deferred>
  );
}
