import { useOS, AppId } from '@/hooks/use-os'
import {
  Terminal,
  Folder,
  Music,
  Mail,
  Calendar,
  LayoutDashboard,
  Settings,
  Bot,
} from 'lucide-react'
import { useState } from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

interface DesktopIcon {
  id: AppId
  label: string
  icon: any
}

const DESKTOP_ICONS: DesktopIcon[] = [
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'files', label: 'Arquivos', icon: Folder },
  { id: 'music', label: 'Música', icon: Music },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'calendar', label: 'Agenda', icon: Calendar },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'nexus', label: 'NEXUS IA', icon: Bot },
  { id: 'settings', label: 'Configurações', icon: Settings },
]

export function DesktopIcons() {
  const { openApp, changeTheme, theme } = useOS()
  const [selectedId, setSelectedId] = useState<AppId | null>(null)

  const handleNextTheme = () => {
    const themes = [
      'neon-cyan',
      'aurora-purple',
      'matrix-green',
      'solaris-amber',
      'crimson',
      'mono',
    ] as const
    const currentIdx = themes.indexOf(theme as any)
    changeTheme(themes[(currentIdx + 1) % themes.length])
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger className="absolute inset-0 pt-14 pb-20 px-6 z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 auto-rows-min pointer-events-auto">
        {DESKTOP_ICONS.map((item) => {
          const Icon = item.icon
          const isSelected = selectedId === item.id

          return (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              onDoubleClick={() => openApp(item.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all cursor-pointer group w-24 h-24 ${
                isSelected
                  ? 'bg-primary/20 border border-primary/50 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                  : 'hover:bg-primary/10 hover:border hover:border-primary/30'
              }`}
            >
              <div className="p-2.5 rounded-lg bg-background/50 border border-primary/20 group-hover:scale-110 group-hover:border-primary/60 transition-all">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <span className="mt-2 text-xs font-medium text-foreground text-center line-clamp-1 drop-shadow-md">
                {item.label}
              </span>
            </div>
          )
        })}
      </ContextMenuTrigger>

      <ContextMenuContent className="glass-panel text-xs text-foreground font-mono border-primary/30 z-50">
        <ContextMenuItem
          onClick={() => openApp('files')}
          className="hover:bg-primary/20 cursor-pointer"
        >
          Novo Arquivo
        </ContextMenuItem>
        <ContextMenuItem onClick={handleNextTheme} className="hover:bg-primary/20 cursor-pointer">
          Alternar Tema
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => openApp('dashboard')}
          className="hover:bg-primary/20 cursor-pointer"
        >
          Abrir Dashboard
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
