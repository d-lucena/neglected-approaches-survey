'use client'

import { useState } from 'react'
import { Button } from './ui'
import { Idea, OPTIMISTIC_OUTCOME_LABELS, SUCCESS_LIKELIHOOD_LABELS } from '@/lib/types'

interface IdeaCardProps {
  idea: Idea
  ideaNumber: number
  onEdit: () => void
  onDelete: () => void
}

export default function IdeaCard({
  idea,
  ideaNumber,
  onEdit,
  onDelete,
}: IdeaCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete()
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  return (
    <article
      className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
      aria-labelledby={`idea-${idea.id}-title`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
              {ideaNumber}
            </span>
            <h4
              id={`idea-${idea.id}-title`}
              className="text-xs font-medium text-gray-500 uppercase tracking-wide"
            >
              Idea
            </h4>
          </div>
          <p className="text-gray-900 font-medium leading-snug line-clamp-2">{idea.tldr}</p>
        </div>
        <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls={`idea-${idea.id}-details`}
          >
            {expanded ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <Button
            type="button"
            variant={confirmDelete ? 'danger' : 'ghost'}
            size="sm"
            onClick={handleDelete}
            aria-label={confirmDelete ? 'Confirm delete' : 'Delete idea'}
          >
            {confirmDelete ? (
              <span className="text-xs">Confirm?</span>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </Button>
        </div>
      </div>

      {expanded && (
        <div
          id={`idea-${idea.id}-details`}
          className="mt-4 pt-4 border-t border-gray-100 space-y-4 animate-fade-in"
        >
          <div>
            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Details</h5>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {idea.details}
            </p>
          </div>

          {idea.initialExperiment && (
            <div>
              <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Initial Experiment
              </h5>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {idea.initialExperiment}
              </p>
            </div>
          )}

          <div className="flex gap-6 pt-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-sm">
                {idea.optimisticOutcome}
              </span>
              <div>
                <p className="text-xs text-gray-500">Optimistic</p>
                <p className="text-xs text-gray-700">{OPTIMISTIC_OUTCOME_LABELS[idea.optimisticOutcome]?.split(' - ')[1] || `of 5`}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 text-purple-700 font-semibold text-sm">
                {idea.successLikelihood}
              </span>
              <div>
                <p className="text-xs text-gray-500">Likelihood</p>
                <p className="text-xs text-gray-700">{SUCCESS_LIKELIHOOD_LABELS[idea.successLikelihood]?.split(' - ')[1] || `of 10`}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
