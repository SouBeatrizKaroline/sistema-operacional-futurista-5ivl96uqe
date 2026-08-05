import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  getUserSettings,
  updateUserSettings,
  createUserSettings,
  UserSettings,
} from '@/services/settings'
import { useAuth } from '@/hooks/use-auth'

export type AppId =
  | 'terminal'
  | 'files'
  | 'music'
  | 'email'
  | 'calendar'
  | 'dashboard'
  | 'settings'
  | 'nexus'

export interface WindowState {
  id: AppId
  title: string
  iconName: string
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface OSContextType {
  openWindows: WindowState[]
  activeWindowId: AppId | null
  theme: UserSettings['theme']
  clockFormat: '12h' | '24h'
  weatherCity: string
  settings: UserSettings | null
  notifCenterOpen: boolean
  setNotifCenterOpen: (open: boolean) => void
  openApp: (id: AppId) => void
  closeApp: (id: AppId) => void
  minimizeApp: (id: AppId) => void
  toggleMaximizeApp: (id: AppId) => void
  focusApp: (id: AppId) => void
  updateWindowPos: (id: AppId, pos: { x: number; y: number }) => void
  updateWindowSize: (id: AppId, size: { width: number; height: number }) => void
  changeTheme: (theme: UserSettings['theme']) => void
  updateSettingsData: (data: Partial<UserSettings>) => Promise<void>
  // Music State Simulation
  playingTrack: any | null
  isPlaying: boolean
  togglePlay: () => void
  setTrack: (track: any) => void
}

const APP_TITLES: Record<AppId, { title: string; icon: string }> = {
  terminal: { title: 'Terminal NEXUS', icon: 'Terminal' },
  files: { title: 'Arquivos & Documentos', icon: 'Folder' },
  music: { title: 'Música HoloPlayer', icon: 'Music' },
  email: { title: 'Caixa de Mensagens', icon: 'Mail' },
  calendar: { title: 'Agenda Holográfica', icon: 'Calendar' },
  dashboard: { title: 'Painel do Sistema', icon: 'LayoutDashboard' },
  settings: { title: 'Configurações do OS', icon: 'Settings' },
  nexus: { title: 'Assistente NEXUS IA', icon: 'Bot' },
}

const OSContext = createContext<OSContextType | undefined>(undefined)

export const useOS = () => {
  const ctx = useContext(OSContext)
  if (!ctx) throw new Error('useOS deve ser utilizado dentro do OSProvider')
  return ctx
}

export const OSProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [openWindows, setOpenWindows] = useState<WindowState[]>([])
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>(null)
  const [maxZIndex, setMaxZIndex] = useState(10)
  const [notifCenterOpen, setNotifCenterOpen] = useState(false)

  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [theme, setTheme] = useState<UserSettings['theme']>('neon-cyan')
  const [clockFormat, setClockFormat] = useState<'12h' | '24h'>('24h')
  const [weatherCity, setWeatherCity] = useState('São Paulo')

  // Music state simulation
  const [playingTrack, setPlayingTrack] = useState<any | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (user) {
      getUserSettings().then((res) => {
        if (res) {
          setSettings(res)
          setTheme(res.theme)
          setClockFormat(res.clock_format || '24h')
          setWeatherCity(res.weather_city || 'São Paulo')
        }
      })
    }
  }, [user])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const focusApp = (id: AppId) => {
    setActiveWindowId(id)
    const nextZ = maxZIndex + 1
    setMaxZIndex(nextZ)
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w)),
    )
  }

  const openApp = (id: AppId) => {
    const existing = openWindows.find((w) => w.id === id)
    if (existing) {
      if (existing.isMinimized) {
        focusApp(id)
      } else if (activeWindowId === id) {
        minimizeApp(id)
      } else {
        focusApp(id)
      }
      return
    }

    const nextZ = maxZIndex + 1
    setMaxZIndex(nextZ)

    const defaultWidth = Math.min(850, window.innerWidth - 40)
    const defaultHeight = Math.min(580, window.innerHeight - 100)
    const posX = Math.max(20, 60 + openWindows.length * 30)
    const posY = Math.max(40, 50 + openWindows.length * 25)

    const newWin: WindowState = {
      id,
      title: APP_TITLES[id].title,
      iconName: APP_TITLES[id].icon,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZ,
      position: { x: posX, y: posY },
      size: { width: defaultWidth, height: defaultHeight },
    }

    setOpenWindows((prev) => [...prev, newWin])
    setActiveWindowId(id)
  }

  const closeApp = (id: AppId) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id))
    if (activeWindowId === id) {
      const remaining = openWindows.filter((w) => w.id !== id && !w.isMinimized)
      if (remaining.length > 0) {
        const top = remaining.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), remaining[0])
        setActiveWindowId(top.id)
      } else {
        setActiveWindowId(null)
      }
    }
  }

  const minimizeApp = (id: AppId) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)))
    if (activeWindowId === id) {
      setActiveWindowId(null)
    }
  }

  const toggleMaximizeApp = (id: AppId) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)),
    )
  }

  const updateWindowPos = (id: AppId, pos: { x: number; y: number }) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, position: pos } : w)))
  }

  const updateWindowSize = (id: AppId, size: { width: number; height: number }) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, size: size } : w)))
  }

  const changeTheme = async (newTheme: UserSettings['theme']) => {
    setTheme(newTheme)
    if (settings) {
      await updateUserSettings(settings.id, { theme: newTheme })
    }
  }

  const updateSettingsData = async (data: Partial<UserSettings>) => {
    if (settings) {
      const updated = await updateUserSettings(settings.id, data)
      setSettings(updated)
      if (data.theme) setTheme(data.theme)
      if (data.clock_format) setClockFormat(data.clock_format)
      if (data.weather_city) setWeatherCity(data.weather_city)
    } else if (user) {
      const created = await createUserSettings({
        ...data,
        owner: user.id,
        theme: data.theme || 'neon-cyan',
        clock_format: data.clock_format || '24h',
      })
      setSettings(created)
    }
  }

  const togglePlay = () => setIsPlaying(!isPlaying)
  const setTrack = (t: any) => {
    setPlayingTrack(t)
    setIsPlaying(true)
  }

  return (
    <OSContext.Provider
      value={{
        openWindows,
        activeWindowId,
        theme,
        clockFormat,
        weatherCity,
        settings,
        notifCenterOpen,
        setNotifCenterOpen,
        openApp,
        closeApp,
        minimizeApp,
        toggleMaximizeApp,
        focusApp,
        updateWindowPos,
        updateWindowSize,
        changeTheme,
        updateSettingsData,
        playingTrack,
        isPlaying,
        togglePlay,
        setTrack,
      }}
    >
      {children}
    </OSContext.Provider>
  )
}
