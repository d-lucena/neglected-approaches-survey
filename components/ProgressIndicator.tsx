'use client'

interface ProgressIndicatorProps {
  count: number
  target?: number
}

export default function ProgressIndicator({
  count,
  target = 10,
}: ProgressIndicatorProps) {
  const percentage = Math.min((count / target) * 100, 100)
  const isTargetReached = count >= target

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-5">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-blue-200/50" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-indigo-200/30" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-blue-100">
              <span className="text-xl font-bold text-blue-600">{count}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {count === 1 ? 'Idea' : 'Ideas'} Submitted
              </p>
              <p className="text-xs text-gray-500">
                {isTargetReached ? 'Great progress!' : `Goal: ${target}+ ideas`}
              </p>
            </div>
          </div>
          {isTargetReached && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs font-medium">Target reached</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-white/60 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-blue-500 to-indigo-500"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={count}
            aria-valuemin={0}
            aria-valuemax={target}
            aria-label={`${count} ideas submitted`}
          />
        </div>

        <p className="mt-2.5 text-xs text-gray-600">
          {count === 0
            ? 'Add your first idea below'
            : count < target
              ? 'Feel free to submit as many ideas as you have'
              : 'Feel free to keep adding more ideas'}
        </p>
      </div>
    </div>
  )
}
