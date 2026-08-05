import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

export default function ConfirmEmailChangePage() {
  const [params] = useSearchParams()
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const { confirmEmailChange } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = params.get('token')
    if (!token) return
    const res = await confirmEmailChange(token, password)
    if (res.error) {
      setMsg('Erro ao alterar e-mail.')
    } else {
      setMsg('E-mail alterado com sucesso! Faça login novamente.')
      setTimeout(() => navigate('/login'), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-foreground font-mono flex items-center justify-center p-4">
      <div className="glass-panel p-6 rounded-xl border border-primary/30 max-w-sm w-full space-y-4">
        <h2 className="text-primary font-bold text-base text-center">CONFIRMAR NOVO EMAIL</h2>
        {msg && <p className="text-xs text-primary text-center">{msg}</p>}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <input
            type="password"
            required
            placeholder="Sua senha atual"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background/50 border border-primary/20 px-3 py-2 rounded text-foreground focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-primary/20 border border-primary/40 text-primary py-2 rounded font-bold"
          >
            CONFIRMAR ALTERAÇÃO
          </button>
        </form>
      </div>
    </div>
  )
}
