import { useOS } from '@/hooks/use-os'
import { WindowFrame } from './WindowFrame'
import { TerminalApp } from '../apps/TerminalApp'
import { FilesApp } from '../apps/FilesApp'
import { MusicApp } from '../apps/MusicApp'
import { EmailApp } from '../apps/EmailApp'
import { CalendarApp } from '../apps/CalendarApp'
import { DashboardApp } from '../apps/DashboardApp'
import { SettingsApp } from '../apps/SettingsApp'
import { NexusApp } from '../apps/NexusApp'

export function WindowManager() {
  const { openWindows } = useOS()

  const renderApp = (id: string) => {
    switch (id) {
      case 'terminal':
        return <TerminalApp />
      case 'files':
        return <FilesApp />
      case 'music':
        return <MusicApp />
      case 'email':
        return <EmailApp />
      case 'calendar':
        return <CalendarApp />
      case 'dashboard':
        return <DashboardApp />
      case 'settings':
        return <SettingsApp />
      case 'nexus':
        return <NexusApp />
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {openWindows.map((win) => (
        <div key={win.id} className="pointer-events-auto">
          <WindowFrame windowState={win}>{renderApp(win.id)}</WindowFrame>
        </div>
      ))}
    </div>
  )
}
