import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Login() {
  const { signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    if (!email || !password) { setError('Preencha todos os campos.'); return }
    if (password.length < 6) { setError('A senha precisa ter ao menos 6 caracteres.'); return }
    setLoading(true)
    if (isLogin) {
      const { error } = await signIn(email, password)
      if (error) setError('E-mail ou senha incorretos.')
    } else {
      const { error } = await signUp(email, password)
      if (error) setError(error)
      else setSuccess('Conta criada! Verifique seu e-mail para confirmar.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌿</div>
          <h1 className="text-3xl font-bold text-[#1B4332]">HabitTrack</h1>
          <p className="text-gray-500 mt-1">Construa hábitos que duram</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-[#1B4332] mb-4">
            {isLogin ? 'Entrar na conta' : 'Criar conta'}
          </h2>

          <div className="space-y-3">
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Senha (mín. 6 caracteres)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          {success && <p className="text-[#52B788] text-sm mt-3">{success}</p>}

          <Button className="w-full mt-4" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar conta'}
          </Button>

          <p className="text-center text-sm text-gray-500 mt-4">
            {isLogin ? 'Ainda não tem conta?' : 'Já tem uma conta?'}{' '}
            <button
              className="text-[#52B788] font-medium hover:underline"
              onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess('') }}
            >
              {isLogin ? 'Criar conta' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
