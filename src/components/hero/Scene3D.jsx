import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import JusticeScale from './JusticeScale.jsx'
import Particles from './Particles.jsx'

/** Orbiting halo rings — a futuristic "digital" accent. */
function Halo({ speed }) {
  const a = useRef()
  const b = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    if (a.current) a.current.rotation.z = t * 0.12
    if (b.current) b.current.rotation.z = -t * 0.08
  })
  return (
    <group position={[0, 0.2, -0.6]}>
      <mesh ref={a} rotation-x={0.25}>
        <torusGeometry args={[3.5, 0.008, 6, 160]} />
        <meshBasicMaterial color="#c9a24b" transparent opacity={0.55} />
      </mesh>
      <mesh ref={b} rotation={[-0.35, 0.3, 0]}>
        <torusGeometry args={[4.2, 0.006, 6, 160]} />
        <meshBasicMaterial color="#e6cf8d" transparent opacity={0.28} />
      </mesh>
    </group>
  )
}

/**
 * Rig: auto-rotation + pointer response + scroll response.
 * `scroll.current.p` (0 → 1) is driven by GSAP ScrollTrigger in Hero.
 */
function Rig({ scroll, pointer, reduced, mobile, children }) {
  const group = useRef()
  const spin = useRef(0)

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    const d = Math.min(delta, 0.05)
    const p = scroll.current.p

    spin.current += d * (reduced ? 0 : 0.16)

    const px = reduced || mobile ? 0 : pointer.current.x
    const py = reduced || mobile ? 0 : pointer.current.y

    const targetY = spin.current + px * 0.35 + p * Math.PI * 0.9
    const targetX = -py * 0.14 + p * 0.18
    const targetPosX = p * (mobile ? 0 : -0.9)
    const targetPosY = p * 0.7
    const targetScale = 1 - p * 0.18

    const k = 1 - Math.pow(0.001, d) // frame-rate independent damping
    g.rotation.y += (targetY - g.rotation.y) * k
    g.rotation.x += (targetX - g.rotation.x) * k
    g.position.x += (targetPosX - g.position.x) * k
    g.position.y += (targetPosY - g.position.y) * k
    const s = g.scale.x + (targetScale - g.scale.x) * k
    g.scale.setScalar(s)
  })

  return <group ref={group}>{children}</group>
}

export default function Scene3D({ scroll, pointer, reduced, mobile }) {
  const wrap = useRef(null)
  const [visible, setVisible] = useState(true)

  // Pause rendering entirely when the hero is off-screen
  useEffect(() => {
    if (!wrap.current) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 })
    io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        dpr={mobile ? [1, 1.5] : [1, 1.75]}
        camera={{ position: [0, 0.2, 9.2], fov: mobile ? 46 : 38 }}
        gl={{
          alpha: true,
          antialias: !mobile,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        frameloop={visible ? 'always' : 'never'}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} color="#fff2d0" />
        <pointLight position={[-5, 1, 3]} intensity={18} color="#c9a24b" distance={14} />
        <pointLight position={[3, -2, -4]} intensity={10} color="#5b7bd9" distance={14} />

        {/* Procedural environment — no HDR download */}
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={4} position={[0, 5, -6]} scale={[12, 3, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={3} position={[-6, 1, 2]} scale={[2, 8, 1]} color="#f1d68a" />
          <Lightformer form="rect" intensity={2} position={[6, 0, 3]} scale={[2, 8, 1]} color="#8fa8ff" />
          <Lightformer form="ring" intensity={2} position={[0, -4, 4]} scale={6} color="#ffe9b0" />
        </Environment>

        <Rig scroll={scroll} pointer={pointer} reduced={reduced} mobile={mobile}>
          <JusticeScale mobile={mobile} />
          <Halo speed={reduced ? 0 : 1} />
        </Rig>
        <Particles count={mobile ? 180 : 420} speed={reduced ? 0 : 1} />
      </Canvas>
    </div>
  )
}
