import pb from '@/lib/pocketbase/client'

export interface WidgetItem {
  id: string
  widget_type: 'relogio' | 'clima' | 'agenda' | 'musica' | 'sistema' | 'notas'
  position?: number
  settings?: any
  is_visible?: boolean
  owner: string
  created: string
  updated: string
}

export const getWidgets = () =>
  pb.collection('widgets').getFullList<WidgetItem>({ sort: 'position' })
export const updateWidget = (id: string, data: Partial<WidgetItem>) =>
  pb.collection('widgets').update<WidgetItem>(id, data)
