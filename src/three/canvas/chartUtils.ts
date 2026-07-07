import { Color } from 'three'

import { MAX_SAMPLE_VALUE } from '@/config'

export const CHART_BAR_COLOR = '#c5dcc8'
export const CHART_MARKER_COLOR = '#d4655f'

export interface ChartProps {
  sampleCount: number
  data: number[]
  marker?: number
}

export const getInstanceColor = (index: number, marker?: number) =>
  new Color(index === marker ? CHART_MARKER_COLOR : CHART_BAR_COLOR)

const HEATMAP_STOPS: Array<{ t: number; color: string }> = [
  { t: 0, color: '#1a3352' },
  { t: 0.2, color: '#2a6f8f' },
  { t: 0.4, color: '#3a9a6a' },
  { t: 0.6, color: '#9fbc4a' },
  { t: 0.8, color: '#e8a43a' },
  { t: 1, color: '#e05a4f' },
]

export const getHeatmapColor = (value: number, index: number, marker?: number) => {
  if (index === marker) {
    return new Color('#ffffff')
  }

  const amount = Math.min(1, Math.max(0, value / MAX_SAMPLE_VALUE))

  for (let i = 0; i < HEATMAP_STOPS.length - 1; i++) {
    const current = HEATMAP_STOPS[i]
    const next = HEATMAP_STOPS[i + 1]

    if (amount >= current.t && amount <= next.t) {
      const range = next.t - current.t || 1
      const localAmount = (amount - current.t) / range
      return new Color(current.color).lerp(new Color(next.color), localAmount)
    }
  }

  return new Color(HEATMAP_STOPS[HEATMAP_STOPS.length - 1].color)
}

export const getGridLayout = (width: number, height: number, sampleCount: number) => {
  const cols = Math.max(1, Math.ceil(Math.sqrt((sampleCount * width) / height)))
  const rows = Math.ceil(sampleCount / cols)
  const cellWidth = width / cols
  const cellHeight = height / rows
  const offsetX = -width / 2 + cellWidth / 2
  const offsetY = height / 2 - cellHeight / 2

  return { cols, rows, cellWidth, cellHeight, offsetX, offsetY }
}

export const scaleValue = (value: number, maxSize: number) => (value / MAX_SAMPLE_VALUE) * maxSize

export const calculateBarsSizes = (width: number, barsCount: number) => {
  let maxBarWidth = width / barsCount
  let spacing = 0
  let barWidth = 1
  let min = Math.min()
  let targetBarWidth = -1
  let targetSpacing = -1

  while (barWidth <= maxBarWidth) {
    while (spacing <= 1) {
      const diff = width - barsCount * (barWidth + spacing)

      if (diff < min && diff > 0) {
        min = diff
        targetSpacing = spacing
        targetBarWidth = barWidth
      }

      spacing++
    }
    barWidth++
    spacing = 0
  }

  barWidth = targetBarWidth
  spacing = targetSpacing

  if (barWidth === -1) {
    barWidth = maxBarWidth
    spacing = 0
  }

  return { barWidth, spacing }
}

export const getRowLayout = (width: number, sampleCount: number) => {
  const { barWidth, spacing } = calculateBarsSizes(width, sampleCount)
  const offsetX = Math.floor((-sampleCount * (barWidth + spacing)) / 2)

  return { barWidth, spacing, offsetX }
}
