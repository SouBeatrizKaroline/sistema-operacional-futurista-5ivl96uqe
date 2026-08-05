import { ReactNode, useState, useRef, useEffect } from 'react'
import { useOS, WindowState } from '@/hooks/use-os'
import {
  Minus,
  Square,
  Copy,
  X,
  Terminal,
  Folder,
  Music,
  Mail,
  Calendar,
  LayoutDashboard,
  Settings,
  Bot,
} from 'lucide-react'

interface WindowFrameProps {
  windowState: WindowState
  children: ReactNode
}

const ICON_MAP: Record<string, any> = {
  Terminal,
  Folder,
  Music,
  Mail,
  Calendar,
  LayoutDashboard,
  Settings,
  Bot,
}

export function WindowFrame({ windowState, children }: WindowFrameProps) {
  const {
    closeApp,
    minimizeApp,
    toggleMaximizeApp,
    focusApp,
    updateWindowPos,
    updateWindowSize,
    activeWindowId,
  } = useOS()
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const frameRef = useRef<HTMLDivElement>(null)

  const Icon = ICON_MAP[windowState.iconName] || Terminal
  const isActive = activeWindowId === windowState.id

  const handleMouseDown = (e: React.MouseEvent) => {
    focusApp(windowState.id)
    if (windowState.isMaximized) return
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - windowState.position.x,
      y: e.clientY - windowState.position.y,
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const nextX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffset.x))
      const nextY = Math.max(40, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y))
      updateWindowPos(windowState.id, { x: nextX, y: nextY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset, windowState.id])

  if (windowState.isMinimized) return null

  return (
    <div
      ref={frameRef}
      onClick={() => focusApp(windowState.id)}
      style={{
        zIndex: windowState.zIndex,
        top: windowState.isMaximized ? '2.5rem' : `${windowState.position.y}px`,
        left: windowState.isMaximized ? '0' : `${windowState.position.x}px`,
        width: windowState.isMaximized ? '100vw' : `${windowState.size.width}px`,
        height: windowState.isMaximized ? 'calc(100vh - 5rem)' : `${windowState.size.height}px`,
      }}
      className={`fixed flex flex-col glass-panel rounded-xl overflow-hidden transition-all duration-150 shadow-2xl ${
        isActive
          ? 'border-2 border-primary/70 shadow-[0_0_30px_rgba(0,229,255,0.25)]'
          : 'border border-primary/30 opacity-90 hover:opacity-100'
      }`}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        className={`h-10 px-4 flex items-center justify-between border-b select-none cursor-move transition-colors ${
          isActive ? 'bg-primary/20 border-primary/40' : 'bg-background/40 border-primary/20'
        }`}
      >
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-foreground">
          <Icon className="w-4 h-4 text-primary" />
          <span className="tracking-wide">{windowState.title}</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation()
              minimizeApp(windowState.id)
            }}
            className="w-3.5 h-3.5 rounded-full bg-amber-500/80 hover:bg-amber-400 flex items-center justify-center text-black cursor-pointer transition-colors"
          >
            <Minus className="w-2.5 h-2.5 opacity-0 hover:opacity-100" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleMaximizeApp(windowState.id)
            }}
            className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 hover:bg-emerald-400 flex items-center justify-center text-black cursor-pointer transition-colors"
          >
            {windowState.isMaximized ? (
              <Copy className="w-2.5 h-2.5 opacity-0 hover:opacity-100" />
            ) : (
              <Square className="w-2.5 h-2.5 opacity-0 hover:opacity-100" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeApp(windowState.id)
            }}
            className="w-3.5 h-3.5 rounded-full bg-rose-500/80 hover:bg-rose-400 flex items-center justify-center text-black cursor-pointer transition-colors"
          >
            <X className="w-2.5 h-2.5 opacity-0 hover:opacity-100" />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-auto bg-background/50 p-4 font-sans">{children}</div>
    </div>
  )
}
