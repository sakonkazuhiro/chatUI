import { GoogleGenerativeAI } from '@google/generative-ai'

// Gemini AI の初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// スプレッドシートを取得
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
// メイン検索機能（2段階対応版）
export async function ragSearch(query: string): Promise<string> {
  try {
    console.log('🎯 検索開始:', query)
    
    // 詳細要求かチェック（数字と漢字両方対応）
    const detailMatch = query.match(/([1-9一二三四五六七八九十]+)番の詳細|([1-9一二三四五六七八九十]+)番について|([1-9一二三四五六七八九十]+)の詳細|([1-9一二三四五六七八九十]+)番目/)
    
    if (detailMatch) {
      // 漢字を数字に変換
      let numberStr = detailMatch[1] || detailMatch[2] || detailMatch[3] || detailMatch[4]
      
      // 漢字→数字変換
      if (numberStr === '一') numberStr = '1'
      if (numberStr === '二') numberStr = '2'
      if (numberStr === '三') numberStr = '3'     
      const number = detailMatch[1] || detailMatch[2]
      console.log(`📋 ${number}番の詳細要求`)
      const allData = await getSimpleData()
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
            const prompt = `
データ: ${allData}
質問: ${query}

回答ルール:
- 名前をリンク形式で表示
- クリックでスプレッドシートに飛ぶ

回答形式:
検索結果：
1️⃣ [S.K.さんがヒットしました](https://docs.google.com/spreadsheets/d/1bbVNwvWDaoGK0rKZdZGLjREQ7l5P4RgM/edit#gid=0)
2️⃣ [Y.S.さんがヒットしました](https://docs.google.com/spreadsheets/d/1HpuLhnb016Qzi5Uec4fFCQOzCMSQDNbi/edit#gid=0)

詳細はリンクをクリックしてご確認ください。

この形式で回答してください。

回答:
`
      const result = await model.generateContent(prompt)
      return result.response.text()
      
    } else {
      // ステップ1: メニュー表示（既存のコード）
      const allData = await getSimpleData()
      
      if (!allData) {
        return 'データの取得に失敗しました。'
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      const prompt = `
データ: ${allData}
質問: ${query}

【デバッグ情報】
チャンクテスト中...

回答ルール:
- 名前だけ表示
- 「○○さんがヒットしました」形式のみ

回答:
`
      const result = await model.generateContent(prompt)
      return result.response.text()
    }

  } catch (error) {
    console.error('❌ エラー:', error)
    return 'エラーが発生しました。'
  }
}

// チャンク情報の型定義
interface DocumentChunk {
  id: string
  content: string
  source: string
  type: 'engineer' | 'pdf'
}

// エンジニアデータをチャンクに分割
function chunkEngineerData(csvData: string, source: string): DocumentChunk[] {
  console.log(`🔪 ${source}をチャンク化中...`)
  
  const chunks: DocumentChunk[] = []
  const lines = csvData.split('\n').filter(line => line.trim())
  
  // 各行（エンジニア）をチャンクに分割
  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(',').map(col => col.replace(/"/g, '').trim())
    
    if (columns.length >= 4) {
      const engineerName = columns[0] || `エンジニア${i}`
      
      // 基本情報チャンク
      chunks.push({
        id: `${source}_${engineerName}_basic`,
        content: `名前: ${columns[0]}\n年齢: ${columns[1]}\n駅: ${columns[2]}`,
        source: source,
        type: 'engineer'
      })
    }
  }
  
  console.log(`✅ ${source}: ${chunks.length}個のチャンクに分割完了`)
  return chunks
}

// 全データをチャンク化
async function getAllChunks(): Promise<DocumentChunk[]> {
  console.log('🔪 全データのチャンク化開始')
  
  const allChunks: DocumentChunk[] = []
  
  // エンジニアデータ1をチャンク化
  const data1 = await fetchSpreadsheet("1bbVNwvWDaoGK0rKZdZGLjREQ7l5P4RgM", "シート1")
  if (data1) {
    const chunks1 = chunkEngineerData(data1, "エンジニアデータ1")
    allChunks.push(...chunks1)
  }
  
  // エンジニアデータ2をチャンク化
  const data2 = await fetchSpreadsheet("1HpuLhnb016Qzi5Uec4fFCQOzCMSQDNbi", "シート1")
  if (data2) {
    const chunks2 = chunkEngineerData(data2, "エンジニアデータ2")
    allChunks.push(...chunks2)
  }
  
  console.log(`🎯 チャンク化完了: 全${allChunks.length}個のチャンク`)
  return allChunks
}