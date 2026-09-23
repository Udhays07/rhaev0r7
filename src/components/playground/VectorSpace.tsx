import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { SimilarityItem, Vector5 } from '@/types';
import { project } from '@/lib/vectors';
import { useCssColor } from '@/hooks/useCssColor';

interface VectorSpaceProps {
  corpus: SimilarityItem[];
  query: Vector5 | null;
  topIds: string[];
}

function QueryPoint({ target, color }: { target: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  const goal = useMemo(() => new THREE.Vector3(...target), [target]);
  // Ease toward the new position so you can watch the query move through the space.
  useFrame((_, delta) => {
    ref.current.position.lerp(goal, 1 - Math.pow(0.001, delta));
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.09, 24, 24]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function Links({ from, to, color }: { from: [number, number, number]; to: [number, number, number][]; color: string }) {
  return (
    <>
      {to.map((p, i) => (
        <Line key={i} points={[from, p]} color={color} lineWidth={1} dashed dashSize={0.06} gapSize={0.05} transparent opacity={0.8 - i * 0.2} />
      ))}
    </>
  );
}

function Scene({ corpus, query, topIds }: VectorSpaceProps) {
  const ink = useCssColor('--ink-faint');
  const accent = useCssColor('--accent');
  const text = useCssColor('--ink');
  const points = useMemo(() => corpus.map((c) => ({ ...c, pos: project(c.vector) })), [corpus]);
  const queryPos = useMemo(() => (query ? project(query) : ([0, 0, 0] as [number, number, number])), [query]);
  const topPositions = topIds.map((id) => points.find((p) => p.id === id)!.pos);

  return (
    <>
      <gridHelper args={[6, 12, ink, ink]} position={[0, -1.6, 0]} material-transparent material-opacity={0.25} />
      {points.map((p) => {
        const rank = topIds.indexOf(p.id);
        const hit = rank !== -1;
        return (
          <group key={p.id} position={p.pos}>
            <mesh>
              <sphereGeometry args={[hit ? 0.075 : 0.055, 20, 20]} />
              <meshBasicMaterial color={hit ? text : ink} />
            </mesh>
            {hit && (
              // A ring that always faces the camera marks each retrieved neighbour.
              <Billboard>
                <mesh>
                  <ringGeometry args={[0.13 + rank * 0.02, 0.145 + rank * 0.02, 40]} />
                  <meshBasicMaterial color={accent} transparent opacity={1 - rank * 0.25} />
                </mesh>
              </Billboard>
            )}
          </group>
        );
      })}
      {query && (
        <>
          <QueryPoint target={queryPos} color={accent} />
          <Links from={queryPos} to={topPositions} color={accent} />
        </>
      )}
    </>
  );
}

export default function VectorSpace(props: VectorSpaceProps) {
  return (
    <Canvas camera={{ position: [3.6, 2.2, 4.4], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <Scene {...props} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
    </Canvas>
  );
}
