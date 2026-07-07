import { useEffect, useMemo, useRef } from 'react'

import { useThree } from '@react-three/fiber'
import { InstancedMesh, Object3D } from 'three'

import { ChartProps, getGridLayout, getInstanceColor } from '@/three/canvas/chartUtils'

export function HeatmapChart(props: ChartProps) {
  const { sampleCount, data, marker } = props
  const meshRef = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const { size: sceneSize } = useThree()

  useEffect(() => {
    if (!meshRef.current) return

    const { width, height } = sceneSize
    const { cols, cellWidth, cellHeight, offsetX, offsetY } = getGridLayout(width, height, sampleCount)
    const cellSize = Math.min(cellWidth, cellHeight) * 0.88

    for (let i = 0; i < sampleCount; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = offsetX + col * cellWidth
      const y = offsetY - row * cellHeight

      dummy.scale.set(cellSize, cellSize, 1)
      dummy.position.set(x, y, 0)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      meshRef.current.setColorAt(i, getInstanceColor(data[i], i, marker))
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
