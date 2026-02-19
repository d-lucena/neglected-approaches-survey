export type CollaborationInterest =
  | 'interested_in_collaboration'
  | 'ideas_only'
  | 'other'

export interface Idea {
  id: string
  tldr: string
  details: string
  initialExperiment?: string
  optimisticOutcome: number // 1-5
  successLikelihood: number // 1-10
}

export interface ContactInfo {
  email: string
  name: string
  institution?: string
  collaborationInterest: CollaborationInterest
  collaborationOther?: string // Only when collaborationInterest is 'other'
}

export interface SurveyData {
  contactInfo: ContactInfo
  ideas: Idea[]
}

export interface SubmissionResult {
  success: boolean
  message: string
  submittedCount?: number
  batchId?: string
}

export const COLLABORATION_LABELS: Record<CollaborationInterest, string> = {
  interested_in_collaboration: 'I am interested in potential collaboration on these ideas, including collaboration with the AE - DARPA partnership on alignment research',
  ideas_only: "I'm glad to provide ideas, but wouldn't be available to collaborate on them.",
  other: 'Other:',
}

export const OPTIMISTIC_OUTCOME_LABELS: Record<number, string> = {
  1: '1 - Not at all',
  2: '2',
  3: '3',
  4: '4',
  5: '5 - Alignment is solved',
}

export const SUCCESS_LIKELIHOOD_LABELS: Record<number, string> = {
  1: '10%',
  2: '20%',
  3: '30%',
  4: '40%',
  5: '50%',
  6: '60%',
  7: '70%',
  8: '80%',
  9: '90%',
  10: '100%',
}
