'use client'

import { forwardRef } from 'react'

interface RadioOption {
  value: string
  label: string
}

interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  error?: string
  label?: string
  required?: boolean
  checkboxStyle?: boolean
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ name, options, value, onChange, error, label, required, checkboxStyle = false }, ref) => {
    return (
      <div ref={ref} className="w-full" role="radiogroup" aria-labelledby={`${name}-label`}>
        {label && (
          <p id={`${name}-label`} className="block text-sm font-medium text-gray-700 mb-3">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </p>
        )}
        <div className="space-y-2.5">
          {options.map((option) => {
            const isSelected = value === option.value

            return (
              <label
                key={option.value}
                className={`
                  flex items-start gap-3 p-3 rounded-lg border cursor-pointer
                  transition-all duration-200
                  ${isSelected
                    ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-100'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }
                `}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  onChange={(e) => onChange?.(e.target.value)}
                  className={`
                    mt-0.5 h-4 w-4 flex-shrink-0
                    border-gray-300 text-blue-600
                    focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0
                    ${checkboxStyle
                      ? 'rounded'
                      : 'rounded-full'
                    }
                  `}
                  aria-describedby={error ? `${name}-error` : undefined}
                />
                <span className="text-sm text-gray-700 leading-relaxed">{option.label}</span>
              </label>
            )
          })}
        </div>
        {error && (
          <p id={`${name}-error`} className="mt-2 text-sm text-red-600 flex items-center gap-1" role="alert">
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

RadioGroup.displayName = 'RadioGroup'

export default RadioGroup
