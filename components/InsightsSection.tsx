interface InsightsSectionProps {
  insights: string[]
}

export const InsightsSection = ({ insights }: InsightsSectionProps) => {
  return (
    <div className="card-lg">
      <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
      <div className="space-y-3">
        {insights.length === 0 ? (
          <p className="text-gray-500">Add a social account to see insights</p>
        ) : (
          insights.map((insight, idx) => (
            <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-lg">💡</span>
              <p className="text-sm text-gray-700">{insight}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
