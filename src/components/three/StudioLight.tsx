import { Environment, Lightformer } from '@react-three/drei';

/**
 * A small softbox studio, baked once into an environment map so glossy
 * surfaces get real highlights. Built from light panels in code: nothing
 * is downloaded.
 */
export function StudioLight({ warm = '#ffffff' }: { warm?: string }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={4} color={warm} position={[0, 4, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[-4, 1, 3]} rotation={[0, Math.PI / 2.5, 0]} scale={[2, 5, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[4, 0.5, 2]} rotation={[0, -Math.PI / 2.5, 0]} scale={[2, 4, 1]} />
        <Lightformer form="ring" intensity={1.2} position={[0, 0, -4]} scale={3} />
      </Environment>
    </>
  );
}
