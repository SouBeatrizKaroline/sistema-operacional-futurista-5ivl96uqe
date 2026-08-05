import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { OSProvider } from '@/hooks/use-os'
import { Wallpaper } from '@/components/desktop/Wallpaper'
import { TopStatusBar } from '@/components/desktop/TopStatusBar'
import { Dock } from '@/components/desktop/Dock'
import { DesktopIcons } from '@/components/desktop/DesktopIcons'
import { WidgetsPanel } from '@/components/desktop/WidgetsPanel'
import { NotificationCenter } from '@/components/desktop/NotificationCenter'
import { WindowManager } from '@/components/desktop/WindowManager'

export default function IndexPage() {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, loading, navigate])

  if (loading || !isAuthenticated) return null

  return (
    <OSProvider>
      <div className="relative w-screen h-screen overflow-hidden select-none font-sans">
        <Wallpaper />
        <TopStatusBar />
        <DesktopIcons />
        <WidgetsPanel />
        <WindowManager />
        <NotificationCenter />
        <Dock />
      </div>
    </OSProvider>
  )
}
