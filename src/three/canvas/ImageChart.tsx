import { useEffect, useMemo, useRef } from 'react'

import { useThree } from '@react-three/fiber'
import { DataTexture, Mesh, MeshBasicMaterial, NearestFilter, RGBAFormat, SRGBColorSpace, UnsignedByteType } from 'three'

import { ChartProps } from '@/three/canvas/chartUtils'
import type { ImagePixelData } from '@/util/imageData'

interface ImageChartProps extends ChartProps {
  imagePixels: ImagePixelData
}

export function ImageChart(props: ImageChartProps) {
  const { sampleCount, data, marker, imagePixels } = props
  const meshRef = useRef<Mesh>(null)
  const textureRef = useRef<DataTexture | null>(null)
  const bufferRef = useRef<Uint8Array | null>(null)
  const { size: sceneSize } = useThree()
  const { width, height } = imagePixels

  useEffect(() => {
    bufferRef.current = new Uint8Array(width * height * 4)
    const texture = new DataTexture(bufferRef.current, width, height, RGBAFormat, UnsignedByteType)
    texture.minFilter = NearestFilter
    texture.magFilter = NearestFilter
    texture.colorSpace = SRGBColorSpace
    texture.flipY = true
    textureRef.current = texture

    const mesh = meshRef.current
    if (mesh) {
      const material = mesh.material as MeshBasicMaterial
      material.map = texture
      material.needsUpdate = true
    }

    return () => texture.dispose()
  }, [width, height])

  useEffect(() => {
    const texture = textureRef.current
    const dest = bufferRef.current
    if (!texture || !dest) return

    const { colors } = imagePixels

    for (let i = 0; i < sampleCount; i++) {
      const srcIndex = data[i]
      const srcOffset = srcIndex * 4
      const destOffset = i * 4
      dest[destOffset] = colors[srcOffset]
      dest[destOffset + 1] = colors[srcOffset + 1]
      dest[destOffset + 2] = colors[srcOffset + 2]
      dest[destOffset + 3] = colors[srcOffset + 3]
    }

    if (marker !== undefined && marker >= 0 && marker < sampleCount) {
      const destOffset = marker * 4
      dest[destOffset] = 255
      dest[destOffset + 1] = 255
      dest[destOffset + 2] = 255
    }

    texture.needsUpdate = true
  }, [sampleCount, data, marker, imagePixels])

  const { planeWidth, planeHeight } = useMemo(() => {
    const imageAspect = width / height
    const viewAspect = sceneSize.width / sceneSize.height

    if (imageAspect > viewAspect) {
      return {
        planeWidth: sceneSize.width,
        planeHeight: sceneSize.width / imageAspect,
      }
    }

    return {
      planeWidth: sceneSize.height * imageAspect,
      planeHeight: sceneSize.height,
    }
  }, [sceneSize, width, height])

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshBasicMaterial toneMapped={false} />
    </mesh>
  )
}
