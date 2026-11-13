import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { onZeroMood, type ZeroMood } from '@/lib/zero';
import { BlobShadow, StudioLight, Zero, type ZeroHandle } from './Zero';
import { useScenePalette } from './palette';
import { usePointerLook, useStageActive } from './stage';

function Scene({ look, animate }: { look: ReturnType<typeof usePointerLook>; animate: boolean }) {
  const pal = useScenePalette();
  const [mood, setMood] = useState<ZeroMood>('idle');
  const zero = useRef<ZeroHandle>(null);

  // The terminal and the copy button drive Zero's mood.
  useEffect(
    () =>
      onZeroMood((m) => {
        setMood(m);
        if (m === 'happy') zero.current?.jump();
      }),
    [],
  );
  useEffect(() => {
    if (mood === 'idle') return;
    const t = window.setTimeout(() => setMood('idle'), mood === 'curious' ? 2600 : 1800);
    return () => clearTimeout(t);
  }, [mood]);

  return (
    <>
      <StudioLight />
      <BlobShadow color="#000000" position={[0, -0.92, 0]} opacity={0.25} />
      <Zero position={[0, -0.36, 0]} ref={zero} palette={pal} mood={mood} look={look} animate={animate} onPoke={() => setMood('happy')} />
    </>
  );
}

/** Zero, perched on the terminal: it reacts to what the visitor types. */
export default function ZeroCameo({ reduce }: { reduce: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const active = useStageActive(wrap);
  const look = usePointerLook(wrap);

  return (
    <div ref={wrap} className="h-full w-full" aria-hidden>
      <Canvas
        frameloop={active ? (reduce ? 'demand' : 'always') : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.38, 3.3], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: 'pan-y' }}
        fallback={null}
      >
        <Scene look={look} animate={!reduce} />
      </Canvas>
    </div>
  );
}
