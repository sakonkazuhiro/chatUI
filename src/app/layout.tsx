import './globals.css'

export const metadata = {
  title: 'RAG チャットボット',
  description: 'シンプルなRAG実装のチャットボット',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
} 