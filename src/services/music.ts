import pb from '@/lib/pocketbase/client'

export interface MusicTrack {
  id: string
  title: string
  artist?: string
  album?: string
  duration?: number
  genre: 'synthwave' | 'lo-fi' | 'eletronica' | 'ambient' | 'pop'
  cover?: string
  is_favorite?: boolean
  owner: string
  created: string
  updated: string
}

export interface Playlist {
  id: string
  name: string
  songs?: string[]
  owner: string
  created: string
  updated: string
}

export const getMusicTracks = () =>
  pb.collection('music_library').getFullList<MusicTrack>({ sort: 'title' })
export const updateMusicTrack = (id: string, data: Partial<MusicTrack>) =>
  pb.collection('music_library').update<MusicTrack>(id, data)

export const getPlaylists = () =>
  pb.collection('playlists').getFullList<Playlist>({ expand: 'songs' })
export const createPlaylist = (data: Partial<Playlist>) =>
  pb.collection('playlists').create<Playlist>(data)
