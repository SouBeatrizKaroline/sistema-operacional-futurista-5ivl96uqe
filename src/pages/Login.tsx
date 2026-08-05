import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Bot } from 'lucide-react'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    if (isSignUp) {
      const res = await signUp(email, password, name)
      if (res.error) {
        setErrorMsg('Erro ao criar conta. Verifique os dados.')
      } else {
        navigate('/')
      }
    } else {
      const res = await signIn(email, password)
      if (res.error) {
        setErrorMsg('Credenciais inválidas.')
      } else {
        navigate('/')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#030712] text-foreground font-sans flex items-center justify-center p-4 relative overflow-hidden select-none">
      <div className="w-full max-w-md glass-panel-glow p-8 rounded-2xl border border-primary/30 z-10 font-mono">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 rounded-full bg-primary/20 border border-primary/40 text-primary mb-2">
            <Bot className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-display text-primary tracking-widest text-glow">
            NEXUS OS
          </h1>
          <p className="text-xs text-muted-foreground mt-1">SISTEMA OPERACIONAL HOLOGRÁFICO</p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isSignUp && (
            <div>
              <label className="text-muted-foreground block mb-1">Nome do Operador</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background/50 border border-primary/20 px-3 py-2 rounded text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          )}
          <div>
            <label className="text-muted-foreground block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background/50 border border-primary/20 px-3 py-2 rounded text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-muted-foreground block mb-1">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background/50 border border-primary/20 px-3 py-2 rounded text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary font-bold cursor-pointer transition-all mt-2"
          >
            {loading ? 'PROCESSANDO...' : isSignUp ? 'CRIAR CONTA' : 'ENTRAR NO SISTEMA'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs space-y-2">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            {isSignUp ? 'Já tem conta? Entrar' : 'Não tem conta? Criar nova'}
          </button>
        </div>
      </div>
    </div>
  )
}
