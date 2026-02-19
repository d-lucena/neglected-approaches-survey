'use client'

import { UseFormRegister, FieldErrors, Control, Controller, UseFormWatch } from 'react-hook-form'
import { Input, RadioGroup } from './ui'
import { ContactInfo, COLLABORATION_LABELS } from '@/lib/types'

interface ContactInfoSectionProps {
  register: UseFormRegister<ContactInfo>
  errors: FieldErrors<ContactInfo>
  control: Control<ContactInfo>
  watch: UseFormWatch<ContactInfo>
}

const collaborationOptions = [
  {
    value: 'interested_in_collaboration',
    label: COLLABORATION_LABELS.interested_in_collaboration,
  },
  { value: 'ideas_only', label: COLLABORATION_LABELS.ideas_only },
  { value: 'other', label: COLLABORATION_LABELS.other },
]

export default function ContactInfoSection({
  register,
  errors,
  control,
  watch,
}: ContactInfoSectionProps) {
  const collaborationInterest = watch('collaborationInterest')

  return (
    <section aria-labelledby="contact-info-heading" className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 id="contact-info-heading" className="text-lg font-semibold text-gray-900">
            Your Information
          </h2>
          <p className="text-sm text-gray-500">
            Enter once, used for all your ideas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="researcher@institution.edu"
          required
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Name"
          type="text"
          placeholder="Your full name"
          required
          error={errors.name?.message}
          {...register('name')}
        />
      </div>

      <Input
        label="Institution"
        type="text"
        placeholder="University or organization (optional)"
        error={errors.institution?.message}
        {...register('institution')}
      />

      <div className="pt-2">
        <Controller
          name="collaborationInterest"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="collaborationInterest"
              label="Collaboration Interest"
              options={collaborationOptions}
              value={field.value}
              onChange={field.onChange}
              required
              checkboxStyle
              error={errors.collaborationInterest?.message}
            />
          )}
        />
      </div>

      {collaborationInterest === 'other' && (
        <div className="ml-6 animate-fade-in">
          <Input
            placeholder="Please describe your collaboration preference..."
            error={errors.collaborationOther?.message}
            {...register('collaborationOther')}
          />
        </div>
      )}
    </section>
  )
}
