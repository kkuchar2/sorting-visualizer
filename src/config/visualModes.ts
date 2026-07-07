export type VisualMode = 'bars' | 'dots' | 'radial' | 'sticks' | 'bricks' | 'heatmap' | 'spiral'

export interface VisualModeOption {
  value: VisualMode
  label: string
}

export const visualModes: VisualModeOption[] = [
  { value: 'bars', label: 'Bars' },
  { value: 'sticks', label: 'Sticks' },
  { value: 'dots', label: 'Dots' },
  { value: 'bricks', label: 'Bricks' },
  { value: 'radial', label: 'Radial' },
  { value: 'spiral', label: 'Spiral' },
  { value: 'heatmap', label: 'Heatmap' },
]
