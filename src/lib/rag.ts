// 拡張された知識ベース
const knowledgeBase = [
  // 技術関連
  {
    id: 1,
    content: "RAG（Retrieval-Augmented Generation）は、検索拡張生成と呼ばれる技術で、大量の文書から関連情報を検索し、その情報を基に回答を生成する手法です。LLMの知識不足を補完し、より正確で最新の情報を提供できます。",
    keywords: ["RAG", "検索拡張生成", "retrieval", "augmented", "generation", "LLM", "検索", "生成"],
    category: "技術"
  },
  {
    id: 2,
    content: "Next.jsは、Reactベースのフルスタックフレームワークで、サーバーサイドレンダリング（SSR）、静的サイト生成（SSG）、API Routes、画像最適化などの機能を提供します。Vercelによって開発されています。",
    keywords: ["Next.js", "React", "フレームワーク", "SSR", "SSG", "API Routes", "Vercel", "サーバーサイドレンダリング"],
    category: "技術"
  },
  {
    id: 3,
    content: "TypeScriptは、Microsoftが開発したJavaScriptに静的型付けを追加したプログラミング言語です。大規模なアプリケーション開発において、型安全性とコードの保守性を向上させます。",
    keywords: ["TypeScript", "JavaScript", "型付け", "プログラミング言語", "Microsoft", "型安全性"],
    category: "技術"
  },
  {
    id: 4,
    content: "機械学習（Machine Learning）は、コンピューターがデータからパターンを学習し、予測や分類を行う技術分野です。教師あり学習、教師なし学習、強化学習などの手法があります。",
    keywords: ["機械学習", "ML", "データ", "パターン", "予測", "分類", "教師あり学習", "教師なし学習", "強化学習"],
    category: "技術"
  },
  {
    id: 5,
    content: "人工知能（AI）は、人間の知能を模倣したコンピューターシステムや技術の総称です。機械学習、深層学習、自然言語処理などの分野を含みます。",
    keywords: ["AI", "人工知能", "artificial intelligence", "コンピューター", "深層学習", "自然言語処理"],
    category: "技術"
  },
  // プログラミング関連
  {
    id: 6,
    content: "Reactは、Facebookが開発したJavaScriptライブラリで、ユーザーインターフェース（UI）の構築に使用されます。コンポーネントベースの開発とVirtual DOMが特徴です。",
    keywords: ["React", "JavaScript", "ライブラリ", "UI", "コンポーネント", "Virtual DOM", "Facebook"],
    category: "技術"
  },
  {
    id: 7,
    content: "Node.jsは、V8 JavaScriptエンジンを使用してサーバーサイドでJavaScriptを実行できるランタイム環境です。非同期処理とイベント駆動型の設計が特徴です。",
    keywords: ["Node.js", "JavaScript", "サーバーサイド", "V8", "非同期処理", "イベント駆動"],
    category: "技術"
  },
  {
    id: 8,
    content: "APIは、Application Programming Interfaceの略で、異なるソフトウェア間でデータや機能を共有するためのインターフェースです。RESTful API、GraphQL APIなどがあります。",
    keywords: ["API", "Application Programming Interface", "REST", "GraphQL", "インターフェース"],
    category: "技術"
  },
  // Web開発関連
  {
    id: 9,
    content: "HTML（HyperText Markup Language）は、ウェブページの構造を定義するマークアップ言語です。タグを使用してコンテンツの意味や構造を記述します。",
    keywords: ["HTML", "HyperText Markup Language", "マークアップ", "ウェブページ", "タグ"],
    category: "技術"
  },
  {
    id: 10,
    content: "CSS（Cascading Style Sheets）は、HTMLで構造化されたウェブページのスタイル（見た目）を定義するスタイルシート言語です。",
    keywords: ["CSS", "Cascading Style Sheets", "スタイル", "デザイン", "ウェブページ"],
    category: "技術"
  },
  // データベース関連
  {
    id: 11,
    content: "SQLは、Structured Query Languageの略で、リレーショナルデータベースの操作に使用される言語です。データの検索、挿入、更新、削除などを行います。",
    keywords: ["SQL", "Structured Query Language", "データベース", "リレーショナル", "検索", "挿入", "更新", "削除"],
    category: "技術"
  },
  {
    id: 12,
    content: "MongoDBは、NoSQLデータベースの一種で、ドキュメント指向のデータベースです。JSONライクなBSONフォーマットでデータを格納します。",
    keywords: ["MongoDB", "NoSQL", "データベース", "ドキュメント指向", "BSON", "JSON"],
    category: "技術"
  },
  // 一般的な質問対応
  {
    id: 13,
    content: "プログラミングは、コンピューターに実行させたい処理を、プログラミング言語を使って記述する作業です。論理的思考力と問題解決能力が重要です。",
    keywords: ["プログラミング", "プログラミング言語", "コンピューター", "論理的思考", "問題解決"],
    category: "一般"
  },
  {
    id: 14,
    content: "Web開発は、ウェブサイトやWebアプリケーションを作成することです。フロントエンド開発（ユーザーが見る部分）とバックエンド開発（サーバー側の処理）に分かれます。",
    keywords: ["Web開発", "ウェブサイト", "Webアプリケーション", "フロントエンド", "バックエンド"],
    category: "一般"
  },
  {
    id: 15,
    content: "フレームワークは、アプリケーション開発を効率化するための基盤となるソフトウェアです。共通的な機能を提供し、開発者が本質的な機能開発に集中できます。",
    keywords: ["フレームワーク", "アプリケーション開発", "効率化", "基盤", "ソフトウェア"],
    category: "一般"
  }
]

// 改善された検索機能
function searchKnowledge(query: string): Array<{content: string, score: number}> {
  const queryLower = query.toLowerCase()
  const results: Array<{content: string, score: number}> = []
  
  knowledgeBase.forEach(item => {
    let score = 0
    
    // 1. 完全一致のキーワードマッチング（高スコア）
    item.keywords.forEach(keyword => {
      if (queryLower.includes(keyword.toLowerCase())) {
        score += 10
      }
      if (keyword.toLowerCase().includes(queryLower)) {
        score += 5
      }
    })
    
    // 2. コンテンツ内の部分一致
    if (item.content.toLowerCase().includes(queryLower)) {
      score += 3
    }
    
    // 3. 日本語の一般的な質問パターンの処理
    const questionPatterns = [
      { pattern: /何.*ですか|なんですか/, boost: 2 },
      { pattern: /どのような|どんな/, boost: 2 },
      { pattern: /どうやって|方法/, boost: 2 },
      { pattern: /特徴|メリット/, boost: 1 },
      { pattern: /使い方|使用方法/, boost: 1 }
    ]
    
    questionPatterns.forEach(({pattern, boost}) => {
      if (pattern.test(queryLower)) {
        score += boost
      }
    })
    
    // 4. 関連語の処理
    const relatedTerms = [
      { terms: ['開発', 'プログラミング', 'コーディング'], boost: 1 },
      { terms: ['AI', '人工知能', 'machine learning'], boost: 1 },
      { terms: ['web', 'ウェブ', 'サイト'], boost: 1 }
    ]
    
    relatedTerms.forEach(({terms, boost}) => {
      if (terms.some(term => queryLower.includes(term.toLowerCase()))) {
        terms.forEach(term => {
          if (item.content.toLowerCase().includes(term.toLowerCase()) || 
              item.keywords.some(keyword => keyword.toLowerCase().includes(term.toLowerCase()))) {
            score += boost
          }
        })
      }
    })
    
    // スコアが0より大きい場合のみ結果に追加
    if (score > 0) {
      results.push({
        content: item.content,
        score: score
      })
    }
  })
  
  // スコアでソートして上位の結果を返す
  return results.sort((a, b) => b.score - a.score)
}

// 改善された回答生成関数
function generateResponse(query: string, relevantDocs: Array<{content: string, score: number}>): string {
  if (relevantDocs.length === 0) {
    return `申し訳ございませんが、「${query}」に関する情報が見つかりませんでした。

以下のような質問を試してみてください：
• RAGとは何ですか？
• Next.jsの特徴は？
• プログラミングについて教えて
• Web開発とは？
• 機械学習とは？`
  }
  
  const topResult = relevantDocs[0]
  
  // 質問の種類に応じた回答生成
  if (query.includes("何") || query.includes("なん") || query.includes("どのような") || query.includes("どんな")) {
    let response = `${topResult.content}`
    
    // 関連情報があれば追加
    if (relevantDocs.length > 1) {
      response += `\n\n**関連情報:**\n${relevantDocs[1].content}`
    }
    
    return response + `\n\n他にもご質問がございましたら、お聞かせください。`
  }
  
  if (query.includes("どうやって") || query.includes("方法") || query.includes("使い方")) {
    return `${topResult.content}

**具体的な実装方法や詳細について**さらに知りたい場合は、具体的な質問をお聞かせください。`
  }
  
  if (query.includes("特徴") || query.includes("メリット") || query.includes("利点")) {
    return `${topResult.content}

**さらに詳しく知りたい場合は**、具体的な側面について質問してください。`
  }
  
  // デフォルトの回答
  return `${topResult.content}

他にもご質問がございましたら、お聞かせください。`
}

// メインのRAG関数
export async function ragSearch(query: string): Promise<string> {
  try {
    // 1. 関連文書の検索
    const relevantDocs = searchKnowledge(query)
    
    // 2. 回答の生成
    const response = generateResponse(query, relevantDocs)
    
    return response
  } catch (error) {
    console.error('RAG検索エラー:', error)
    return "申し訳ございません。処理中にエラーが発生しました。"
  }
} 