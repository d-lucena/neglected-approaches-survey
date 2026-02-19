import { z } from 'zod'

export const contactInfoSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters'),
    institution: z.string().optional(),
    collaborationInterest: z.enum([
      'interested_in_collaboration',
      'ideas_only',
      'other',
    ]),
    collaborationOther: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.collaborationInterest === 'other') {
        return data.collaborationOther && data.collaborationOther.length >= 1
      }
      return true
    },
    {
      message: 'Please specify your collaboration preference',
      path: ['collaborationOther'],
    }
  )

export const ideaSchema = z.object({
  id: z.string(),
  tldr: z
    .string()
    .min(1, 'TLDR is required')
    .min(10, 'TLDR must be at least 10 characters'),
  details: z
    .string()
    .min(1, 'Details are required')
    .min(25, 'Details must be at least 25 characters'),
  initialExperiment: z.string().optional(),
  optimisticOutcome: z
    .number()
    .min(1, 'Please select an outcome')
    .max(5, 'Please select a valid outcome'),
  successLikelihood: z
    .number()
    .min(1, 'Please select a likelihood')
    .max(10, 'Please select a valid likelihood'),
})

export const surveyDataSchema = z.object({
  contactInfo: contactInfoSchema,
  ideas: z.array(ideaSchema).min(1, 'Please add at least one idea'),
})

export type ContactInfoFormData = z.infer<typeof contactInfoSchema>
export type IdeaFormData = z.infer<typeof ideaSchema>
export type SurveyFormData = z.infer<typeof surveyDataSchema>
