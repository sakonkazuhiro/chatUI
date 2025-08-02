import { GoogleGenerativeAI } from '@google/generative-ai'

// Gemini AI の初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// スプレッドシートを取得（シンプル版）
async function fetchSpreadsheet(fileId: string, sheetName: string = "シート1"): Promise<string> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${fileId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`
    console.log(`📊 スプレッドシート取得中: ${fileId}`)
    
    const response = await fetch(url)
    
    if (response.ok) {
      const text = await response.text()
      console.log(`✅ スプレッドシート取得成功: ${text.length}文字`)
      return text
    } else {
      console.log(`❌ スプレッドシート取得失敗: ${response.status}`)
      return ''
    }
  } catch (error) {
    console.error(`❌ スプレッドシートエラー:`, error)
    return ''
  }
}

// シンプルなデータ取得
async function getSimpleData(): Promise<string> {
  console.log('📊 データ取得中...')
  
  // スプレッドシート1
  const data1 = await fetchSpreadsheet("1bbVNwvWDaoGK0rKZdZGLjREQ7l5P4RgM", "シート1")
  // スプレッドシート2  
  const data2 = await fetchSpreadsheet("1HpuLhnb016Qzi5Uec4fFCQOzCMSQDNbi", "シート1")
  
  return `
エンジニアデータ1:
${data1}

エンジニアデータ2:
${data2}
`
}

// 🔥 真のRAG検索（属人化ゼロ版）
export async function ragSearch(query: string): Promise<string> {
  try {
    console.log('🎯 検索開始:', query)
    
    // シンプル：Googleドライブからそのまま取得
    const allData = await getSimpleData()
    
    if (!allData) {
      return 'データの取得に失敗しました。'
    }

    // Geminiが全て自動判断
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `
エンジニアデータ:
${allData}

質問: ${query}

あなたは親しみやすいAIアシスタントです。質問の内容に応じて自然に回答してください。

- エンジニア検索の質問（「〜使える人」「〜できるエンジニア」など）
  → 最も適したエンジニア1名を推薦し、選んだ理由も説明

- 技術説明の質問（「〜について教えて」「〜とは何ですか」など）
  → その技術について分かりやすく説明

重要な指示:
・機械的な判断過程は一切説明しない
・「質問は〜なので」「〜に対しては」などの処理説明は禁止
・自然で親しみやすい口調で回答
・直接的に質問に答える

回答例:
質問「Python使えるエンジニア教えて」
→ 「最もPythonスキルが豊富なS.K.さんをお勧めします。理由は...」

質問「RAGについて教えて」
→ 「RAGは検索拡張生成という技術で、既存の知識に加えて...」

自然で分かりやすい回答をお願いします。
`
    
    const result = await model.generateContent(prompt)
    return result.response.text()
    
  } catch (error) {
    console.error('❌ エラー:', error)
    return 'エラーが発生しました。'
  }
}

