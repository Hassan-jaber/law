import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** Soft gold dust drifting slowly around the scale. */
export default function Particles({ count = 400, speed = 1 }) {
  const ref = useRef()

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Distribute in a loose shell around the scale
      const r = 2.6 + Math.random() * 3.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.15
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.85
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [count])

  const texture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const ctx = c.getContext('2d')
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, 'rgba(255,236,170,1)')
    grad.addColorStop(0.35, 'rgba(230,200,120,0.55)')
    grad.addColorStop(1, 'rgba(201,162,75,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 64, 64)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.y = t * 0.025 * speed
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.05 * speed
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        map={texture}
        size={0.11}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
