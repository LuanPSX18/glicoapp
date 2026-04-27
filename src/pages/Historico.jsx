import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import AlertaBadge from '../components/AlertaBadge'
import { MOMENTOS } from '../lib/glicemia'

function formatarDataHora(dataHora) {
  return new Date(dataHora).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}

const FILTROS = [
  { label: '7 dias', dias: 7 },
  { label: '30 dias', dias: 30 },
  { label: '90 dias', dias: 90 },
]

export default function Historico() {
  const [medicoes, setMedicoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [filtro, setFiltro] = useState(7)

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      const desde = new Date()
      desde.setDate(desde.getDate() - filtro)
      const { data } = await supabase
        .from('medicoes')
        .select('*')
        .gte('data_hora', desde.toISOString())
        .order('data_hora', { ascending: false })
      setMedicoes(data || [])
      setCarregando(false)
    }
    carregar()
  }, [filtro])

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Histórico</h1>

      <div className="flex gap-2 mb-5">
        {FILTROS.map(({ label, dias }) => (
          <button
            key={dias}
            onClick={() => setFiltro(dias)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filtro === dias
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {carregando ? (
        <p className="text-gray-400 text-center py-10">Carregando...</p>
      ) : medicoes.length === 0 ? (
        <p className="text-gray-400 text-center py-10">Nenhum registro encontrado.</p>
      ) : (
        <div className="space-y-3">
          {medicoes.map((m) => (
            <div key={m.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-800">{m.glicemia} mg/dL</span>
                  <AlertaBadge valor={m.glicemia} momento={m.momento} />
                </div>
                <span className="text-xs text-gray-400">{formatarDataHora(m.data_hora)}</span>
              </div>
              <p className="text-xs text-gray-500">{MOMENTOS[m.momento]}</p>
              {m.observacao && (
                <p className="text-sm text-gray-600 mt-1 italic">"{m.observacao}"</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
