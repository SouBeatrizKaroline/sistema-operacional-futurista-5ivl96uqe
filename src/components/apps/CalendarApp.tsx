import { useState, useEffect } from 'react'
import {
  getCalendarEvents,
  CalendarEvent,
  createCalendarEvent,
  deleteCalendarEvent,
} from '@/services/calendar'
import { Plus, Trash2 } from 'lucide-react'

export function CalendarApp() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<CalendarEvent['category']>('trabalho')
  const [startDate, setStartDate] = useState('')

  const loadEvents = async () => {
    const list = await getCalendarEvents()
    setEvents(list)
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !startDate) return
    await createCalendarEvent({
      title,
      category,
      start: new Date(startDate).toISOString(),
      color: category === 'trabalho' ? '#00E5FF' : '#A855F7',
    })
    setTitle('')
    setStartDate('')
    loadEvents()
  }

  const handleDelete = async (id: string) => {
    await deleteCalendarEvent(id)
    loadEvents()
  }

  return (
    <div className="h-full flex flex-col sm:flex-row gap-4 font-mono text-xs">
      {/* Event Creator Form */}
      <div className="w-full sm:w-64 glass-panel p-4 rounded-lg border border-primary/20 space-y-3">
        <h3 className="font-bold text-primary border-b border-primary/20 pb-2">NOVO EVENTO</h3>
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="text-muted-foreground block mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Reunião de Equipe"
              className="w-full bg-background/50 border border-primary/20 p-1.5 rounded text-foreground focus:outline-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground block mb-1">Data e Hora</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-background/50 border border-primary/20 p-1.5 rounded text-foreground focus:outline-none"
            />
          </div>
          <div>
            <label className="text-muted-foreground block mb-1">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-background/50 border border-primary/20 p-1.5 rounded text-foreground focus:outline-none"
            >
              <option value="trabalho">Trabalho</option>
              <option value="pessoal">Pessoal</option>
              <option value="saude">Saúde</option>
              <option value="lembrete">Lembrete</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary py-1.5 rounded flex items-center justify-center cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Salvar Evento
          </button>
        </form>
      </div>

      {/* Events List */}
      <div className="flex-1 glass-panel p-4 rounded-lg border border-primary/20 overflow-y-auto space-y-2">
        <h3 className="font-bold text-primary pb-2 border-b border-primary/20">
          PRÓXIMOS COMPROMISSOS
        </h3>
        {events.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">Nenhum evento agendado.</p>
        ) : (
          events.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg border border-primary/20 bg-background/30 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-foreground">{item.title}</p>
                <p className="text-muted-foreground text-[10px]">
                  {new Date(item.start).toLocaleString('pt-BR')} • {item.category}
                </p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-muted-foreground hover:text-rose-400 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
