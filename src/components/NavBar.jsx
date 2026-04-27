import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const links = [
  { to: '/', label: 'Hoje', icon: '🏠' },
  { to: '/registrar', label: 'Registrar', icon: '➕' },
  { to: '/historico', label: 'Histórico', icon: '📋' },
  { to: '/grafico', label: 'Gráfico', icon: '📈' },
]

export default function NavBar() {
  const location = useLocation()

  async function sair() {
    await supabase.auth.signOut()
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2">
        {links.map(({ to, label, icon }) => {
          const ativo = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                ativo ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
        <button
          onClick={sair}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-gray-500"
        >
          <span className="text-xl">🚪</span>
          <span className="text-xs font-medium">Sair</span>
        </button>
      </div>
    </nav>
  )
}
