import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import RegistrarGlicemia from './pages/RegistrarGlicemia'
import RegistrarInsulina from './pages/RegistrarInsulina'
import Historico from './pages/Historico'
import Grafico from './pages/Grafico'

export default function App() {
  const [sessao, setSessao] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSessao(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (sessao === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    )
  }

  if (!sessao) {
    return <Login />
  }

  return (
    <BrowserRouter basename="/glicoapp">
      <div className="bg-gray-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/registrar" element={<RegistrarGlicemia />} />
          <Route path="/registrar-insulina" element={<RegistrarInsulina />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/grafico" element={<Grafico />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <NavBar />
      </div>
    </BrowserRouter>
  )
}
