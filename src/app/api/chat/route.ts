import { NextRequest, NextResponse } from 'next/server'
import { ragSearch } from '@/lib/rag'

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    
    if (!message) {
      return NextResponse.json({ error: 'メッセージが必要です' }, { status: 400 })
    }

    const response = await ragSearch(message)
    
    return NextResponse.json({ response })
  } catch (error) {
    console.error('チャット API エラー:', error)
    return NextResponse.json({ error: '内部サーバーエラー' }, { status: 500 })
  }
}