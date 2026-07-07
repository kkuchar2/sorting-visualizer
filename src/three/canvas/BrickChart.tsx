import { useEffect, useMemo, useRef } from 'react'

import { useThree } from '@react-three/fiber'
import { InstancedMesh, Object3D } from 'three'

import { ChartProps, getInstanceColor, scaleValue } from '@/three/canvas/chartUtils'

export function BrickChart(props: ChartProps) {
  const { sampleCount, data, marker } = props
  const meshRef = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const { size: sceneSize } = useThree()

  useEffect(() => {
    if (!meshRef.current) return

    const { width, height } = sceneSize
    const rowHeight = height / sampleCount
    const maxLength = width * 0.9
    const startX = -width / 2

    for (let i = 0; i < sampleCount; i++) {
      const value = data[i]
      const length = scaleValue(value, maxLength)
      const y = height / 2 - rowHeight * i - rowHeight / 2

      dummy.scale.set(length, Math.max(rowHeight * 0.75, 0.5), 1)
      dummy.position.set(startX + length / 2, y, 0)
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
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}
