import { useEffect, useMemo, useRef } from 'react'

import { useThree } from '@react-three/fiber'
import { InstancedMesh, Object3D } from 'three'

import { ChartProps, getInstanceColor, getRowLayout, scaleValue } from '@/three/canvas/chartUtils'

export function DotChart(props: ChartProps) {
  const { sampleCount, data, marker } = props
  const meshRef = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const { size: sceneSize } = useThree()

  useEffect(() => {
    if (!meshRef.current) return

    const { width, height } = sceneSize
    const { barWidth, spacing, offsetX } = getRowLayout(width, sampleCount)
    const dotSize = Math.max(2, Math.min(barWidth * 0.85, 10))

    for (let i = 0; i < sampleCount; i++) {
      const value = data[i]
      const y = scaleValue(value, height) - height / 2
      const x = barWidth / 2 + barWidth * i + spacing * i + offsetX

      dummy.scale.set(dotSize, dotSize, 1)
      dummy.position.set(x, y, 0)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      meshRef.current.setColorAt(i, getInstanceColor(value, i, marker))
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  }, [sceneSize, sampleCount, data, marker, dummy])

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, sampleCount]}>
      <circleGeometry args={[0.5, 12]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}
