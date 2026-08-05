import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import pb from '@/lib/pocketbase/client'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState('Confirmando e-mail...')
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    if (token) {
      pb.collection('users')
        .confirmVerification(token)
        .then(() => {
          setStatus('E-mail verificado com sucesso! Redirecionando...')
          setTimeout(() => navigate('/'), 2000)
        })
        .catch(() => setStatus('Falha ao verificar e-mail. Token inválido.'))
    }
  }, [params, navigate])

  return (
    <div className="min-h-screen bg-[#030712] text-foreground font-mono flex items-center justify-center p-4">
      <div className="glass-panel p-6 rounded-xl border border-primary/30 text-center max-w-sm">
        <h2 className="text-primary font-bold text-lg mb-2">VERIFICAÇÃO DE CONTA</h2>
        <p className="text-xs text-muted-foreground">{status}</p>
      </div>
    </div>
  )
}
