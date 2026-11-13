import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { MotionValue } from 'motion/react';
import * as THREE from 'three';
import { onZeroMood, setZeroMood, type ZeroMood } from '@/lib/zero';
import { BlobShadow, StudioLight, Zero, type LookRef, type ZeroHandle } from './Zero';
import { useScenePalette } from './palette';
import { usePointerLook, useStageActive } from './stage';

const easeOut = (u: number) => 1 - Math.pow(1 - u, 3);

function Scene({ progress, look, animate, ready }: { progress: MotionValue<number>; look: LookRef; animate: boolean; ready: boolean }) {
  const pal = useScenePalette();
  const { viewport } = useThree();
  const [mood, setMood] = useState<ZeroMood>('idle');
  const rig = useRef<THREE.Group>(null!);
  const shadow = useRef<THREE.Mesh>(null!);
  const zero = useRef<ZeroHandle>(null);
  const enterAt = useRef<number | null>(animate ? null : -100);
  const landed = useRef(false);

  useEffect(() => onZeroMood(setMood), []);
  useEffect(() => {
    if (mood === 'idle') return;
    const t = window.setTimeout(() => setMood('idle'), 1800);
    return () => clearTimeout(t);
  }, [mood]);

  // Zero is sized to the hero: big enough to own it, never cropped. On a
  // portrait screen it shares the height with the headline above and below.
  const portrait = viewport.aspect < 1;
  const scale = portrait ? Math.min(viewport.height * 0.2, viewport.width * 0.3) : Math.min(viewport.height * 0.36, viewport.width * 0.42);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ready && enterAt.current === null) enterAt.current = t;
    const since = enterAt.current === null ? -1 : t - enterAt.current;

    // Entrance: Zero drops in from above and lands with a squash.
    const u = THREE.MathUtils.clamp(since / 0.8, 0, 1);
    if (u >= 1 && !landed.current) {
      landed.current = true;
      zero.current?.squash();
    }
    // Leaving: as the hero scrolls away, Zero leans back and sinks.
    const p = animate ? progress.get() : 0;
    rig.current.position.y = (portrait ? scale * 0.25 : -scale * 0.12) + (1 - easeOut(u)) * viewport.height - p * scale * 0.5;
    rig.current.rotation.x = -p * 0.5;
    rig.current.visible = u > 0;
    shadow.current.visible = u > 0.6;
  });

  return (
    <>
      <StudioLight />
      <group ref={rig} scale={scale}>
        <Zero ref={zero} palette={pal} mood={mood} look={look} animate={animate} onPoke={() => setZeroMood('happy')} />
        <BlobShadow ref={shadow} color="#000000" position={[0, -0.6, 0.05]} opacity={0.35} />
      </group>
    </>
  );
}

/** The hero's centrepiece: Zero, big, following the cursor. */
export default function HeroZero({ progress, ready, reduce }: { progress: MotionValue<number>; ready: boolean; reduce: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const active = useStageActive(wrap);
  const look = usePointerLook(wrap);

  return (
    <div ref={wrap} className="h-full w-full" aria-hidden>
      <Canvas
        frameloop={active ? (reduce ? 'demand' : 'always') : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.2, 6], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ touchAction: 'pan-y' }}
        fallback={null}
      >
        <Scene progress={progress} look={look} animate={!reduce} ready={ready} />
      </Canvas>
    </div>
  );
}
