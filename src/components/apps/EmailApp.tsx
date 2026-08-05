import { useState, useEffect } from 'react'
import { getEmails, EmailItem, updateEmail, deleteEmail } from '@/services/emails'
import { Mail, Star, Trash2, Inbox, Send, Archive } from 'lucide-react'

export function EmailApp() {
  const [emails, setEmails] = useState<EmailItem[]>([])
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null)
  const [folder, setFolder] = useState<EmailItem['folder']>('inbox')

  const loadEmails = async () => {
    const list = await getEmails()
    setEmails(list)
  }

  useEffect(() => {
    loadEmails()
  }, [])

  const filtered = emails.filter((e) => e.folder === folder)

  const handleSelect = async (item: EmailItem) => {
    setSelectedEmail(item)
    if (!item.is_read) {
      await updateEmail(item.id, { is_read: true })
      loadEmails()
    }
  }

  const handleToggleFlag = async (item: EmailItem, e: React.MouseEvent) => {
    e.stopPropagation()
    await updateEmail(item.id, { is_flagged: !item.is_flagged })
    loadEmails()
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await deleteEmail(id)
    if (selectedEmail?.id === id) setSelectedEmail(null)
    loadEmails()
  }

  return (
    <div className="h-full flex flex-col sm:flex-row gap-4 font-mono text-xs">
      {/* Folder Navigation */}
      <div className="w-full sm:w-48 glass-panel p-3 rounded-lg border border-primary/20 space-y-1">
        <button
          onClick={() => setFolder('inbox')}
          className={`w-full flex items-center space-x-2 p-2 rounded text-left cursor-pointer transition-colors ${
            folder === 'inbox'
              ? 'bg-primary/20 text-primary font-bold'
              : 'text-muted-foreground hover:bg-primary/10'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Caixa de Entrada</span>
        </button>
        <button
          onClick={() => setFolder('enviados')}
          className={`w-full flex items-center space-x-2 p-2 rounded text-left cursor-pointer transition-colors ${
            folder === 'enviados'
              ? 'bg-primary/20 text-primary font-bold'
              : 'text-muted-foreground hover:bg-primary/10'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Enviados</span>
        </button>
        <button
          onClick={() => setFolder('lixeira')}
          className={`w-full flex items-center space-x-2 p-2 rounded text-left cursor-pointer transition-colors ${
            folder === 'lixeira'
              ? 'bg-primary/20 text-primary font-bold'
              : 'text-muted-foreground hover:bg-primary/10'
          }`}
        >
          <Archive className="w-4 h-4" />
          <span>Lixeira</span>
        </button>
      </div>

      {/* Email List */}
      <div className="w-full sm:w-72 glass-panel p-3 rounded-lg border border-primary/20 overflow-y-auto space-y-1">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelect(item)}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col space-y-1 ${
              selectedEmail?.id === item.id
                ? 'bg-primary/20 border-primary text-primary font-bold'
                : item.is_read
                  ? 'bg-background/20 border-primary/10 text-muted-foreground'
                  : 'bg-primary/10 border-primary/30 text-foreground font-semibold'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="line-clamp-1">{item.from_name || 'Desconhecido'}</span>
              <button onClick={(e) => handleToggleFlag(item, e)} className="text-amber-400">
                <Star className={`w-3.5 h-3.5 ${item.is_flagged ? 'fill-amber-400' : ''}`} />
              </button>
            </div>
            <p className="line-clamp-1 text-foreground">{item.subject}</p>
          </div>
        ))}
      </div>

      {/* Reading Pane */}
      <div className="flex-1 glass-panel p-4 rounded-lg border border-primary/20 flex flex-col">
        {selectedEmail ? (
          <div className="space-y-3 h-full flex flex-col">
            <div className="flex justify-between items-start pb-2 border-b border-primary/20">
              <div>
                <h3 className="font-bold text-sm text-primary">{selectedEmail.subject}</h3>
                <p className="text-muted-foreground">
                  De: {selectedEmail.from_name} ({selectedEmail.from_email})
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(selectedEmail.id, e)}
                className="text-muted-foreground hover:text-rose-400 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto text-foreground leading-relaxed whitespace-pre-wrap">
              {selectedEmail.body}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Selecione uma mensagem para ler
          </div>
        )}
      </div>
    </div>
  )
}
