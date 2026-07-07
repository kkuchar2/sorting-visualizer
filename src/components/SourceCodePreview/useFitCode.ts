import { useLayoutEffect, useRef } from 'react'

const PADDING = 32
const MIN_FONT_SIZE = 8
const MAX_FONT_SIZE = 13.5

export const useFitCode = (source: string) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLPreElement>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    const content = contentRef.current

    if (!container || !content) {
      return
    }

    const fit = () => {
      const maxWidth = Math.max(container.clientWidth - PADDING, 1)
      const maxHeight = Math.max(container.clientHeight - PADDING, 1)

      let low = MIN_FONT_SIZE
      let high = MAX_FONT_SIZE
      let best = MIN_FONT_SIZE

      while (low <= high) {
        const mid = Math.round(((low + high) / 2) * 4) / 4
        content.style.fontSize = `${mid}px`
        content.style.transform = 'none'

        const fits = content.scrollWidth <= maxWidth && content.scrollHeight <= maxHeight

        if (fits) {
          best = mid
          low = mid + 0.25
        } else {
          high = mid - 0.25
        }
      }

      content.style.fontSize = `${best}px`
    }

    fit()

    const observer = new ResizeObserver(fit)
    observer.observe(container)

    return () => observer.disconnect()
  }, [source])

  return { containerRef, contentRef }
}
