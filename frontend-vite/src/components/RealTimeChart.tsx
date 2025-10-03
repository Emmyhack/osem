import { useEffect, useRef, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface RealTimeChartProps {
  type: 'line' | 'bar' | 'doughnut'
  data: number[]
  labels: string[]
  title: string
  color?: string
  gradient?: boolean
  height?: number
  updateInterval?: number
}

export const RealTimeChart = ({ 
  type, 
  data, 
  labels, 
  title, 
  color = '#8b5cf6',
  gradient = true,
  height = 300,
  updateInterval = 5000 
}: RealTimeChartProps) => {
  const chartRef = useRef<ChartJS>(null)
  const [chartData, setChartData] = useState<ChartData<any>>({
    labels: [],
    datasets: []
  })

  useEffect(() => {
    const canvas = chartRef.current?.canvas
    const ctx = canvas?.getContext('2d')

    if (!ctx || !canvas) return

    // Create gradient
    const createGradient = (color: string) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, color.replace(')', ', 0.1)').replace('rgb', 'rgba'))
      return gradient
    }

    const baseColor = color
    const gradientColor = gradient ? createGradient(baseColor) : baseColor

    if (type === 'line') {
      setChartData({
        labels,
        datasets: [
          {
            label: title,
            data,
            borderColor: baseColor,
            backgroundColor: gradientColor,
            borderWidth: 2,
            fill: gradient,
            tension: 0.4,
            pointBackgroundColor: baseColor,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          }
        ]
      })
    } else if (type === 'bar') {
      setChartData({
        labels,
        datasets: [
          {
            label: title,
            data,
            backgroundColor: gradientColor,
            borderColor: baseColor,
            borderWidth: 1,
            borderRadius: 4,
          }
        ]
      })
    } else if (type === 'doughnut') {
      const colors = [
        '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'
      ]
      setChartData({
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors.slice(0, data.length),
            borderColor: colors.slice(0, data.length),
            borderWidth: 2,
          }
        ]
      })
    }
  }, [data, labels, title, color, gradient, type])

  const options: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: type === 'doughnut',
        position: 'bottom' as const,
        labels: {
          color: '#e5e7eb',
          font: {
            size: 12
          },
          padding: 20
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#f3f4f6',
        bodyColor: '#d1d5db',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            if (type === 'doughnut') {
              const percentage = ((context.parsed * 100) / data.reduce((a, b) => a + b, 0)).toFixed(1)
              return `${context.label}: ${percentage}%`
            }
            return `${context.dataset.label}: ${context.formattedValue}`
          }
        }
      }
    },
    scales: type !== 'doughnut' ? {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11
          },
          callback: function(value) {
            if (typeof value === 'number' && value >= 1000000) {
              return '$' + (value / 1000000).toFixed(1) + 'M'
            } else if (typeof value === 'number' && value >= 1000) {
              return '$' + (value / 1000).toFixed(0) + 'K'
            }
            return '$' + value
          }
        }
      }
    } : {},
    animation: {
      duration: 750,
      easing: 'easeOutQuart'
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  }

  if (type === 'line') {
    return <Line ref={chartRef} data={chartData} options={options} height={height} />
  } else if (type === 'bar') {
    return <Bar ref={chartRef} data={chartData} options={options} height={height} />
  } else {
    return <Doughnut ref={chartRef} data={chartData} options={options} height={height} />
  }
}

// Live TVL Chart Component
export const LiveTVLChart = ({ pools }: { pools: any[] }) => {
  const [tvlData, setTvlData] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([])

  useEffect(() => {
    const updateTVL = () => {
      const currentTVL = pools.reduce((sum, pool) => sum + (pool.tvl || 0), 0)
      const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      
      setTvlData(prev => {
        const newData = [...prev, currentTVL]
        return newData.length > 20 ? newData.slice(-20) : newData
      })
      
      setLabels(prev => {
        const newLabels = [...prev, newTime]
        return newLabels.length > 20 ? newLabels.slice(-20) : newLabels
      })
    }

    // Initial update
    updateTVL()

    // Update every 30 seconds
    const interval = setInterval(updateTVL, 30000)
    return () => clearInterval(interval)
  }, [pools])

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Live Total Value Locked</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400">Live</span>
        </div>
      </div>
      <div style={{ height: '250px' }}>
        <RealTimeChart
          type="line"
          data={tvlData}
          labels={labels}
          title="TVL ($)"
          color="#10b981"
          gradient={true}
        />
      </div>
    </div>
  )
}

// Protocol Distribution Chart
export const ProtocolDistributionChart = ({ pools }: { pools: any[] }) => {
  const protocolNames = pools.map(pool => pool.protocol || 'Unknown')
  const protocolTVLs = pools.map(pool => pool.tvl || 0)

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Protocol Distribution</h3>
      <div style={{ height: '300px' }}>
        <RealTimeChart
          type="doughnut"
          data={protocolTVLs}
          labels={protocolNames}
          title="TVL Distribution"
        />
      </div>
    </div>
  )
}

// APY Comparison Chart
export const APYComparisonChart = ({ pools }: { pools: any[] }) => {
  const protocolNames = pools.map(pool => pool.protocol?.split(' ')[0] || 'Unknown')
  const apyValues = pools.map(pool => pool.apy || 0)

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">APY Comparison</h3>
      <div style={{ height: '250px' }}>
        <RealTimeChart
          type="bar"
          data={apyValues}
          labels={protocolNames}
          title="APY (%)"
          color="#8b5cf6"
          gradient={true}
        />
      </div>
    </div>
  )
}

export default RealTimeChart