import pb from '@/lib/pocketbase/client'

export interface NotificationItem {
  id: string
  title?: string
  message?: string
  type: 'info' | 'sucesso' | 'aviso' | 'alerta' | 'email' | 'musica'
  is_read?: boolean
  owner: string
  created: string
  updated: string
}

export const getNotifications = () =>
  pb.collection('notifications').getFullList<NotificationItem>({ sort: '-created' })
export const createNotification = (data: Partial<NotificationItem>) =>
  pb.collection('notifications').create<NotificationItem>(data)
export const updateNotification = (id: string, data: Partial<NotificationItem>) =>
  pb.collection('notifications').update<NotificationItem>(id, data)
export const deleteNotification = (id: string) => pb.collection('notifications').delete(id)
