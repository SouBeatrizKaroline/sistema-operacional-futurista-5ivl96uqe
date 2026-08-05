import { useState, useEffect } from 'react'
import { useOS } from '@/hooks/use-os'
import { Clock, CloudSun, Calendar, Music, Cpu, StickyNote } from 'lucide-react'
import { getWidgets, WidgetItem, updateWidget } from '@/services/widgets'

export function WidgetsPanel() {
  const { playingTrack, isPlaying, togglePlay } = useOS()
  const [widgets, setWidgets] = useState<WidgetItem[]>([])
  const [noteText, setNoteText] = useState('Lembrete: Atualizar nó do assistente NEXUS')

  useEffect(() => {
    getWidgets().then((res) => {
      setWidgets(res)
      const noteW = res.find((w) => w.widget_type === 'notas')
      if (noteW && noteW.settings?.noteText) {
        setNoteText(noteW.settings.noteText)
      }
    })
  }, [])

  const handleSaveNote = async (text: string) => {
    setNoteText(text)
    const noteW = widgets.find((w) => w.widget_type === 'notas')
    if (noteW) {
      await updateWidget(noteW.id, { settings: { noteText: text } })
    }
  }

  return (
    <aside className="hidden lg:flex flex-col space-y-4 absolute top-14 right-6 bottom-20 w-80 z-10 pointer-events-auto overflow-y-auto pr-1">
      {/* Clock Widget */}
      <div className="glass-panel p-4 rounded-xl border border-primary/20 text-center font-mono">
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground mb-1">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>RELÓGIO QUÂNTICO</span>
        </div>
        <div className="text-2xl font-bold font-display text-primary tracking-widest text-glow">
          {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Weather Widget */}
      <div className="glass-panel p-4 rounded-xl border border-primary/20 font-mono">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <div className="flex items-center space-x-1.5">
            <CloudSun className="w-4 h-4 text-amber-400" />
            <span className="text-foreground font-semibold">São Paulo</span>
          </div>
          <span className="text-emerald-400">24°C</span>
        </div>
        <p className="text-[11px] text-muted-foreground">Ensolarado • Umidade 45% • Vento 12km/h</p>
      </div>

      {/* Mini Player */}
      <div className="glass-panel p-4 rounded-xl border border-primary/20 font-mono">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-xs text-secondary font-bold">
            <Music className="w-4 h-4 animate-spin" />
            <span>MÚSICA ATIVA</span>
          </div>
          <button onClick={togglePlay} className="text-xs text-primary underline cursor-pointer">
            {isPlaying ? 'Pausar' : 'Tocar'}
          </button>
        </div>
        <p className="text-xs font-semibold text-foreground line-clamp-1">
          {playingTrack ? playingTrack.title : 'Cybernetic Horizon'}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {playingTrack ? playingTrack.artist : 'Neon Drive'}
        </p>
      </div>

      {/* System Status Meter */}
      <div className="glass-panel p-4 rounded-xl border border-primary/20 font-mono space-y-2">
        <div className="flex items-center space-x-2 text-xs text-primary font-bold mb-1">
          <Cpu className="w-4 h-4" />
          <span>SISTEMA DE MÉT RICAS</span>
        </div>
        <div>
          <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
            <span>CPU</span>
            <span className="text-emerald-400">18%</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 w-[18%] transition-all" />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
            <span>MEMÓRIA RAM</span>
            <span className="text-primary">42%</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[42%] transition-all" />
          </div>
        </div>
      </div>

      {/* Quick Notes Widget */}
      <div className="glass-panel p-4 rounded-xl border border-primary/20 font-mono flex-1 flex flex-col">
        <div className="flex items-center space-x-2 text-xs text-amber-400 font-bold mb-2">
          <StickyNote className="w-4 h-4" />
          <span>NOTAS RÁPIDAS</span>
        </div>
        <textarea
          value={noteText}
          onChange={(e) => handleSaveNote(e.target.value)}
          placeholder="Escreva sua nota rápida aqui..."
          className="w-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none font-mono"
        />
      </div>
    </aside>
  )
}
