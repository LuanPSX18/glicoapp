import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AlertaBadge from '../components/AlertaBadge'
import { MOMENTOS } from '../lib/glicemia'

function formatarHora(dataHora) {
  return new Date(dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export default function Dashboard() {
  const [ultimaMedicao, setUltimaMedicao] = useState(null)
  const [ultimaInsulina, setUltimaInsulina] = useState(null)
  const [medicoesHoje, setMedicoesHoje] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)

      const [{ data: medicoes }, { data: insulinas }] = await Promise.all([
        supabase
          .from('medicoes')
          .select('*')
          .gte('data_hora', hoje.toISOString())
          .order('data_hora', { ascending: false }),
        supabase
          .from('insulina')
          .select('*')
          .gte('data_hora', hoje.toISOString())
          .order('data_hora', { ascending: false })
          .limit(1),
      ])

      setMedicoesHoje(medicoes || [])
      setUltimaMedicao(medicoes?.[0] || null)
      setUltimaInsulina(insulinas?.[0] || null)
      setCarregando(false)
    }
    carregar()
  }, [])

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      <h1 className="text-xl font-bold text-gray-800 mb-1">Bom dia! 👋</h1>
      <p className="text-gray-500 text-sm mb-6">
        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>

      {/* Última medição */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Última glicemia</p>
        {ultimaMedicao ? (
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-gray-800">{ultimaMedicao.glicemia}</span>
              <span className="text-gray-500">mg/dL</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <AlertaBadge valor={ultimaMedicao.glicemia} momento={ultimaMedicao.momento} />
              <span className="text-xs text-gray-400">
                {MOMENTOS[ultimaMedicao.momento]} · {formatarHora(ultimaMedicao.data_hora)}
              </span>
            </div>
            {ultimaMedicao.observacao && (
              <p className="text-sm text-gray-600 mt-2 italic">"{ultimaMedicao.observacao}"</p>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Nenhuma medição registrada hoje.</p>
        )}
      </div>

      {/* Última insulina */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Última insulina</p>
        {ultimaInsulina ? (
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-purple-700">{ultimaInsulina.dose_unidades}</span>
            <span className="text-gray-500">unidades · {formatarHora(ultimaInsulina.data_hora)}</span>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Nenhuma insulina registrada hoje.</p>
        )}
      </div>

      {/* Medições do dia */}
      {medicoesHoje.length > 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Medições de hoje</p>
          <div className="space-y-3">
            {medicoesHoje.map((m) => (
              <div key={m.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-800">{m.glicemia} mg/dL</span>
                  <AlertaBadge valor={m.glicemia} momento={m.momento} />
                </div>
                <span className="text-xs text-gray-400">{formatarHora(m.data_hora)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botões de ação */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Link
          to="/registrar"
          className="bg-blue-600 text-white rounded-xl py-4 text-center font-semibold hover:bg-blue-700 transition-colors"
        >
          💉 Registrar Glicemia
        </Link>
        <Link
          to="/registrar-insulina"
          className="bg-purple-600 text-white rounded-xl py-4 text-center font-semibold hover:bg-purple-700 transition-colors"
        >
          🩺 Registrar Insulina
        </Link>
      </div>
    </div>
  )
}
