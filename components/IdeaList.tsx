'use client'

import { Idea } from '@/lib/types'
import IdeaCard from './IdeaCard'

interface IdeaListProps {
  ideas: Idea[]
  onEditIdea: (id: string) => void
  onDeleteIdea: (id: string) => void
  compact?: boolean
}

export default function IdeaList({
  ideas,
  onEditIdea,
  onDeleteIdea,
  compact = false,
}: IdeaListProps) {
  if (ideas.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No ideas added yet. Click the button below to add your first idea.</p>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {ideas.length} idea{ideas.length !== 1 ? 's' : ''} submitted
          </span>
        </div>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 idea-list">
          {ideas.map((idea, index) => (
            <div
              key={idea.id}
              className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg group hover:bg-gray-100 transition-colors"
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center">
                {index + 1}
              </span>
              <p className="flex-1 text-sm text-gray-700 truncate">{idea.tldr}</p>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => onEditIdea(idea.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  aria-label="Edit idea"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteIdea(idea.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                  aria-label="Delete idea"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 idea-list max-h-[600px] overflow-y-auto pr-2">
      {ideas.map((idea, index) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          ideaNumber={index + 1}
          onEdit={() => onEditIdea(idea.id)}
          onDelete={() => onDeleteIdea(idea.id)}
        />
      ))}
    </div>
  )
}
