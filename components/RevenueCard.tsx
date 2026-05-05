import { DollarSign } from 'lucide-react'

interface RevenueCardProps {
  monthly: number
  yearly: number
  platform: string
}

export const RevenueCard = ({ monthly, yearly, platform }: RevenueCardProps) => {
  return (
    <div className="card-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-blue-900 font-medium flex items-center gap-2">
            <DollarSign size={16} />
            Estimated Monthly Revenue
          </p>
          <p className="text-3xl font-bold mt-2 text-blue-950">
            ${monthly.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-sm text-blue-900 mt-2">
            ${yearly.toLocaleString('en-US', { maximumFractionDigits: 0 })} yearly
          </p>
        </div>
        <div className="text-4xl">💰</div>
      </div>
      <p className="text-xs text-blue-800 mt-4 p-2 bg-white/50 rounded">
        ⓘ Based on average rates for {platform}. Actual revenue may vary based on location, content type, and audience demographics.
      </p>
    </div>
  )
}
