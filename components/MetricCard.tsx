import { ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: number | string
  icon?: ReactNode
  trend?: number
  platform?: string
}

export const MetricCard = ({ label, value, icon, trend, platform }: MetricCardProps) => {
  return (
    <div className="card-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-3xl font-bold mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend !== undefined && (
            <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}% vs last week
            </p>
          )}
        </div>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </div>
      {platform && (
        <p className="text-xs text-gray-500 mt-3 uppercase tracking-wide">{platform}</p>
      )}
    </div>
  )
}
