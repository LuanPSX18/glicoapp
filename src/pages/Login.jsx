import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function entrar(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) setErro('Email ou senha incorretos.')
    setCarregando(false)
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💉</div>
          <h1 className="text-2xl font-bold text-gray-800">GlicoApp</h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhamento de glicemia</p>
        </div>

        <form onSubmit={entrar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {erro && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg text-base hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
