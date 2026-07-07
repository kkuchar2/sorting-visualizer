import { createStarryNight } from '@wooorm/starry-night'
import sourceJs from '@wooorm/starry-night/source.js'

let starryNightPromise: ReturnType<typeof createStarryNight> | null = null

export const javascriptScope = 'source.js'

export const loadStarryNight = () => {
  if (!starryNightPromise) {
    starryNightPromise = createStarryNight([sourceJs])
  }

  return starryNightPromise
}
