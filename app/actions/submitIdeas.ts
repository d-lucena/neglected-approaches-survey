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

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${operation} timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ])
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

  // Debug: Log key format info (not the actual key)
  console.log('Private key starts with:', privateKey.substring(0, 30))
  console.log('Private key ends with:', privateKey.substring(privateKey.length - 30))
  console.log('Private key length:', privateKey.length)
  console.log('Contains actual newlines:', privateKey.includes('\n'))
  console.log('Client email:', clientEmail)
  console.log('Sheet ID:', sheetId)

  const jwt = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const doc = new GoogleSpreadsheet(sheetId, jwt)

  // Add timeout to prevent hanging
  console.log('Loading sheet info...')
  await withTimeout(doc.loadInfo(), 10000, 'Loading sheet info')
  console.log('Sheet info loaded successfully')

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
    console.log('Step 1: Getting Google Sheet...')
    const doc = await getGoogleSheet()
    console.log('Step 2: Got doc, title:', doc.title)

    const sheet = doc.sheetsByIndex[0]
    console.log('Step 3: Got sheet:', sheet?.title)

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
    console.log('Step 4: Loading header row...')
    try {
      await sheet.loadHeaderRow()
      console.log('Step 5: Headers loaded:', sheet.headerValues)
    } catch {
      console.log('Step 5: No headers found, setting them...')
      await sheet.setHeaderRow(headers)
      console.log('Step 6: Headers set')
    }

    // Add row for the idea
    console.log('Step 7: Adding row...')
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
    console.log('Step 8: Row added successfully')

    return {
      success: true,
      message: 'Idea submitted successfully',
      submittedCount: 1,
    }
  } catch (error: unknown) {
    console.error('Submission error:', error)

    // Try to extract as much info as possible from the error
    let errorMessage = 'Unknown error'
    let errorCode = ''
    let errorStatus = ''
    let errorDetails = ''

    if (error && typeof error === 'object') {
      // Check for various error properties
      const err = error as Record<string, unknown>

      if ('message' in err) errorMessage = String(err.message)
      if ('code' in err) errorCode = String(err.code)
      if ('status' in err) errorStatus = String(err.status)

      // Check for nested response error (common in Google API errors)
      if ('response' in err && err.response && typeof err.response === 'object') {
        const response = err.response as Record<string, unknown>
        console.error('Response object:', JSON.stringify(response, null, 2))
        if ('status' in response) errorCode = String(response.status)
        if ('statusText' in response) errorStatus = String(response.statusText)
        if ('data' in response && response.data && typeof response.data === 'object') {
          const data = response.data as Record<string, unknown>
          console.error('Response data:', JSON.stringify(data, null, 2))
          if ('error' in data && data.error && typeof data.error === 'object') {
            const apiError = data.error as Record<string, unknown>
            if ('message' in apiError) errorMessage = String(apiError.message)
            if ('code' in apiError) errorCode = String(apiError.code)
            if ('status' in apiError) errorStatus = String(apiError.status)
            if ('details' in apiError) errorDetails = JSON.stringify(apiError.details)
          } else if ('error_description' in data) {
            errorMessage = String(data.error_description)
          }
        }
      }

      // Check for cause (Node.js error chaining)
      if ('cause' in err && err.cause) {
        console.error('Error cause:', err.cause)
      }

      // Log all enumerable properties
      console.error('Error properties:', Object.keys(err))
      try {
        console.error('Error JSON:', JSON.stringify(err, null, 2))
      } catch {
        console.error('Could not stringify error')
      }
    }

    console.error('Extracted - message:', errorMessage, 'code:', errorCode, 'status:', errorStatus, 'details:', errorDetails)

    // Handle specific error types
    if (errorMessage.includes('Missing Google Sheets configuration')) {
      return {
        success: false,
        message: 'Server configuration error. Please contact the administrator.',
      }
    }
    if (errorMessage.includes('PERMISSION_DENIED') || errorCode === '403' || errorStatus === 'PERMISSION_DENIED') {
      return {
        success: false,
        message: 'Permission denied. The service account may not have access to the spreadsheet.',
      }
    }
    if (errorMessage.includes('NOT_FOUND') || errorCode === '404' || errorStatus === 'NOT_FOUND') {
      return {
        success: false,
        message: 'Spreadsheet not found. Please check the configuration.',
      }
    }
    if (errorMessage.includes('invalid_grant') || errorMessage.includes('Invalid JWT')) {
      return {
        success: false,
        message: 'Authentication error. Please check the service account credentials.',
      }
    }
    if (errorMessage.includes('timed out')) {
      return {
        success: false,
        message: 'Connection to Google Sheets timed out. This usually indicates an authentication issue.',
      }
    }
    if (errorMessage.includes('API has not been used') || errorMessage.includes('it is disabled')) {
      return {
        success: false,
        message: 'Google Sheets API is not enabled. Please enable it in Google Cloud Console.',
      }
    }

    // Return detailed error for debugging
    return {
      success: false,
      message: `Error: ${errorMessage}${errorCode ? ` (code: ${errorCode})` : ''}${errorStatus ? ` [${errorStatus}]` : ''}`,
    }
  }
}
