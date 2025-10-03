import { useState, useEffect } from 'react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
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
  ArcElement
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
)

interface InsuranceCoverageData {
  totalCovered: number
  activeClaims: number
  claimsProcessed: number
  riskDistribution: { [key: string]: number }
  coverageHistory: Array<{ timestamp: string; amount: number }>
}

// Coverage Trend Chart
export const CoverageTrendChart = ({ data }: { data: InsuranceCoverageData }) => {
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: []
  })

  useEffect(() => {
    const labels = data.coverageHistory.map(h => 
      new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    )
    const amounts = data.coverageHistory.map(h => h.amount)

    setChartData({
      labels,
      datasets: [
        {
          label: 'Coverage Amount',
          data: amounts,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 3
        }
      ]
    })
  }, [data])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#f3f4f6',
        bodyColor: '#d1d5db',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            return `Coverage: $${context.parsed.y.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 }
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
          callback: function(value: any) {
            return '$' + (value / 1000000).toFixed(1) + 'M'
          }
        }
      }
    },
    animation: {
      duration: 750,
      easing: 'easeOutQuart' as const
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Insurance Coverage Trend</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-blue-400">Live</span>
        </div>
      </div>
      <div style={{ height: '250px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}

// Claims Status Chart
export const ClaimsStatusChart = ({ data }: { data: InsuranceCoverageData }) => {
  const chartData = {
    labels: ['Active Claims', 'Processed Claims', 'Pending Review'],
    datasets: [
      {
        data: [
          data.activeClaims,
          data.claimsProcessed,
          Math.max(0, data.totalCovered * 0.001) // Estimated pending
        ],
        backgroundColor: [
          '#f59e0b',
          '#10b981',
          '#6b7280'
        ],
        borderColor: [
          '#f59e0b',
          '#10b981',
          '#6b7280'
        ],
        borderWidth: 2
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#e5e7eb',
          font: { size: 12 },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#f3f4f6',
        bodyColor: '#d1d5db',
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((context.parsed * 100) / total).toFixed(1)
            return `${context.label}: ${percentage}%`
          }
        }
      }
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Claims Processing Status</h3>
      <div style={{ height: '300px' }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  )
}

// Risk Distribution Chart
export const RiskDistributionChart = ({ data }: { data: InsuranceCoverageData }) => {
  const labels = Object.keys(data.riskDistribution)
  const values = Object.values(data.riskDistribution)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Risk Amount',
        data: values,
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: '#8b5cf6',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#f3f4f6',
        bodyColor: '#d1d5db',
        callbacks: {
          label: function(context: any) {
            return `Risk: $${context.parsed.y.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
          maxRotation: 45
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
          callback: function(value: any) {
            return '$' + (value / 1000).toFixed(0) + 'K'
          }
        }
      }
    },
    animation: {
      duration: 750,
      easing: 'easeOutQuart' as const
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Risk Distribution by Category</h3>
      <div style={{ height: '250px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}

// Live Insurance Dashboard
export const LiveInsuranceDashboard = () => {
  const [insuranceData, setInsuranceData] = useState<InsuranceCoverageData>({
    totalCovered: 0,
    activeClaims: 0,
    claimsProcessed: 0,
    riskDistribution: {},
    coverageHistory: []
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const updateInsuranceData = () => {
      // Simulate real-time data updates
      const newData: InsuranceCoverageData = {
        totalCovered: Math.floor(Math.random() * 50000000) + 100000000,
        activeClaims: Math.floor(Math.random() * 50) + 10,
        claimsProcessed: Math.floor(Math.random() * 200) + 500,
        riskDistribution: {
          'Smart Contract': Math.floor(Math.random() * 10000000) + 5000000,
          'Oracle Failure': Math.floor(Math.random() * 5000000) + 2000000,
          'Liquidity Risk': Math.floor(Math.random() * 8000000) + 3000000,
          'Market Risk': Math.floor(Math.random() * 12000000) + 6000000,
          'Protocol Risk': Math.floor(Math.random() * 7000000) + 4000000
        },
        coverageHistory: []
      }

      // Generate coverage history
      const history = []
      const now = Date.now()
      for (let i = 19; i >= 0; i--) {
        history.push({
          timestamp: new Date(now - i * 30000).toISOString(),
          amount: Math.floor(Math.random() * 20000000) + 80000000
        })
      }
      newData.coverageHistory = history

      setInsuranceData(newData)
      setIsLoading(false)
    }

    // Initial load
    updateInsuranceData()

    // Update every 30 seconds
    const interval = setInterval(updateInsuranceData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-pulse">
            <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-white/5 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Total Coverage</div>
          <div className="text-2xl font-bold text-white">
            ${(insuranceData.totalCovered / 1000000).toFixed(1)}M
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Active Claims</div>
          <div className="text-2xl font-bold text-amber-400">
            {insuranceData.activeClaims}
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Claims Processed</div>
          <div className="text-2xl font-bold text-green-400">
            {insuranceData.claimsProcessed}
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-blue-400">
            {((insuranceData.claimsProcessed / (insuranceData.claimsProcessed + insuranceData.activeClaims)) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CoverageTrendChart data={insuranceData} />
        <ClaimsStatusChart data={insuranceData} />
      </div>
      
      <RiskDistributionChart data={insuranceData} />
    </div>
  )
}

export default LiveInsuranceDashboard