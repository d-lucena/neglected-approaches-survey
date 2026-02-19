'use client'

import { forwardRef } from 'react'

interface ScaleSelectorProps {
  name: string
  min: number
  max: number
  value?: number
  onChange?: (value: number) => void
  error?: string
  label?: string
  required?: boolean
  labels?: Record<number, string>
  showLabelsAsButtons?: boolean
}

const ScaleSelector = forwardRef<HTMLDivElement, ScaleSelectorProps>(
  (
    { name, min, max, value, onChange, error, label, required, labels = {}, showLabelsAsButtons = false },
    ref
  ) => {
    const range = Array.from({ length: max - min + 1 }, (_, i) => min + i)

    return (
      <div ref={ref} className="w-full">
        {label && (
          <p
            id={`${name}-label`}
            className="block text-sm font-medium text-gray-700 mb-3"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </p>
        )}
        <div
          className={`inline-grid gap-1.5 p-1 bg-gray-100/80 rounded-lg ${
            showLabelsAsButtons
              ? 'grid-cols-5'
              : max - min + 1 <= 5
                ? `grid-cols-${max - min + 1}`
                : 'grid-cols-5 sm:grid-cols-10'
          }`}
          role="radiogroup"
          aria-labelledby={`${name}-label`}
        >
          {range.map((num) => {
            const isSelected = value === num
            const buttonLabel = labels[num]
            const displayText = showLabelsAsButtons && buttonLabel ? buttonLabel : num

            return (
              <button
                key={num}
                type="button"
                onClick={() => onChange?.(num)}
                className={`
                  h-9 px-2 rounded-md text-sm font-medium
                  transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                  ${
                    isSelected
                      ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                  }
                `}
                role="radio"
                aria-checked={isSelected}
                aria-label={buttonLabel || `${num}`}
                title={buttonLabel}
              >
                {displayText}
              </button>
            )
          })}
        </div>
        {!showLabelsAsButtons && labels[min] && labels[max] && (
          <div className="flex justify-between mt-2 text-xs text-gray-500 max-w-[300px]">
            <span>{labels[min]}</span>
            <span>{labels[max]}</span>
          </div>
        )}
        {error && (
          <p
            id={`${name}-error`}
            className="mt-1.5 text-sm text-red-600 flex items-center gap-1"
            role="alert"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)

ScaleSelector.displayName = 'ScaleSelector'

export default ScaleSelector
