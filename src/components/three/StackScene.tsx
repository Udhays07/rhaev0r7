import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import type { MotionValue } from 'motion/react';
import * as THREE from 'three';
import { onZeroMood, type ZeroMood } from '@/lib/zero';
import { BlobShadow, StudioLight, Zero, type LookRef, type ZeroHandle } from './Zero';
import { useScenePalette, type ScenePalette } from './palette';
import { usePointerLook, useStageActive } from './stage';

/**
 * "I started with interfaces. Now I'm exploring the systems behind them."
 * The hero shows that sentence: an app as a stack of layers. Scrolling
 * pulls the stack apart, and Zero hops down one layer at a time.
 */
const LAYERS = [
  { key: 'interface', label: '01  interface' },
  { key: 'api', label: '02  api' },
  { key: 'data', label: '03  database' },
  { key: 'model', label: '04  model' },
] as const;
type LayerKey = (typeof LAYERS)[number]['key'];

const SLAB = { w: 2.3, h: 0.16, d: 1.6 };
/** Scroll progress through the pinned statement: the line is read first,
    then the stack opens and Zero heads down, finishing before the pin lets go. */
const DESCEND_FROM = 0.32;
const DESCEND_BY = 0.92;
/** Where Zero stands on a layer: near its right end, clear of the label. */
const SPOT = { x: 0.84, z: 0.28 };
/** As the stack opens it steps right, like a staircase, so the end of each
    lower layer sticks out from under the one above: room for Zero to land. */
const STEP = 0.62;
const ZERO_SCALE = 0.7;
/** From Zero's origin down to the soles of its feet, at its scale. */
const FOOT = 0.57 * ZERO_SCALE;

const explode = (p: number) => THREE.MathUtils.clamp((p - DESCEND_FROM) / (DESCEND_BY - DESCEND_FROM), 0, 1);
const gapAt = (p: number) => 0.12 + explode(p) * 0.62;
/** The stack pulls apart around its own middle, so it stays centred in frame. */
const layerY = (i: number, p: number) => ((LAYERS.length - 1) / 2 - i) * (SLAB.h + gapAt(p)) - 0.25;
const stagger = (p: number) => Math.min(1, explode(p) * 2.2);
const layerX = (i: number, p: number) => (i - (LAYERS.length - 1) / 2) * STEP * stagger(p);
/** Zero moves on only once the staircase has opened enough to land clear. */
const layerAt = (p: number) => {
  const e = explode(p);
  return e < 0.4 ? 0 : Math.min(LAYERS.length - 1, 1 + Math.floor((e - 0.4) / 0.2));
};
const easeOut = (u: number) => 1 - Math.pow(1 - u, 3);

/** Draws a layer's top face: its name and a small motif of what lives there. */
function drawLayer(key: LayerKey, label: string, pal: ScenePalette) {
  const W = 512;
  const H = Math.round((W * SLAB.d) / SLAB.w);
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  // Glossy black slabs on the flood: faces printed in the brand colour, with
  // the live bits in white. Orange stays Zero's alone.
  const line = pal.flood;
  g.fillStyle = line;
  g.strokeStyle = line;
  g.lineWidth = 3;
  g.font = '500 26px "Geist Mono Variable", ui-monospace, monospace';
  g.fillText(label, 34, 52);

  g.globalAlpha = 0.85;
  if (key === 'interface') {
    g.strokeRect(34, 84, 300, 150);
    g.fillRect(34, 84, 300, 22);
    [126, 150, 174].forEach((y, i) => g.fillRect(52, y, i === 2 ? 120 : 220, 8));
    g.fillStyle = pal.glow;
    g.fillRect(52, 200, 84, 22);
  } else if (key === 'api') {
    g.font = '500 24px "Geist Mono Variable", ui-monospace, monospace';
    g.fillText('GET  /systems', 34, 120);
    g.fillText('→ 200 OK', 34, 160);
    g.fillStyle = pal.glow;
    g.fillText('12ms', 200, 160);
  } else if (key === 'data') {
    for (let r = 0; r < 4; r++)
      for (let col = 0; col < 3; col++) g.strokeRect(34 + col * 96, 84 + r * 34, 96, 34);
    g.fillStyle = pal.glow;
    g.fillRect(34, 152, 288, 34);
  } else {
    // Embeddings: a loose cloud of points, one of them "the answer".
    let seed = 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 46; i++) {
      g.beginPath();
      g.arc(44 + rnd() * 300, 92 + rnd() * 130, 4, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = pal.glow;
    g.beginPath();
    g.arc(250, 150, 9, 0, Math.PI * 2);
    g.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function Layer({ k, label, pal, fontsReady }: { k: LayerKey; label: string; pal: ScenePalette; fontsReady: boolean }) {
  // Redraw when the theme or fonts change; dispose the old texture.
  const tex = useMemo(() => drawLayer(k, label, pal), [k, label, pal, fontsReady]);
  useEffect(() => () => tex.dispose(), [tex]);

  return (
    <group>
      <RoundedBox args={[SLAB.w, SLAB.h, SLAB.d]} radius={0.05} smoothness={3}>
        <meshPhysicalMaterial color="#0d0d0f" roughness={0.3} clearcoat={0.8} clearcoatRoughness={0.2} />
      </RoundedBox>
      <mesh position={[0, SLAB.h / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[SLAB.w - 0.06, SLAB.d - 0.06]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

interface SceneProps {
  progress: MotionValue<number>;
  look: LookRef;
  animate: boolean;
  ready: boolean;
}

function Scene({ progress, look, animate, ready }: SceneProps) {
  const pal = useScenePalette();
  const { camera } = useThree();
  const [fontsReady, setFontsReady] = useState(false);
  const [mood, setMood] = useState<ZeroMood>('idle');
  const root = useRef<THREE.Group>(null!);
  const layers = useRef<(THREE.Group | null)[]>([]);
  const zeroRig = useRef<THREE.Group>(null!);
  const shadow = useRef<THREE.Mesh>(null!);
  const zero = useRef<ZeroHandle>(null);
  const hop = useRef({ from: 0, fromX: SPOT.x, at: -10, layer: 0 });
  const enterAt = useRef<number | null>(animate ? null : -100);
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);
  useEffect(() => onZeroMood(setMood), []);
  useEffect(() => {
    if (mood === 'idle') return;
    const t = window.setTimeout(() => setMood('idle'), 1800);
    return () => clearTimeout(t);
  }, [mood]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const p = animate ? progress.get() : 0;
    if (ready && enterAt.current === null) enterAt.current = t;
    const since = enterAt.current === null ? -1 : t - enterAt.current;

    // Entrance: layers drop in bottom-first after the loader lifts, then Zero lands on top.
    LAYERS.forEach((_, i) => {
      const g = layers.current[i];
      if (!g) return;
      const u = THREE.MathUtils.clamp((since - (LAYERS.length - 1 - i) * 0.12) / 0.7, 0, 1);
      g.position.y = layerY(i, p) + (1 - easeOut(u)) * 2.4;
      g.position.x = layerX(i, p);
      g.visible = u > 0;
      if (animate) g.rotation.y = Math.sin(t * 0.5 + i * 0.9) * 0.02 * explode(p);
    });

    // Zero hops to whichever layer the scroll has reached.
    const target = layerAt(p);
    const h = hop.current;
    if (target !== h.layer) {
      h.from = zeroRig.current.position.y;
      h.fromX = zeroRig.current.position.x;
      h.layer = target;
      h.at = t;
    }
    const goal = layerY(target, p) + SLAB.h / 2 + FOOT;
    const goalX = layerX(target, p) + SPOT.x;
    const hu = (t - h.at) / 0.5;
    const zu = THREE.MathUtils.clamp((since - 0.75) / 0.6, 0, 1);
    if (hu >= 0 && hu < 1) {
      zeroRig.current.position.y = THREE.MathUtils.lerp(h.from, goal, easeOut(hu)) + Math.sin(Math.PI * hu) * 0.45;
      zeroRig.current.position.x = THREE.MathUtils.lerp(h.fromX, goalX, easeOut(hu));
    } else {
      if (hu >= 1 && hu < 1.1) zero.current?.squash();
      zeroRig.current.position.y = goal + (1 - easeOut(zu)) * 3;
      zeroRig.current.position.x = goalX;
    }
    zeroRig.current.visible = zu > 0;
    if (zu >= 1 && since - dt < 1.35) zero.current?.squash();

    shadow.current.position.y = layerY(target, p) + SLAB.h / 2 + 0.004;
    shadow.current.position.x = zeroRig.current.position.x;
    (shadow.current.material as THREE.MeshBasicMaterial).opacity = (zu > 0 ? 0.3 : 0) / (1 + Math.max(0, zeroRig.current.position.y - goal) * 2);

    // The whole stack turns gently toward the pointer.
    if (animate) {
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, -0.55 + look.current.x * 0.18 + Math.sin(t * 0.3) * 0.04, 3, dt);
    }

    // The camera eases back as the stack opens, so every layer stays in frame.
    const e = explode(p);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 2.7 + e * 1.1, 4, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 6.2 + e * 3.2, 4, dt);
    lookAt.set(0, 0.05 - e * 0.15, 0);
    camera.lookAt(lookAt);
  });

  return (
    <>
      <StudioLight />
      <group ref={root} rotation={[0, -0.55, 0]}>
        {LAYERS.map((l, i) => (
          <group key={l.key} ref={(g) => void (layers.current[i] = g)}>
            <Layer k={l.key} label={l.label} pal={pal} fontsReady={fontsReady} />
          </group>
        ))}
        <BlobShadow ref={shadow} color="#000000" position={[SPOT.x, 0, SPOT.z]} />
        <group ref={zeroRig} position={[SPOT.x, 3, SPOT.z]} rotation={[0, 0.55, 0]} scale={ZERO_SCALE}>
          <Zero ref={zero} palette={pal} mood={mood} look={look} animate={animate} onPoke={() => setMood('happy')} />
        </group>
      </group>
    </>
  );
}

export default function StackScene({ progress, ready, reduce }: { progress: MotionValue<number>; ready: boolean; reduce: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const active = useStageActive(wrap);
  const look = usePointerLook(wrap);

  return (
    <div ref={wrap} className="h-full w-full" aria-hidden>
      <Canvas
        frameloop={active ? (reduce ? 'demand' : 'always') : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 3, 6.2], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ touchAction: 'pan-y' }}
        fallback={null}
      >
        <Scene progress={progress} look={look} animate={!reduce} ready={ready} />
      </Canvas>
    </div>
  );
}
