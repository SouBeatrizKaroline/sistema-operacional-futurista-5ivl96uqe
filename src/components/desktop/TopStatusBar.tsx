import { useState, useEffect } from 'react'
import { Cpu, Wifi, BatteryCharging, Bell, Calendar as CalendarIcon, CloudSun } from 'lucide-react'
import { useOS } from '@/hooks/use-os'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { useRealtime } from '@/hooks/use-realtime'

export function TopStatusBar() {
  const { clockFormat, weatherCity, notifCenterOpen, setNotifCenterOpen } = useOS()
  const [timeStr, setTimeStr] = useState('')
  const [dateStr, setDateStr] = useState('')
  const [unreadCount, setUnreadCount] = useState(2)
  const [date, setDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeStr(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: clockFormat === '12h',
        }),
      )
      setDateStr(
        now.toLocaleDateString('pt-BR', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
        }),
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [clockFormat])

  useRealtime('notifications', () => {
    setUnreadCount((prev) => prev + 1)
  })

  return (
    <header className="fixed top-0 left-0 right-0 h-10 z-40 px-4 glass-panel border-b border-primary/20 flex items-center justify-between text-xs tracking-wider font-mono select-none">
      {/* Left: Brand & Status */}
      <div className="flex items-center space-[#3] space-x-3">
        <div className="flex items-center space-x-2 font-display font-bold text-primary text-sm tracking-widest text-glow">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span>NEXUS OS</span>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-muted-foreground border-l border-primary/20 pl-3">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[11px] text-emerald-400/90 font-semibold">ONLINE</span>
        </div>
      </div>

      {/* Center: Weather & System Metrics */}
      <div className="hidden sm:flex items-center space-x-6 text-foreground/80">
        <div className="flex items-center space-x-1.5 text-primary/90">
          <CloudSun className="w-3.5 h-3.5 text-primary" />
          <span>{weatherCity}: 24°C Ensolarado</span>
        </div>
        <div className="flex items-center space-x-1 text-muted-foreground">
          <Cpu className="w-3.5 h-3.5 text-secondary" />
          <span>CPU: 18%</span>
        </div>
      </div>

      {/* Right: Date, Clock, Notifications */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Wifi className="w-3.5 h-3.5 text-primary" />
          <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center space-x-2 text-primary font-bold hover:text-white transition-colors cursor-pointer px-2 py-1 rounded hover:bg-primary/10">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{dateStr}</span>
              <span className="text-foreground">{timeStr}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="glass-panel border-primary/30 text-foreground p-3 w-auto z-50">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border border-primary/20"
            />
          </PopoverContent>
        </Popover>

        <button
          onClick={() => setNotifCenterOpen(!notifCenterOpen)}
          className="relative p-1.5 rounded-full hover:bg-primary/20 transition-colors text-primary cursor-pointer"
          title="Central de Notificações"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
