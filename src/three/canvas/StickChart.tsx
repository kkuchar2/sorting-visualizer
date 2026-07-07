import { useEffect, useMemo, useRef } from 'react'

import { useThree } from '@react-three/fiber'
import { InstancedMesh, Object3D } from 'three'

import { ChartProps, getInstanceColor, getRowLayout, scaleValue } from '@/three/canvas/chartUtils'

export function StickChart(props: ChartProps) {
  const { sampleCount, data, marker } = props
  const meshRef = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const { size: sceneSize } = useThree()

  useEffect(() => {
    if (!meshRef.current) return

    const { width, height } = sceneSize
    const { barWidth, spacing, offsetX } = getRowLayout(width, sampleCount)
    const stickWidth = Math.min(2, Math.max(1, barWidth * 0.2))

    for (let i = 0; i < sampleCount; i++) {
      const value = data[i]
      const stickHeight = scaleValue(value, height)

      dummy.scale.set(stickWidth, stickHeight, 1)
      dummy.position.set(barWidth / 2 + barWidth * i + spacing * i + offsetX, -(1 - stickHeight) / 2 - height / 2, 0)
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
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}
