import pb from '@/lib/pocketbase/client'

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: string
  end?: string
  all_day?: boolean
  category: 'trabalho' | 'pessoal' | 'social' | 'saude' | 'lembrete'
  color?: string
  owner: string
  created: string
  updated: string
}

export const getCalendarEvents = () =>
  pb.collection('calendar_events').getFullList<CalendarEvent>({ sort: 'start' })
export const createCalendarEvent = (data: Partial<CalendarEvent>) =>
  pb.collection('calendar_events').create<CalendarEvent>(data)
export const updateCalendarEvent = (id: string, data: Partial<CalendarEvent>) =>
  pb.collection('calendar_events').update<CalendarEvent>(id, data)
export const deleteCalendarEvent = (id: string) => pb.collection('calendar_events').delete(id)
