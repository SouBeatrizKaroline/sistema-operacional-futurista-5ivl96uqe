import { useState, useEffect } from 'react'
import { getMusicTracks, MusicTrack, updateMusicTrack } from '@/services/music'
import { useOS } from '@/hooks/use-os'
import { Play, Pause, Heart, Disc, Volume2 } from 'lucide-react'

export function MusicApp() {
  const { playingTrack, isPlaying, togglePlay, setTrack } = useOS()
  const [tracks, setTracks] = useState<MusicTrack[]>([])

  useEffect(() => {
    getMusicTracks().then(setTracks)
  }, [])

  const toggleFavorite = async (track: MusicTrack) => {
    const updated = await updateMusicTrack(track.id, { is_favorite: !track.is_favorite })
    setTracks((prev) => prev.map((t) => (t.id === track.id ? updated : t)))
  }

  return (
    <div className="h-full flex flex-col font-mono text-xs space-y-4">
      {/* Player Header */}
      <div className="glass-panel p-4 rounded-xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Disc className={`w-8 h-8 text-primary ${isPlaying ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">
              {playingTrack ? playingTrack.title : 'Selecione uma faixa'}
            </h3>
            <p className="text-muted-foreground">
              {playingTrack ? playingTrack.artist : 'HoloPlayer OS'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary cursor-pointer transition-all"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <Volume2 className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Simulated Waveform Visualizer */}
      <div className="glass-panel p-3 rounded-xl border border-primary/20 flex items-end justify-between h-16 px-6">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-full bg-primary/80 transition-all duration-300 ${
              isPlaying ? 'animate-pulse' : 'h-2 opacity-30'
            }`}
            style={{
              height: isPlaying ? `${Math.floor(Math.random() * 40) + 8}px` : '8px',
            }}
          />
        ))}
      </div>

      {/* Track List */}
      <div className="flex-1 glass-panel p-3 rounded-xl border border-primary/20 overflow-y-auto space-y-1">
        {tracks.map((t) => (
          <div
            key={t.id}
            onClick={() => setTrack(t)}
            className={`p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
              playingTrack?.id === t.id
                ? 'bg-primary/20 border-primary text-primary font-bold'
                : 'bg-background/20 border-primary/10 hover:bg-primary/10 text-foreground'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-muted-foreground text-[10px] w-4">{t.genre}</span>
              <div>
                <p className="line-clamp-1">{t.title}</p>
                <p className="text-[10px] text-muted-foreground">{t.artist}</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(t)
              }}
              className="text-muted-foreground hover:text-rose-400 cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${t.is_favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
