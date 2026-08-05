import { useOS } from '@/hooks/use-os'
import { Bot, FileText, Calendar, Mail, Zap } from 'lucide-react'

export function DashboardApp() {
  const { openApp } = useOS()

  return (
    <div className="h-full flex flex-col font-mono text-xs space-y-4 overflow-y-auto">
      {/* Greeting Banner */}
      <div className="glass-panel p-4 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold font-display text-primary tracking-wider">
            PAINEL DE CONTROLE DE OPERAÇÕES
          </h2>
          <p className="text-muted-foreground mt-0.5">
            Todos os sub-módulos neurais estão operando em 100% de capacidade.
          </p>
        </div>
        <button
          onClick={() => openApp('nexus')}
          className="px-3 py-2 rounded-lg bg-primary/20 border border-primary/50 text-primary font-bold hover:bg-primary/30 flex items-center space-x-1.5 cursor-pointer transition-all"
        >
          <Bot className="w-4 h-4" />
          <span>Falar com NEXUS</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-3 rounded-xl border border-primary/20 flex flex-col space-y-1">
          <div className="flex items-center justify-between text-primary">
            <span>Arquivos</span>
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold font-display text-foreground">12</span>
        </div>
        <div className="glass-panel p-3 rounded-xl border border-primary/20 flex flex-col space-y-1">
          <div className="flex items-center justify-between text-secondary">
            <span>Eventos</span>
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold font-display text-foreground">3</span>
        </div>
        <div className="glass-panel p-3 rounded-xl border border-primary/20 flex flex-col space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span>Emails</span>
            <Mail className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold font-display text-foreground">3</span>
        </div>
        <div className="glass-panel p-3 rounded-xl border border-primary/20 flex flex-col space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span>Energia</span>
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold font-display text-foreground">98%</span>
        </div>
      </div>

      {/* Quick Shortcuts */}
      <div className="glass-panel p-4 rounded-xl border border-primary/20 flex-1 space-y-3">
        <h3 className="font-bold text-primary border-b border-primary/20 pb-2">AÇÕES RÁPIDAS</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
            onClick={() => openApp('terminal')}
            className="p-3 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-foreground text-left cursor-pointer transition-all"
          >
            <p className="font-bold text-primary">Abrir Terminal</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Executar comandos</p>
          </button>
          <button
            onClick={() => openApp('calendar')}
            className="p-3 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-foreground text-left cursor-pointer transition-all"
          >
            <p className="font-bold text-primary">Novo Evento</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Agendar horário</p>
          </button>
          <button
            onClick={() => openApp('settings')}
            className="p-3 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-foreground text-left cursor-pointer transition-all"
          >
            <p className="font-bold text-primary">Ajustes</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Configurar OS</p>
          </button>
        </div>
      </div>
    </div>
  )
}
