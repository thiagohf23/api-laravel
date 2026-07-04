import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react'
import client from '../api/client'
import Button from '../components/ui/Button'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await client.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      localStorage.setItem('auth_token', res.data.token)
      navigate('/')
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors).flat()
        setError(messages.join('\n'))
      } else {
        setError('Erro ao criar conta.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center text-xl font-bold mx-auto mb-4">
            T
          </div>
          <h1 className="text-xl font-bold text-zinc-100">Task Manager</h1>
          <p className="text-sm text-zinc-500 mt-1">Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 backdrop-blur-sm">
          {error && (
            <div className="flex items-start gap-2.5 text-sm text-red-400 bg-red-950/40 rounded-lg px-3.5 py-2.5 whitespace-pre-line">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm text-zinc-400 block" htmlFor="reg-name">Nome</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 pl-10 pr-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
                placeholder="Seu nome"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-zinc-400 block" htmlFor="reg-email">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 pl-10 pr-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-zinc-400 block" htmlFor="reg-password">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 pl-10 pr-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-zinc-400 block" htmlFor="reg-password-confirm">Confirmar Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
              <input
                id="reg-password-confirm"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 pl-10 pr-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
                placeholder="Repita a senha"
                required
              />
            </div>
          </div>

          <Button type="submit" loading={loading} className="w-full">
            {!loading && <UserPlus className="h-4 w-4" />}
            Criar Conta
          </Button>

          <p className="text-sm text-zinc-600 text-center">
            Já tem conta?{' '}
            <Link to="/login" className="text-zinc-400 hover:text-zinc-200 transition-colors font-medium">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
