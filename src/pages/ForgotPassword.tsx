import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const { requestPasswordReset } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await requestPasswordReset(email)
    setMsg('Se a conta existir, um e-mail de recuperação foi enviado.')
  }

  return (
    <div className="min-h-screen bg-[#030712] text-foreground font-mono flex items-center justify-center p-4">
      <div className="glass-panel p-6 rounded-xl border border-primary/30 max-w-sm w-full space-y-4">
        <h2 className="text-primary font-bold text-base text-center">RECUPERAR SENHA</h2>
        {msg && <p className="text-xs text-emerald-400 text-center">{msg}</p>}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <input
            type="email"
            required
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background/50 border border-primary/20 px-3 py-2 rounded text-foreground focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-primary/20 border border-primary/40 text-primary py-2 rounded font-bold"
          >
            ENVIAR LINK
          </button>
        </form>
      </div>
    </div>
  )
}
