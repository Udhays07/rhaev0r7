import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { ZeroMood } from '@/lib/zero';
import type { ScenePalette } from './palette';

/** Pointer position, normalised to -1…1 across the viewport. */
export type LookRef = MutableRefObject<{ x: number; y: number }>;

export interface ZeroHandle {
  /** A little hop, e.g. when poked. */
  jump: () => void;
  /** Squash-and-stretch, e.g. on landing. */
  squash: () => void;
}

type ZeroProps = ThreeElements['group'] & {
  palette: ScenePalette;
  mood?: ZeroMood;
  look?: LookRef;
  /** False under reduced motion: Zero holds a still, friendly pose. */
  animate?: boolean;
  onPoke?: () => void;
};

/** The slash leans like the one through the 0 in "rhaev0r7". */
const SLASH = 0.42;
const damp = (current: number, target: number, rate: number, dt: number) =>
  THREE.MathUtils.lerp(current, target, 1 - Math.exp(-rate * dt));

/*
 * Zero's skin: safety orange, covered in the doodles a developer leaves in
 * margins. Drawn once on a canvas and wrapped round the body. The face (the
 * front, where u ≈ 0.25 on a sphere) is kept clear for the shades.
 */
const DOODLES = ['</>', '{ }', '$_', '0101', '200 OK', 'λ', '=>', '#', '[ ]', 'git push', '?', '++', 'SELECT *', '∞', '//', 'npm i'];

function drawSkin(body: string, ink: string) {
  const W = 1024;
  const H = 512;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  g.fillStyle = body;
  g.fillRect(0, 0, W, H);

  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  g.strokeStyle = ink;
  g.fillStyle = ink;
  g.lineWidth = 4;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.globalAlpha = 0.82;

  const faceClear = (x: number, y: number) => {
    const u = x / W;
    const v = y / H;
    return u > 0.13 && u < 0.37 && v > 0.22 && v < 0.62;
  };

  // Words and symbols, in marker.
  for (let i = 0, placed = 0; placed < 34 && i < 400; i++) {
    const x = rnd() * W;
    const y = 50 + rnd() * (H - 100);
    if (faceClear(x, y)) continue;
    const word = DOODLES[Math.floor(rnd() * DOODLES.length)];
    g.save();
    g.translate(x, y);
    g.rotate((rnd() - 0.5) * 0.9);
    g.font = `${22 + Math.floor(rnd() * 16)}px "Permanent Marker", "Geist Mono Variable", monospace`;
    g.fillText(word, 0, 0);
    g.restore();
    placed++;
  }

  // Little drawn shapes: stars, bolts, arrows, spirals.
  const shapes = [
    (s: number) => {
      g.beginPath();
      for (let k = 0; k < 10; k++) {
        const r = k % 2 ? s * 0.45 : s;
        const a = (k / 10) * Math.PI * 2 - Math.PI / 2;
        g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      g.closePath();
      g.stroke();
    },
    (s: number) => {
      g.beginPath();
      g.moveTo(s * 0.2, -s);
      g.lineTo(-s * 0.4, s * 0.1);
      g.lineTo(s * 0.15, s * 0.1);
      g.lineTo(-s * 0.2, s);
      g.stroke();
    },
    (s: number) => {
      g.beginPath();
      g.moveTo(-s, 0);
      g.lineTo(s, 0);
      g.moveTo(s * 0.45, -s * 0.45);
      g.lineTo(s, 0);
      g.lineTo(s * 0.45, s * 0.45);
      g.stroke();
    },
    (s: number) => {
      g.beginPath();
      for (let a = 0; a < Math.PI * 5; a += 0.2) g.lineTo(Math.cos(a) * a * s * 0.07, Math.sin(a) * a * s * 0.07);
      g.stroke();
    },
  ];
  for (let i = 0, placed = 0; placed < 22 && i < 300; i++) {
    const x = rnd() * W;
    const y = 40 + rnd() * (H - 80);
    if (faceClear(x, y)) continue;
    g.save();
    g.translate(x, y);
    g.rotate(rnd() * Math.PI);
    shapes[Math.floor(rnd() * shapes.length)](12 + rnd() * 12);
    g.restore();
    placed++;
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Zero: the slashed 0 from "rhaev0r7" as a glossy vinyl toy. The slash is
 * worn as shades, two eyes glow behind them, and a terminal cursor blinks
 * on top for an antenna. Built from primitives, so no model file.
 */
export const Zero = forwardRef<ZeroHandle, ZeroProps>(function Zero(
  { palette, mood = 'idle', look, animate = true, onPoke, ...group },
  ref,
) {
  const lift = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Group>(null!);
  const eyes = useRef<THREE.Group>(null!);
  const left = useRef<THREE.Mesh>(null!);
  const right = useRef<THREE.Mesh>(null!);
  const caret = useRef<THREE.Mesh>(null!);
  const jumpAt = useRef(-10);
  const squashAt = useRef(-10);
  const nextBlink = useRef(1.5 + Math.random() * 2);
  const clock = useRef(0);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);
  const skin = useMemo(() => drawSkin(palette.body, palette.doodle), [palette.body, palette.doodle, fontsReady]);
  useEffect(() => () => skin.dispose(), [skin]);

  useImperativeHandle(ref, () => ({
    jump: () => {
      jumpAt.current = clock.current;
    },
    squash: () => {
      squashAt.current = clock.current;
    },
  }));

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    clock.current = t;
    const d = Math.min(dt, 0.05);

    // Hop: half a sine of height, then land into a squash.
    const ju = (t - jumpAt.current) / 0.55;
    const hop = animate && ju >= 0 && ju <= 1 ? Math.sin(Math.PI * ju) * 0.42 : 0;
    if (animate && ju > 1 && ju < 1.05) squashAt.current = t;
    const su = (t - squashAt.current) / 0.38;
    const squash = animate && su >= 0 && su <= 1 ? Math.sin(Math.PI * su) * Math.exp(-2.5 * su) * 0.32 : 0;
    const breathe = animate ? Math.sin(t * 2.1) * 0.018 : 0;
    const happyBounce = animate && mood === 'happy' ? Math.abs(Math.sin(t * 6)) * 0.06 : 0;

    lift.current.position.y = hop + happyBounce + (animate ? Math.sin(t * 1.6) * 0.025 : 0);
    lift.current.scale.set(1 + squash * 0.9, 1 - squash + breathe, 1 + squash * 0.9);

    // Lean toward whatever the visitor is pointing at.
    const lx = look?.current.x ?? 0;
    const ly = look?.current.y ?? 0;
    const tilt = mood === 'confused' ? 0.2 : 0;
    body.current.rotation.y = damp(body.current.rotation.y, lx * 0.5, 6, d);
    body.current.rotation.x = damp(body.current.rotation.x, -ly * 0.2, 6, d);
    body.current.rotation.z = damp(body.current.rotation.z, tilt - lx * 0.06, 5, d);
    eyes.current.position.x = damp(eyes.current.position.x, lx * 0.07, 10, d);
    eyes.current.position.y = damp(eyes.current.position.y, ly * 0.035, 10, d);

    // Eyes carry the mood; a blink every few seconds keeps it alive.
    let open = 1;
    if (animate && t > nextBlink.current) {
      const bu = (t - nextBlink.current) / 0.14;
      open = bu < 1 ? Math.abs(1 - 2 * bu) : 1;
      if (bu >= 1) nextBlink.current = t + 2 + Math.random() * 3.5;
    }
    const shape: Record<ZeroMood, [number, number]> = {
      idle: [1, 1],
      curious: [1.3, 1.3],
      happy: [0.32, 0.32],
      confused: [1.15, 0.55],
    };
    const [l, r] = shape[mood];
    left.current.scale.y = damp(left.current.scale.y, l * open, 18, d);
    right.current.scale.y = damp(right.current.scale.y, r * open, 18, d);

    // The antenna is a terminal cursor, blinking at a terminal's pace.
    caret.current.visible = !animate || t % 1.06 < 0.62;
  });

  return (
    <group {...group}>
      <group ref={lift}>
        <group
          ref={body}
          onClick={(e) => {
            e.stopPropagation();
            jumpAt.current = clock.current;
            onPoke?.();
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = '')}
        >
          {/* The 0: a tall, glossy, doodled oval. */}
          <mesh position={[0, 0.06, 0]} scale={[0.84, 1.06, 0.8]}>
            <sphereGeometry args={[0.5, 64, 64]} />
            <meshPhysicalMaterial map={skin} roughness={0.32} clearcoat={1} clearcoatRoughness={0.12} />
          </mesh>

          {/* The slash, worn as shades. */}
          <group position={[0, 0.13, 0.33]} rotation={[0, 0, SLASH]}>
            <RoundedBox args={[1.04, 0.3, 0.22]} radius={0.11} smoothness={5}>
              <meshPhysicalMaterial color={palette.visor} roughness={0.08} metalness={0.2} clearcoat={1} clearcoatRoughness={0.04} />
            </RoundedBox>
            <group ref={eyes} position={[0, 0, 0.114]}>
              <mesh ref={left} position={[-0.17, 0, 0]}>
                <capsuleGeometry args={[0.045, 0.07, 6, 12]} />
                <meshBasicMaterial color={palette.glow} toneMapped={false} />
              </mesh>
              <mesh ref={right} position={[0.17, 0, 0]}>
                <capsuleGeometry args={[0.045, 0.07, 6, 12]} />
                <meshBasicMaterial color={palette.glow} toneMapped={false} />
              </mesh>
            </group>
          </group>

          {/* Antenna: a blinking block cursor. */}
          <mesh ref={caret} position={[0, 0.71, 0]}>
            <boxGeometry args={[0.075, 0.17, 0.075]} />
            <meshPhysicalMaterial color={palette.visor} roughness={0.1} clearcoat={1} />
          </mesh>

          {/* Stubby sneakers. */}
          {[-0.19, 0.19].map((x) => (
            <mesh key={x} position={[x, -0.5, 0.07]} scale={[1, 0.55, 1.3]}>
              <sphereGeometry args={[0.13, 24, 24]} />
              <meshPhysicalMaterial color={palette.visor} roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
});

/** Soft studio light for glossy vinyl, rendered once into an environment map: no files fetched. */
export { StudioLight } from './StudioLight';

/** A soft blob shadow: cheaper than real shadows. */
export function BlobShadow({ color, opacity = 0.28, ...props }: ThreeElements['mesh'] & { color: string; opacity?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} {...props}>
      <circleGeometry args={[0.42, 40]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} alphaMap={getBlobMap()} />
    </mesh>
  );
}

let blobMap: THREE.CanvasTexture | null = null;
function getBlobMap() {
  if (!blobMap) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, '#fff');
    grd.addColorStop(1, '#000');
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    blobMap = new THREE.CanvasTexture(c);
  }
  return blobMap;
}
