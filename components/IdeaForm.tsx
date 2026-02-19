'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { v4 as uuidv4 } from 'uuid'
import { Button, Input, Textarea, ScaleSelector } from './ui'
import { ideaSchema, IdeaFormData } from '@/lib/schemas'
import {
  Idea,
  OPTIMISTIC_OUTCOME_LABELS,
  SUCCESS_LIKELIHOOD_LABELS,
} from '@/lib/types'

const TLDR_MIN_LENGTH = 10
const DETAILS_MIN_LENGTH = 25

interface IdeaFormProps {
  onSave: (idea: Idea) => Promise<boolean>
  onCancel: () => void
  initialData?: Idea
  ideaNumber: number
}

export default function IdeaForm({
  onSave,
  onCancel,
  initialData,
  ideaNumber,
}: IdeaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitCount, setSubmitCount] = useState(0)

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<IdeaFormData>({
    resolver: zodResolver(ideaSchema),
    defaultValues: initialData || {
      id: uuidv4(),
      tldr: '',
      details: '',
      initialExperiment: '',
      optimisticOutcome: 0,
      successLikelihood: 0,
    },
    mode: 'onChange', // Enable real-time validation
  })

  // Reset form when initialData changes (switching between add/edit modes)
  useEffect(() => {
    if (initialData) {
      reset(initialData)
    } else {
      reset({
        id: uuidv4(),
        tldr: '',
        details: '',
        initialExperiment: '',
        optimisticOutcome: 0,
        successLikelihood: 0,
      })
    }
  }, [initialData, reset])

  // Focus TLDR input after successful submission
  useEffect(() => {
    if (submitCount > 0) {
      setFocus('tldr')
    }
  }, [submitCount, setFocus])

  const tldrValue = watch('tldr') || ''
  const detailsValue = watch('details') || ''

  const tldrLength = tldrValue.length
  const detailsLength = detailsValue.length

  const onSubmit = async (data: IdeaFormData) => {
    setIsSubmitting(true)
    const success = await onSave(data as Idea)
    setIsSubmitting(false)

    // Reset form for next idea (only for new ideas, not edits, and only on success)
    if (success && !initialData) {
      reset({
        id: uuidv4(),
        tldr: '',
        details: '',
        initialExperiment: '',
        optimisticOutcome: 0,
        successLikelihood: 0,
      })
      setSubmitCount((c) => c + 1)
    }
  }

  const handleSaveClick = () => {
    handleSubmit(onSubmit)()
  }

  const getCharacterHint = (current: number, min: number) => {
    if (current === 0) return null
    if (current < min) {
      return (
        <span className="text-amber-600 font-medium">
          {min - current} more character{min - current !== 1 ? 's' : ''} needed
        </span>
      )
    }
    return (
      <span className="text-emerald-600 flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {current} characters
      </span>
    )
  }

  return (
    <div
      className="space-y-6 bg-gradient-to-b from-gray-50/50 to-white border border-gray-200 rounded-xl p-6 shadow-sm animate-fade-in"
      aria-labelledby={`idea-form-heading-${ideaNumber}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-semibold text-sm">
          {ideaNumber}
        </div>
        <h3
          id={`idea-form-heading-${ideaNumber}`}
          className="text-lg font-semibold text-gray-900"
        >
          {initialData ? 'Edit Idea' : 'New Idea'}
        </h3>
      </div>

      <div className="space-y-5">
        <div>
          <Input
            label="TLDR: In a single sentence, what is your idea for a promising but currently neglected approach to AI alignment?"
            placeholder="e.g., Use conservation laws from physics to create alignment properties that persist through self-modification"
            required
            error={errors.tldr?.message}
            {...register('tldr')}
          />
          <div className="mt-1.5 text-xs text-gray-500 flex justify-between items-center">
            <span>Minimum {TLDR_MIN_LENGTH} characters</span>
            {getCharacterHint(tldrLength, TLDR_MIN_LENGTH)}
          </div>
        </div>

        <div>
          <Textarea
            label="Details: Can be a longer writeup, links, etc. Whatever you feel effectively gets the idea across."
            placeholder="Explain your idea in more detail. Include any relevant links, references, papers, or context."
            required
            error={errors.details?.message}
            {...register('details')}
          />
          <div className="mt-1.5 text-xs text-gray-500 flex justify-between items-center">
            <span>Minimum {DETAILS_MIN_LENGTH} characters</span>
            {getCharacterHint(detailsLength, DETAILS_MIN_LENGTH)}
          </div>
        </div>

        <Textarea
          label="Initial Experiment"
          placeholder="If you had to design an initial experiment to test this idea, what would it look like? (optional but helpful)"
          error={errors.initialExperiment?.message}
          {...register('initialExperiment')}
          className="min-h-[100px]"
        />

        <div className="space-y-6 pt-2">
          <Controller
            name="optimisticOutcome"
            control={control}
            render={({ field }) => (
              <ScaleSelector
                name="optimisticOutcome"
                label='Maximally optimistic outcome: How much does this contribute to solving the "core problem of alignment" (building safe, self-improving superintelligence)?'
                min={1}
                max={5}
                value={field.value || undefined}
                onChange={field.onChange}
                required
                error={errors.optimisticOutcome?.message}
                labels={OPTIMISTIC_OUTCOME_LABELS}
              />
            )}
          />

          <Controller
            name="successLikelihood"
            control={control}
            render={({ field }) => (
              <ScaleSelector
                name="successLikelihood"
                label="With unlimited resources (compute & researchers) and 1 year, how likely is achieving the maximally optimistic outcome?"
                min={1}
                max={10}
                value={field.value || undefined}
                onChange={field.onChange}
                required
                error={errors.successLikelihood?.message}
                labels={SUCCESS_LIKELIHOOD_LABELS}
                showLabelsAsButtons
              />
            )}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        {initialData && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="button" onClick={handleSaveClick} loading={isSubmitting}>
          {initialData ? 'Update Idea' : 'Submit & Add Another'}
        </Button>
      </div>
    </div>
  )
}
