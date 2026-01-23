// Google Sheets Configuration
const GOOGLE_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE',
  SHEET_ID: import.meta.env.VITE_GOOGLE_SHEET_ID || 'YOUR_GOOGLE_SHEET_ID_HERE',
  API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || 'YOUR_API_KEY_HERE'
}

let googleAuthToken = null

// Initialize Google Sheets API
export function initGoogleSheets() {
  if (GOOGLE_CONFIG.SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE') {
    console.log('Google Sheets not configured yet')
    return
  }

  return new Promise((resolve) => {
    gapi.load('client:auth2', () => {
      gapi.auth2.init({
        client_id: GOOGLE_CONFIG.CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/spreadsheets'
      }).then(() => {
        console.log('Google Sheets API initialized')
        resolve()
      })
    })
  })
}

// Save data to Google Sheets
export async function saveToGoogleSheets(data) {
  if (GOOGLE_CONFIG.SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE') {
    console.log('Google Sheets not configured')
    return
  }

  try {
    const auth = gapi.auth2.getAuthInstance()
    
    if (!auth.isSignedIn.get()) {
      await auth.signIn()
    }

    const row = convertDataToRow(data)
    const resource = { values: [row] }

    return gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_CONFIG.SHEET_ID,
      range: 'Sheet1!A:Z',
      valueInputOption: 'RAW',
      resource: resource
    })
  } catch (error) {
    console.error('Error saving to Google Sheets:', error)
    throw error
  }
}

// Convert survey data to spreadsheet row
function convertDataToRow(data) {
  return [
    data.timestamp || new Date().toISOString(),
    data.name || 'Anonymous',
    data.age || 'N/A',
    data.gender || 'N/A',
    data.country || 'N/A',
    data.q1 || '',
    data.q2 || '',
    Array.isArray(data.q3) ? data.q3.join('; ') : (data.q3 || ''),
    data.q4 || '',
    Array.isArray(data.q5) ? data.q5.join('; ') : (data.q5 || ''),
    Array.isArray(data.q6) ? data.q6.join('; ') : (data.q6 || ''),
    data.q7 || '',
    JSON.stringify(data.q8 || {}),
    JSON.stringify(data.q9 || {}),
    data.q10 || '',
    Array.isArray(data.q11) ? data.q11.join('; ') : (data.q11 || ''),
    JSON.stringify(data.q12 || {})
  ]
}
