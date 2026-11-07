import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const UP = new THREE.Vector3(0, 1, 0)

/** Cylinder stretched between two points. */
function Rod({ from, to, radius = 0.012, material }) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const dir = b.clone().sub(a)
    const len = dir.length()
    return {
      position: a.clone().add(b).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize()),
      length: len,
    }
  }, [from, to])

  return (
    <mesh position={position} quaternion={quaternion} material={material}>
      <cylinderGeometry args={[radius, radius, length, 6]} />
    </mesh>
  )
}

/** A hanging pan: three chains converging on the beam tip + a shallow bowl. */
const PAN_DROP = 1.75
const PAN_RADIUS = 0.78
const CHAIN_ANGLES = [Math.PI / 2, Math.PI / 2 + (Math.PI * 2) / 3, Math.PI / 2 + (Math.PI * 4) / 3]

const Pan = ({ gold, steel, seg }) => {
  const chains = useMemo(
    () =>
      CHAIN_ANGLES.map((a) => ({
        from: [0, 0, 0],
        to: [Math.cos(a) * PAN_RADIUS, -PAN_DROP, Math.sin(a) * PAN_RADIUS],
      })),
    [],
  )

  return (
    <>
      {chains.map((c, i) => (
        <Rod key={i} from={c.from} to={c.to} material={gold} />
      ))}
      <group position={[0, -PAN_DROP, 0]}>
        <mesh material={steel} scale={[1, 0.28, 1]}>
          <sphereGeometry args={[PAN_RADIUS, seg, seg / 2, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        </mesh>
        <mesh rotation-x={Math.PI / 2} material={gold}>
          <torusGeometry args={[PAN_RADIUS, 0.03, 8, seg * 2]} />
        </mesh>
        <mesh position={[0, -0.22, 0]} material={gold}>
          <sphereGeometry args={[0.06, 12, 12]} />
        </mesh>
      </group>
    </>
  )
}

/**
 * Procedural, abstract scale of justice.
 * Beam sways gently; pans counter-rotate so they always hang level.
 */
export default function JusticeScale({ mobile = false }) {
  const seg = mobile ? 24 : 48

  const gold = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#d4af5a', metalness: 1, roughness: 0.22, envMapIntensity: 1.4 }),
    [],
  )
  const steel = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1a2438', metalness: 0.95, roughness: 0.32, envMapIntensity: 1.1, side: THREE.DoubleSide }),
    [],
  )
  const glow = useMemo(() => new THREE.MeshBasicMaterial({ color: '#f1d68a' }), [])

  const beam = useRef()
  const leftHang = useRef()
  const rightHang = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const tilt = Math.sin(t * 0.6) * 0.05 + Math.sin(t * 0.23) * 0.025
    if (beam.current) beam.current.rotation.z = tilt
    if (leftHang.current) leftHang.current.rotation.z = -tilt
    if (rightHang.current) rightHang.current.rotation.z = -tilt
  })

  return (
    <group position={[0, -0.15, 0]}>
      {/* Base */}
      <mesh position={[0, -1.95, 0]} material={steel}>
        <cylinderGeometry args={[1.25, 1.45, 0.16, seg]} />
      </mesh>
      <mesh position={[0, -1.82, 0]} material={gold}>
        <cylinderGeometry args={[0.85, 1.0, 0.1, seg]} />
      </mesh>
      <mesh position={[0, -1.7, 0]} material={steel}>
        <cylinderGeometry args={[0.45, 0.7, 0.16, seg]} />
      </mesh>

      {/* Column */}
      <mesh position={[0, -0.05, 0]} material={gold}>
        <cylinderGeometry args={[0.055, 0.1, 3.4, 20]} />
      </mesh>
      <mesh position={[0, -0.05, 0]} rotation-x={0} material={steel}>
        <cylinderGeometry args={[0.115, 0.115, 0.9, 20]} />
      </mesh>

      {/* Pivot */}
      <mesh position={[0, 1.68, 0]} material={gold}>
        <sphereGeometry args={[0.2, seg, seg]} />
      </mesh>
      <mesh position={[0, 1.68, 0]} material={glow} scale={0.45}>
        <sphereGeometry args={[0.2, 16, 16]} />
      </mesh>

      {/* Beam */}
      <group ref={beam} position={[0, 1.68, 0]}>
        <mesh rotation-z={Math.PI / 2} material={gold}>
          <capsuleGeometry args={[0.045, 4.0, 6, 16]} />
        </mesh>
        <mesh rotation-z={Math.PI / 2} material={steel} scale={[1.6, 0.9, 1.6]}>
          <capsuleGeometry args={[0.05, 1.2, 6, 16]} />
        </mesh>

        {[-1, 1].map((side) => (
          <group key={side} position={[side * 2.05, 0, 0]} ref={side < 0 ? leftHang : rightHang}>
            <mesh material={gold}>
              <sphereGeometry args={[0.09, 16, 16]} />
            </mesh>
            <mesh material={glow} scale={0.4}>
              <sphereGeometry args={[0.09, 12, 12]} />
            </mesh>
            <Pan gold={gold} steel={steel} seg={seg} />
          </group>
        ))}
      </group>
    </group>
  )
}
