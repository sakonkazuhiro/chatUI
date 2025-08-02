'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, User, Bot, Trash2, History } from 'lucide-react'

interface Message {
  id: number
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // スクロール用のref
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 📚 履歴を読み込む
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory')
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
      setMessages(parsedMessages)
    } else {
      // 初回のウェルカムメッセージ
      const welcomeMessage = {
        id: 1,
        content: 'こんにちは！何かご質問がありましたらお気軽にお聞きください。',
        sender: 'bot' as const,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [])

  // 📝 履歴を保存する
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages))
    }
  }, [messages])

  // メッセージが更新されたら自動スクロール
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 🧹 履歴をクリア
  const clearHistory = () => {
    const confirmClear = window.confirm('チャット履歴をすべて削除しますか？')
    if (confirmClear) {
      localStorage.removeItem('chatHistory')
      setMessages([{
        id: Date.now(),
        content: 'チャット履歴がクリアされました。新しい会話を始めましょう！',
        sender: 'bot',
        timestamp: new Date()
      }])
    }
  }

  // 下部にスクロール
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages((prev: Message[]) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input })
      })

      const data = await response.json()

      const botMessage: Message = {
        id: Date.now() + 1,
        content: data.response,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages((prev: Message[]) => [...prev, botMessage])
    } catch (error) {
      console.error('エラーが発生しました:', error)
      const errorMessage: Message = {
        id: Date.now() + 1,
        content: '申し訳ございません。エラーが発生しました。',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages((prev: Message[]) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-2xl min-h-[80vh] flex flex-col text-white border border-gray-700">
      {/* 📋 ヘッダー（履歴管理ボタン） */}
      <div className="flex justify-between items-center p-4 border-b border-gray-600 bg-gray-800 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-blue-400" />
          <span className="text-sm text-gray-300">
            履歴: {messages.length}件のメッセージ
          </span>
        </div>
        <button
          onClick={clearHistory}
          className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>履歴クリア</span>
        </button>
      </div>

      {/* メッセージ表示エリア */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-900">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-2 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="flex flex-col">
              <div
                className={`max-w-2xl lg:max-w-4xl px-4 py-2 rounded-lg shadow-md ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white shadow-blue-500/20'
                    : 'bg-red-700 text-white border border-red-500'
                }`}
              >
                <div className="text-base whitespace-pre-line" dangerouslySetInnerHTML={{__html: message.content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-300 underline">$1</a>')}} />
              </div>
              <div className="text-xs text-gray-500 mt-1 px-2">
                {message.timestamp.toLocaleTimeString('ja-JP', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
            {message.sender === 'user' && (
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-700 rounded-lg px-4 py-2 border border-gray-600 shadow-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        {/* スクロール用の見えない要素 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力フォーム（上部） */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-600 bg-gray-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="メッセージを入力してください..."
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 shadow-inner"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}