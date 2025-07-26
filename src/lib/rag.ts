import { GoogleGenerativeAI } from '@google/generative-ai'
import { google } from 'googleapis'

// Gemini AI の初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Google Drive API の初期化
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_DRIVE_CLIENT_ID,
  process.env.GOOGLE_DRIVE_CLIENT_SECRET
)

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
})

const drive = google.drive({ version: 'v3', auth: oauth2Client })

// Google Drive からドキュメントを取得する関数
async function fetchGoogleDriveDocuments(): Promise<string[]> {
  try {
    // Google Drive のファイル一覧を取得
    const response = await drive.files.list({
      q: "mimeType='application/pdf' or mimeType='text/plain' or mimeType='application/vnd.google-apps.document'",
      fields: 'files(id, name, mimeType)'
    })

    const documents: string[] = []

    if (response.data.files) {
      for (const file of response.data.files) {
        try {
          let content = ''
          
          if (file.mimeType === 'text/plain') {
            // テキストファイルの場合
            const fileResponse = await drive.files.get({
              fileId: file.id!,
              alt: 'media'
            })
            content = fileResponse.data as string
          } else if (file.mimeType === 'application/vnd.google-apps.document') {
            // Google Docs の場合
            const fileResponse = await drive.files.export({
              fileId: file.id!,
              mimeType: 'text/plain'
            })
            content = fileResponse.data as string
          }
          
          if (content) {
            documents.push(`文書名: ${file.name}\n内容: ${content}`)
          }
        } catch (error) {
          console.error(`ファイル ${file.name} の取得に失敗:`, error)
        }
      }
    }

    return documents
  } catch (error) {
    console.error('Google Drive からの文書取得に失敗:', error)
    return []
  }
}

// 関連文書を検索する関数（簡易版）
function findRelevantDocuments(query: string, documents: string[]): string[] {
  const queryLower = query.toLowerCase()
  
  return documents
    .filter(doc => doc.toLowerCase().includes(queryLower))
    .slice(0, 3) // 上位3つの関連文書を返す
}

// Gemini AI を使用して回答を生成する関数
async function generateResponseWithGemini(query: string, context: string[]): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
以下の文書を参考にして、ユーザーの質問に日本語で回答してください。
文書に関連する情報がない場合は、それを明記してください。

参考文書:
${context.join('\n\n---\n\n')}

質問: ${query}

回答:
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini AI での回答生成に失敗:', error)
    return '申し訳ございません。回答の生成中にエラーが発生しました。'
  }
}

// メインのRAG関数（改修版）
export async function ragSearch(query: string): Promise<string> {
  try {
    // 1. Google Drive から文書を取得
    const documents = await fetchGoogleDriveDocuments()
    
    if (documents.length === 0) {
      return 'Google Drive から文書を取得できませんでした。ドライブにファイルがあることをご確認ください。'
    }

    // 2. 関連文書を検索
    const relevantDocs = findRelevantDocuments(query, documents)
    
    if (relevantDocs.length === 0) {
      return `「${query}」に関連する文書が見つかりませんでした。別の検索語をお試しください。`
    }

    // 3. Gemini AI を使用して回答を生成
    const response = await generateResponseWithGemini(query, relevantDocs)
    
    return response
  } catch (error) {
    console.error('RAG検索エラー:', error)
    return '申し訳ございません。処理中にエラーが発生しました。'
  }
} 