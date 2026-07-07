import { BarChart } from '@/three/canvas/BarChart'
import { BrickChart } from '@/three/canvas/BrickChart'
import { ChartProps } from '@/three/canvas/chartUtils'
import { DotChart } from '@/three/canvas/DotChart'
import { HeatmapChart } from '@/three/canvas/HeatmapChart'
import { RadialChart } from '@/three/canvas/RadialChart'
import { SpiralChart } from '@/three/canvas/SpiralChart'
import { StickChart } from '@/three/canvas/StickChart'
import { VisualMode } from '@/config/visualModes'

interface ChartViewProps extends ChartProps {
  mode: VisualMode
}

export function ChartView(props: ChartViewProps) {
  const { mode, ...chartProps } = props

  switch (mode) {
    case 'sticks':
      return <StickChart {...chartProps} />
    case 'dots':
      return <DotChart {...chartProps} />
    case 'bricks':
      return <BrickChart {...chartProps} />
    case 'radial':
      return <RadialChart {...chartProps} />
    case 'spiral':
      return <SpiralChart {...chartProps} />
    case 'heatmap':
      return <HeatmapChart {...chartProps} />
    case 'bars':
    default:
      return <BarChart {...chartProps} />
  }
}
