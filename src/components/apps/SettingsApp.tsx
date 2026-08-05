import { useOS } from '@/hooks/use-os'
import { useAuth } from '@/hooks/use-auth'
import { Palette, Clock, LogOut } from 'lucide-react'

const THEMES = [
  { id: 'neon-cyan', name: 'Neon Cyan', color: '#00E5FF' },
  { id: 'aurora-purple', name: 'Aurora Purple', color: '#A855F7' },
  { id: 'matrix-green', name: 'Matrix Green', color: '#00FF88' },
  { id: 'solaris-amber', name: 'Solaris Amber', color: '#FFAA00' },
  { id: 'crimson', name: 'Crimson', color: '#F43F5E' },
  { id: 'mono', name: 'Mono White', color: '#FFFFFF' },
] as const

export function SettingsApp() {
  const { theme, changeTheme, clockFormat, updateSettingsData } = useOS()
  const { signOut, user } = useAuth()

  return (
    <div className="h-full flex flex-col font-mono text-xs space-y-6 overflow-y-auto">
      {/* Theme Picker */}
      <div className="glass-panel p-4 rounded-xl border border-primary/20 space-y-3">
        <div className="flex items-center space-x-2 text-primary font-bold">
          <Palette className="w-4 h-4" />
          <span>TEMAS DO SISTEMA</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => changeTheme(t.id as any)}
              className={`p-3 rounded-lg border flex items-center space-x-2 cursor-pointer transition-all ${
                theme === t.id
                  ? 'border-primary bg-primary/20 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                  : 'border-primary/20 bg-background/20 hover:bg-primary/10'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full border border-white/40"
                style={{ backgroundColor: t.color }}
              />
              <span className="text-foreground">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-panel p-4 rounded-xl border border-primary/20 space-y-3">
        <div className="flex items-center space-x-2 text-primary font-bold">
          <Clock className="w-4 h-4" />
          <span>PREFERÊNCIAS DE EXIBIÇÃO</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-foreground">Formato do Relógio:</span>
          <select
            value={clockFormat}
            onChange={(e) => updateSettingsData({ clock_format: e.target.value as any })}
            className="bg-background/50 border border-primary/20 px-3 py-1 rounded text-foreground focus:outline-none"
          >
            <option value="24h">24 Horas</option>
            <option value="12h">12 Horas (AM/PM)</option>
          </select>
        </div>
      </div>

      {/* Account Section */}
      <div className="glass-panel p-4 rounded-xl border border-primary/20 flex items-center justify-between">
        <div>
          <p className="font-bold text-foreground">{user?.name || 'Operador NEXUS'}</p>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        <button
          onClick={signOut}
          className="px-3 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-400 font-bold flex items-center space-x-1.5 cursor-pointer transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  )
}
