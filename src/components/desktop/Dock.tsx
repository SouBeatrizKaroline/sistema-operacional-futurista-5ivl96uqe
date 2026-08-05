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
  SunMoon,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface DockItem {
  id: AppId
  label: string
  icon: any
}

const DOCK_APPS: DockItem[] = [
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'files', label: 'Arquivos', icon: Folder },
  { id: 'music', label: 'Música', icon: Music },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'calendar', label: 'Agenda', icon: Calendar },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'nexus', label: 'NEXUS IA', icon: Bot },
  { id: 'settings', label: 'Configurações', icon: Settings },
]

export function Dock() {
  const { openApp, openWindows, activeWindowId, theme, changeTheme } = useOS()

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
    const nextTheme = themes[(currentIdx + 1) % themes.length]
    changeTheme(nextTheme)
  }

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 px-3 py-2 glass-panel rounded-2xl border border-primary/30 flex items-center space-x-2 sm:space-x-3 shadow-2xl transition-all hover:border-primary/60">
      {DOCK_APPS.map((app) => {
        const Icon = app.icon
        const isOpen = openWindows.some((w) => w.id === app.id)
        const isActive = activeWindowId === app.id

        return (
          <Tooltip key={app.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => openApp(app.id)}
                className={`relative group p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
                  isActive
                    ? 'bg-primary/25 border border-primary/60 shadow-[0_0_15px_rgba(0,229,255,0.4)] scale-110'
                    : isOpen
                      ? 'bg-primary/10 border border-primary/30 hover:scale-105'
                      : 'hover:bg-primary/15 hover:scale-110'
                }`}
              >
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${isActive ? 'text-primary' : 'text-foreground/90 group-hover:text-primary'}`}
                />
                {isOpen && (
                  <span
                    className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ${
                      isActive
                        ? 'bg-primary shadow-[0_0_6px_var(--glow-color)]'
                        : 'bg-foreground/50'
                    }`}
                  />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="glass-panel text-xs text-primary font-mono border-primary/30"
            >
              {app.label}
            </TooltipContent>
          </Tooltip>
        )
      })}

      <div className="w-[1px] h-6 bg-primary/20 my-auto mx-1" />

      {/* Theme Switcher Quick Toggle */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleNextTheme}
            className="p-2.5 rounded-xl hover:bg-secondary/20 text-secondary hover:scale-110 transition-all cursor-pointer"
          >
            <SunMoon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="glass-panel text-xs text-secondary font-mono border-secondary/30"
        >
          Mudar Tema
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
