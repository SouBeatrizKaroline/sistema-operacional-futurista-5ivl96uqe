import { useState, useRef, useEffect } from 'react'
import { sendNexusMessage } from '@/services/nexus'
import { Bot, Send, User } from 'lucide-react'

interface Msg {
  sender: 'user' | 'nexus'
  text: string
}

export function NexusApp() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      sender: 'nexus',
      text: 'Saudações, Operador! Sou o assistente NEXUS. Como posso ajudá-lo hoje com seus arquivos, agenda ou mensagens?',
    },
  ])
  const [inputVal, setInputVal] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputVal.trim() || loading) return

    const userMsg = inputVal.trim()
    setInputVal('')
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }])
    setLoading(true)

    try {
      const res = await sendNexusMessage(userMsg)
      setMessages((prev) => [...prev, { sender: 'nexus', text: res.content }])
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'nexus',
          text: 'Desculpe, ocorreu um erro ao consultar o núcleo de inteligência.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col font-mono text-xs">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-2">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'nexus' && (
              <div className="p-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`p-3 rounded-xl max-w-[80%] whitespace-pre-wrap leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-primary/20 border border-primary/40 text-foreground'
                  : 'glass-panel border-primary/20 text-foreground'
              }`}
            >
              {m.text}
            </div>
            {m.sender === 'user' && (
              <div className="p-1.5 rounded-full bg-secondary/20 border border-secondary/40 text-secondary">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-muted-foreground p-2">
            <Bot className="w-4 h-4 animate-spin text-primary" />
            <span>NEXUS está processando...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="mt-2 flex items-center space-x-2 border-t border-primary/20 pt-2"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Pergunte algo ao NEXUS..."
          className="flex-1 bg-background/50 border border-primary/20 px-3 py-2 rounded text-foreground focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 rounded bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary cursor-pointer transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
