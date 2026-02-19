'use server'

import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'
import { contactInfoSchema, ideaSchema } from '@/lib/schemas'
import { ContactInfo, Idea, SubmissionResult, COLLABORATION_LABELS } from '@/lib/types'

function isGoogleSheetsConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SHEETS_PRIVATE_KEY &&
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL &&
    process.env.GOOGLE_SHEET_ID
  )
}

async function getGoogleSheet(): Promise<GoogleSpreadsheet> {
  // Handle both escaped newlines (\n as string) and actual newlines
  let privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY
  if (privateKey) {
    // Replace escaped newlines with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n')
    // Remove surrounding quotes if present
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1).replace(/\\n/g, '\n')
    }
  }
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
  const sheetId = process.env.GOOGLE_SHEET_ID

  if (!privateKey || !clientEmail || !sheetId) {
    throw new Error('Missing Google Sheets configuration')
  }

  const jwt = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const doc = new GoogleSpreadsheet(sheetId, jwt)
  await doc.loadInfo()

  return doc
}

function formatCollaborationInterest(contactInfo: ContactInfo): string {
  if (contactInfo.collaborationInterest === 'other') {
    return `Other: ${contactInfo.collaborationOther || ''}`
  }
  return COLLABORATION_LABELS[contactInfo.collaborationInterest]
}

export async function submitIdea(
  contactInfo: ContactInfo,
  idea: Idea
): Promise<SubmissionResult> {
  try {
    // Validate input data
    const contactValidation = contactInfoSchema.safeParse(contactInfo)
    if (!contactValidation.success) {
      return {
        success: false,
        message: `Contact info error: ${contactValidation.error.errors.map((e) => e.message).join(', ')}`,
      }
    }

    const ideaValidation = ideaSchema.safeParse(idea)
    if (!ideaValidation.success) {
      return {
        success: false,
        message: `Idea error: ${ideaValidation.error.errors.map((e) => e.message).join(', ')}`,
      }
    }

    const timestamp = new Date().toISOString()

    // Mock mode: log to console when Google Sheets isn't configured
    if (!isGoogleSheetsConfigured()) {
      console.log('\n========== MOCK SUBMISSION (Google Sheets not configured) ==========')
      console.log(`Timestamp: ${timestamp}`)
      console.log(`Contact: ${contactInfo.name} <${contactInfo.email}>${contactInfo.institution ? ` (${contactInfo.institution})` : ''}`)
      console.log(`Collaboration: ${formatCollaborationInterest(contactInfo)}`)
      console.log(`\n--- Idea ---`)
      console.log(`TLDR: ${idea.tldr}`)
      console.log(`Details: ${idea.details}`)
      if (idea.initialExperiment) console.log(`Experiment: ${idea.initialExperiment}`)
      console.log(`Optimistic Outcome: ${idea.optimisticOutcome}/5`)
      console.log(`Success Likelihood: ${idea.successLikelihood}/10`)
      console.log('\n====================================================================\n')

      return {
        success: true,
        message: '[MOCK] Idea submitted successfully (logged to console)',
        submittedCount: 1,
      }
    }

    // Production mode: write to Google Sheets
    const doc = await getGoogleSheet()
    const sheet = doc.sheetsByIndex[0]

    if (!sheet) {
      return {
        success: false,
        message: 'Could not access the spreadsheet',
      }
    }

    // Ensure headers exist
    const headers = [
      'Timestamp',
      'Email',
      'Name',
      'Institution',
      'Collaboration Interest',
      'TLDR',
      'Details',
      'Initial Experiment',
      'Optimistic Outcome',
      'Success Likelihood',
    ]

    // Check if headers exist, if not add them
    await sheet.loadHeaderRow().catch(async () => {
      await sheet.setHeaderRow(headers)
    })

    // Add row for the idea
    await sheet.addRow({
      Timestamp: timestamp,
      Email: contactInfo.email,
      Name: contactInfo.name,
      Institution: contactInfo.institution || '',
      'Collaboration Interest': formatCollaborationInterest(contactInfo),
      TLDR: idea.tldr,
      Details: idea.details,
      'Initial Experiment': idea.initialExperiment || '',
      'Optimistic Outcome': idea.optimisticOutcome.toString(),
      'Success Likelihood': idea.successLikelihood.toString(),
    })

    return {
      success: true,
      message: 'Idea submitted successfully',
      submittedCount: 1,
    }
  } catch (error) {
    console.error('Submission error:', error)

    // Handle specific error types
    if (error instanceof Error) {
      console.error('Error message:', error.message)

      if (error.message.includes('Missing Google Sheets configuration')) {
        return {
          success: false,
          message: 'Server configuration error. Please contact the administrator.',
        }
      }
      if (error.message.includes('PERMISSION_DENIED') || error.message.includes('403')) {
        return {
          success: false,
          message: 'Permission denied. The service account may not have access to the spreadsheet.',
        }
      }
      if (error.message.includes('NOT_FOUND') || error.message.includes('404')) {
        return {
          success: false,
          message: 'Spreadsheet not found. Please check the configuration.',
        }
      }
      if (error.message.includes('invalid_grant') || error.message.includes('Invalid JWT')) {
        return {
          success: false,
          message: 'Authentication error. Please check the service account credentials.',
        }
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}
