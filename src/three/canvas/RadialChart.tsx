import { useEffect, useMemo, useRef } from 'react'

import { useThree } from '@react-three/fiber'
import { InstancedMesh, Object3D } from 'three'

import { ChartProps, getInstanceColor, scaleValue } from '@/three/canvas/chartUtils'

export function RadialChart(props: ChartProps) {
  const { sampleCount, data, marker } = props
  const meshRef = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const { size: sceneSize } = useThree()

  useEffect(() => {
    if (!meshRef.current) return

    const { width, height } = sceneSize
    const maxRadius = Math.min(width, height) * 0.42
    const ringThickness = Math.max(1.5, ((Math.PI * 2 * maxRadius) / sampleCount) * 0.65)

    for (let i = 0; i < sampleCount; i++) {
      const value = data[i]
      const length = scaleValue(value, maxRadius)
      const angle = (i / sampleCount) * Math.PI * 2 - Math.PI / 2
      const midRadius = length / 2

      dummy.position.set(Math.cos(angle) * midRadius, Math.sin(angle) * midRadius, 0)
      dummy.scale.set(ringThickness, Math.max(length, 0.5), 1)
      dummy.rotation.z = angle + Math.PI / 2
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
