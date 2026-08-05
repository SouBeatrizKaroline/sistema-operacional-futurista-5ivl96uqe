import pb from '@/lib/pocketbase/client'

export interface UserSettings {
  id: string
  theme: 'neon-cyan' | 'aurora-purple' | 'matrix-green' | 'solaris-amber' | 'crimson' | 'mono'
  wallpaper?: string
  accent?: string
  clock_format: '12h' | '24h'
  weather_city?: string
  terminal_greeting?: string
  notif_sound?: boolean
  owner: string
  created: string
  updated: string
}

export const getUserSettings = async () => {
  const records = await pb.collection('user_settings').getFullList<UserSettings>()
  return records[0] || null
}

export const updateUserSettings = (id: string, data: Partial<UserSettings>) =>
  pb.collection('user_settings').update<UserSettings>(id, data)

export const createUserSettings = (data: Partial<UserSettings>) =>
  pb.collection('user_settings').create<UserSettings>(data)
