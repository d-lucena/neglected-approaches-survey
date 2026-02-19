'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const count = searchParams.get('count') || '0'
  const batchId = searchParams.get('batchId')

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Thank You!
          </h1>

          <p className="text-lg text-gray-600">
            You have successfully submitted{' '}
            <span className="font-semibold text-blue-600">{count}</span>{' '}
            idea{parseInt(count) !== 1 ? 's' : ''}.
          </p>

          <p className="text-gray-500">
            Your contributions will help identify neglected research directions
            in AI alignment.
          </p>

          {batchId && (
            <p className="text-xs text-gray-400">
              Reference: {batchId}
            </p>
          )}

          <div className="pt-4 space-y-3">
            <Link href="/">
              <Button variant="primary" size="lg" className="w-full">
                Submit More Ideas
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Have questions? Contact the research team.
        </p>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  )
}
