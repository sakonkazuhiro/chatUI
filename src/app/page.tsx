import ChatInterface from '@/components/ChatInterface'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          RAG チャットボット
        </h1>
        <ChatInterface />
      </div>
    </main>
  )
}