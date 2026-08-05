import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const { confirmPasswordReset } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = params.get('token')
    if (!token) return
    const res = await confirmPasswordReset(token, password)
    if (res.error) {
      setMsg('Erro ao redefinir senha.')
    } else {
      setMsg('Senha alterada! Redirecionando...')
      setTimeout(() => navigate('/login'), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-foreground font-mono flex items-center justify-center p-4">
      <div className="glass-panel p-6 rounded-xl border border-primary/30 max-w-sm w-full space-y-4">
        <h2 className="text-primary font-bold text-base text-center">REDEFINIR SENHA</h2>
        {msg && <p className="text-xs text-primary text-center">{msg}</p>}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <input
            type="password"
            required
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background/50 border border-primary/20 px-3 py-2 rounded text-foreground focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-primary/20 border border-primary/40 text-primary py-2 rounded font-bold"
          >
            CONFIRMAR NOVA SENHA
          </button>
        </form>
      </div>
    </div>
  )
}
