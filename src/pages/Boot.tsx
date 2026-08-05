import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

const LOG_LINES = [
  'INICIALIZANDO NÚCLEO QUANTICO...',
  'CARREGANDO MÓDULOS HOLOGRÁFICOS...',
  'VERIFICANDO INTEGRIDADE DOS DADOS...',
  'CONECTANDO ASSISTENTE NEXUS IA...',
  'SISTEMA PRONTO.',
]

export default function BootPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    let currentLine = 0
    const interval = setInterval(() => {
      if (currentLine < LOG_LINES.length) {
        setLogs((prev) => [...prev, LOG_LINES[currentLine]])
        currentLine++
        setProgress((currentLine / LOG_LINES.length) * 100)
      } else {
        clearInterval(interval)
        setTimeout(() => {
          navigate(isAuthenticated ? '/' : '/login')
        }, 800)
      }
    }, 600)

    return () => clearInterval(interval)
  }, [navigate, isAuthenticated])

  return (
    <div className="min-h-screen bg-[#030712] text-primary font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Central Holographic Ring */}
      <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
        <div className="absolute inset-2 rounded-full border border-secondary/30 border-b-secondary animate-pulse" />
        <span className="font-display font-black text-xl tracking-widest text-glow">NEXUS</span>
      </div>

      {/* Boot Logs */}
      <div className="w-full max-w-md h-32 flex flex-col justify-end text-xs space-y-1 mb-6">
        {logs.map((line, idx) => (
          <p key={idx} className="animate-fade-in text-foreground/90">
            {line}
          </p>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md h-1.5 bg-muted/40 rounded-full overflow-hidden border border-primary/20">
        <div
          className="h-full bg-primary transition-all duration-300 shadow-[0_0_10px_var(--glow-color)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        onClick={() => navigate(isAuthenticated ? '/' : '/login')}
        className="absolute bottom-8 text-xs text-muted-foreground hover:text-primary underline cursor-pointer"
      >
        [ Pular Animação ]
      </button>
    </div>
  )
}
