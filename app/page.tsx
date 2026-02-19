'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui'
import {
  ContactInfoSection,
  IdeaForm,
  IdeaList,
  ProgressIndicator,
} from '@/components'
import { contactInfoSchema, ContactInfoFormData } from '@/lib/schemas'
import { Idea, ContactInfo } from '@/lib/types'
import { useFormPersistence } from '@/hooks/useFormPersistence'
import { submitIdea } from './actions/submitIdeas'

type FormMode = 'list' | 'add' | 'edit'

export default function SurveyPage() {
  const {
    contactInfo,
    ideas,
    setContactInfo,
    addIdea,
    updateIdea,
    deleteIdea,
    isInitialized,
  } = useFormPersistence()

  const [formMode, setFormMode] = useState<FormMode>('add')
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [hasInitializedMode, setHasInitializedMode] = useState(false)

  // Switch to list mode ONLY on initial load if there are saved ideas
  useEffect(() => {
    if (isInitialized && !hasInitializedMode) {
      if (ideas.length > 0) {
        setFormMode('list')
      }
      setHasInitializedMode(true)
    }
  }, [isInitialized, hasInitializedMode, ideas.length])

  const {
    register,
    control,
    formState: { errors },
    watch,
    reset,
    getValues,
  } = useForm<ContactInfoFormData>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: contactInfo,
  })

  // Sync form with persisted contact info
  useEffect(() => {
    reset(contactInfo)
  }, [contactInfo, reset])

  // Watch contact info changes and persist
  const watchedContactInfo = watch()
  useEffect(() => {
    const timeout = setTimeout(() => {
      const hasChanges =
        watchedContactInfo.email !== contactInfo.email ||
        watchedContactInfo.name !== contactInfo.name ||
        watchedContactInfo.institution !== contactInfo.institution ||
        watchedContactInfo.collaborationInterest !== contactInfo.collaborationInterest ||
        watchedContactInfo.collaborationOther !== contactInfo.collaborationOther

      if (hasChanges) {
        setContactInfo(watchedContactInfo as ContactInfo)
      }
    }, 500)
    return () => clearTimeout(timeout)
  }, [watchedContactInfo, contactInfo, setContactInfo])

  const handleAddIdea = () => {
    setFormMode('add')
    setEditingIdeaId(null)
    setSubmitError(null)
    setSubmitSuccess(null)
  }

  const handleEditIdea = (id: string) => {
    setEditingIdeaId(id)
    setFormMode('edit')
    setSubmitError(null)
    setSubmitSuccess(null)
  }

  const handleSaveIdea = useCallback(
    async (idea: Idea): Promise<boolean> => {
      setSubmitError(null)
      setSubmitSuccess(null)

      const currentContactInfo = getValues()

      // Validate contact info first
      const validationResult = contactInfoSchema.safeParse(currentContactInfo)
      if (!validationResult.success) {
        setSubmitError(
          `Please complete your contact information: ${validationResult.error.errors.map((e) => e.message).join(', ')}`
        )
        return false
      }

      try {
        const result = await submitIdea(currentContactInfo as ContactInfo, idea)

        if (result.success) {
          if (formMode === 'edit' && editingIdeaId) {
            updateIdea(editingIdeaId, idea)
            setFormMode('list')
          } else {
            addIdea(idea)
          }
          setEditingIdeaId(null)
          setSubmitSuccess('Idea submitted successfully!')
          setTimeout(() => setSubmitSuccess(null), 3000)
          return true
        } else {
          setSubmitError(result.message)
          return false
        }
      } catch {
        setSubmitError('Network error. Please try again.')
        return false
      }
    },
    [formMode, editingIdeaId, getValues, addIdea, updateIdea]
  )

  const handleCancelIdea = () => {
    setFormMode('list')
    setEditingIdeaId(null)
  }

  const handleDeleteIdea = (id: string) => {
    deleteIdea(id)
  }

  const editingIdea = editingIdeaId
    ? ideas.find((i) => i.id === editingIdeaId)
    : undefined

  return (
    <main className="min-h-screen py-8 px-4 sm:py-12 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Neglected Alignment Ideas
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Help us identify underexplored approaches to AI alignment
          </p>
        </header>

        {/* Introduction Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
          <div className="p-6 sm:p-8 space-y-5">
            <p className="text-gray-700 leading-relaxed">
              We (
              <a
                href="http://aialignmentfoundation.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline decoration-blue-200 hover:decoration-blue-400 underline-offset-2 transition-colors"
              >
                The Alignment Foundation
              </a>
              {' '}and{' '}
              <a
                href="https://ae.studio/alignment/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline decoration-blue-200 hover:decoration-blue-400 underline-offset-2 transition-colors"
              >
                AE Studio
              </a>
              ) are seeking ideas for underexplored approaches to AI alignment. Reviewers from our
              teams and partner institutions (such as DARPA) will evaluate submissions and allocate
              resources to promising concepts.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We are particularly interested in ambitious ideas outside mainstream alignment research,
              especially those addressing <span className="font-semibold text-gray-900">the core problem</span>: ensuring self-improving
              superintelligence maintains robust alignment without continuous human oversight.
            </p>

            {/* Examples section */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Examples of ideas we find interesting
              </h3>
              <div className="space-y-3">
                <div className="relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-blue-400 before:to-blue-200 before:rounded-full">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Continual Learning Robust Alignment</span> —
                    Creating systems that maintain aligned behavior despite significant weight changes,
                    developing &quot;alignment-positive selection pressures&quot; for continuously improving systems.
                  </p>
                </div>
                <div className="relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-indigo-400 before:to-indigo-200 before:rounded-full">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Novel Alignment Post-Training Objectives</span> —
                    Alternatives to standard human preference data approaches that yield more robust,
                    generalizable alignment.
                  </p>
                </div>
                <div className="relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-purple-400 before:to-purple-200 before:rounded-full">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Cross-Disciplinary Inspiration</span> —
                    Importing concepts from cognitive neuroscience (attention schemas, metacognition)
                    or physics (conservation laws, symmetry) to create persistent alignment properties.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 pt-4 border-t border-gray-100 flex items-start gap-2">
              <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              We encourage submitting as many ideas as you have (even 20+ ideas per researcher is fine).
              Each idea is submitted immediately when you save it.
            </p>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-6 sm:p-8">
          <ContactInfoSection
            register={register}
            errors={errors}
            control={control}
            watch={watch}
          />
        </div>

        {/* Ideas Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-6 sm:p-8 space-y-6">
          <section aria-labelledby="ideas-heading">
            <div className="flex items-center justify-between mb-6">
              <h2
                id="ideas-heading"
                className="text-xl font-semibold text-gray-900 tracking-tight"
              >
                Your Ideas
              </h2>
            </div>

            {formMode === 'list' && (
              <ProgressIndicator count={ideas.length} target={10} />
            )}

            {submitSuccess && (
              <div
                className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 animate-fade-in"
                role="status"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-emerald-800 text-sm font-medium">{submitSuccess}</p>
              </div>
            )}

            {submitError && (
              <div
                className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in"
                role="alert"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-red-800 text-sm">{submitError}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-100"
                    onClick={() => setSubmitError(null)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            )}

            <div className={formMode === 'list' ? 'mt-6' : ''}>
              {formMode === 'list' ? (
                <>
                  <IdeaList
                    ideas={ideas}
                    onEditIdea={handleEditIdea}
                    onDeleteIdea={handleDeleteIdea}
                  />
                  <div className="mt-6">
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      onClick={handleAddIdea}
                      className="w-full text-base py-4 rounded-xl"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add {ideas.length === 0 ? 'Your First' : 'Another'} Idea
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Show submitted ideas above the form */}
                  {ideas.length > 0 && (
                    <div className="mb-6">
                      <IdeaList
                        ideas={ideas}
                        onEditIdea={handleEditIdea}
                        onDeleteIdea={handleDeleteIdea}
                        compact
                      />
                    </div>
                  )}
                  <IdeaForm
                    onSave={handleSaveIdea}
                    onCancel={handleCancelIdea}
                    initialData={editingIdea}
                    ideaNumber={
                      formMode === 'edit'
                        ? ideas.findIndex((i) => i.id === editingIdeaId) + 1
                        : ideas.length + 1
                    }
                    savedIdeasCount={ideas.length}
                  />
                </>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="text-center py-6">
          <p className="text-sm text-gray-500">
            Each idea is submitted immediately when saved. Your contact information
            is stored locally for convenience.
          </p>
        </footer>
      </div>
    </main>
  )
}
