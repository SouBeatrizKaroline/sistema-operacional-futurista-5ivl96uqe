import { useState, useEffect } from 'react'
import { useOS } from '@/hooks/use-os'
import {
  X,
  CheckCheck,
  Trash2,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Mail,
  Music,
} from 'lucide-react'
import {
  getNotifications,
  NotificationItem,
  updateNotification,
  deleteNotification,
} from '@/services/notifications'
import { useRealtime } from '@/hooks/use-realtime'

export function NotificationCenter() {
  const { notifCenterOpen, setNotifCenterOpen } = useOS()
  const [list, setList] = useState<NotificationItem[]>([])

  const loadNotifs = async () => {
    const res = await getNotifications()
    setList(res)
  }

  useEffect(() => {
    if (notifCenterOpen) {
      loadNotifs()
    }
  }, [notifCenterOpen])

  useRealtime('notifications', () => {
    loadNotifs()
  })

  if (!notifCenterOpen) return null

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'sucesso':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      case 'aviso':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />
      case 'alerta':
        return <AlertCircle className="w-4 h-4 text-rose-500" />
      case 'email':
        return <Mail className="w-4 h-4 text-primary" />
      case 'musica':
        return <Music className="w-4 h-4 text-secondary" />
      default:
        return <Info className="w-4 h-4 text-primary" />
    }
  }

  const markAllRead = async () => {
    await Promise.all(
      list.filter((n) => !n.is_read).map((n) => updateNotification(n.id, { is_read: true })),
    )
    loadNotifs()
  }

  const handleClear = async (id: string) => {
    await deleteNotification(id)
    setList((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="fixed top-12 right-4 w-80 sm:w-96 max-h-[80vh] z-50 glass-panel rounded-2xl border border-primary/30 p-4 shadow-2xl flex flex-col font-mono animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-primary/20">
        <h3 className="text-sm font-bold text-primary font-display tracking-wider">
          CENTRAL DE NOTIFICAÇÕES
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={markAllRead}
            className="p-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            title="Marcar todas como lidas"
          >
            <CheckCheck className="w-4 h-4" />
          </button>
          <button
            onClick={() => setNotifCenterOpen(false)}
            className="p-1 text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mt-3 pr-1">
        {list.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">
            Nenhuma notificação no momento.
          </p>
        ) : (
          list.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all flex items-start space-x-3 ${
                item.is_read
                  ? 'bg-background/30 border-primary/10 opacity-70'
                  : 'bg-primary/10 border-primary/30 shadow-[0_0_10px_rgba(0,229,255,0.1)]'
              }`}
            >
              <div className="mt-0.5">{getIcon(item.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">{item.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                  {item.message}
                </p>
              </div>
              <button
                onClick={() => handleClear(item.id)}
                className="text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
