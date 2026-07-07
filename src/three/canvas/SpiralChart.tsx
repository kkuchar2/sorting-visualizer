import { useEffect, useMemo, useRef } from 'react'

import { useThree } from '@react-three/fiber'
import { InstancedMesh, Object3D } from 'three'

import { ChartProps, getInstanceColor, scaleValue } from '@/three/canvas/chartUtils'

export function SpiralChart(props: ChartProps) {
  const { sampleCount, data, marker } = props
  const meshRef = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const { size: sceneSize } = useThree()

  useEffect(() => {
    if (!meshRef.current) return

    const { width, height } = sceneSize
    const maxRadius = Math.min(width, height) * 0.42
    const turns = 2.5
    const dotSize = Math.max(2, Math.min(8, (Math.PI * 2 * maxRadius) / sampleCount))

    for (let i = 0; i < sampleCount; i++) {
      const value = data[i]
      const progress = i / Math.max(sampleCount - 1, 1)
      const angle = progress * Math.PI * 2 * turns - Math.PI / 2
      const radius = progress * maxRadius * 0.75 + scaleValue(value, maxRadius * 0.2)

      dummy.scale.set(dotSize, dotSize, 1)
      dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      meshRef.current.setColorAt(i, getInstanceColor(i, marker))
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  }, [sceneSize, sampleCount, data, marker, dummy])

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, sampleCount]}>
      <circleGeometry args={[0.5, 10]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}
