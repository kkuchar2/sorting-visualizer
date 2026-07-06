import { useLayoutEffect } from 'react'

import { useThree } from '@react-three/fiber'
import { OrthographicCamera } from 'three'

export function ChartCamera() {
  const { size, set } = useThree()

  useLayoutEffect(() => {
    set(({ camera }) => {
      if (camera instanceof OrthographicCamera) {
        camera.left = size.width / -2
        camera.right = size.width / 2
        camera.top = size.height / 2
        camera.bottom = size.height / -2
        camera.position.set(0, 0, 1)
        camera.zoom = 1
        camera.near = 0.1
        camera.far = 1000
        camera.updateProjectionMatrix()
      }

      return { camera }
    })
  }, [size, set])

  return null
}
