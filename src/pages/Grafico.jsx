import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from 'recharts'
import { supabase } from '../lib/supabase'

const FILTROS = [
  { label: '7 dias', dias: 7 },
  { label: '30 dias', dias: 30 },
]

function formatarDia(dataHora) {
  return new Date(dataHora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function corPonto(valor) {
  if (valor < 70) return '#ef4444'
  if (valor <= 99) return '#22c55e'
  if (valor <= 125) return '#eab308'
  return '#f97316'
}

function PontoCustom(props) {
  const { cx, cy, payload } = props
  return <circle cx={cx} cy={cy} r={5} fill={corPonto(payload.glicemia)} stroke="white" strokeWidth={2} />
}

export default function Grafico() {
  const [dados, setDados] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [filtro, setFiltro] = useState(7)

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      const desde = new Date()
      desde.setDate(desde.getDate() - filtro)
      const { data } = await supabase
        .from('medicoes')
        .select('data_hora, glicemia, momento')
        .gte('data_hora', desde.toISOString())
        .order('data_hora', { ascending: true })
      setDados(
        (data || []).map((m) => ({
          ...m,
          dia: formatarDia(m.data_hora),
        }))
      )
      setCarregando(false)
    }
    carregar()
  }, [filtro])

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Gráfico de Glicemia</h1>

      <div className="flex gap-2 mb-5">
        {FILTROS.map(({ label, dias }) => (
          <button
            key={dias}
            onClick={() => setFiltro(dias)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filtro === dias ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {carregando ? (
        <p className="text-gray-400 text-center py-10">Carregando...</p>
      ) : dados.length < 2 ? (
        <p className="text-gray-400 text-center py-10">
          Registre pelo menos 2 medições para ver o gráfico.
        </p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dados} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} unit=" mg/dL" width={75} />
              <Tooltip
                formatter={(v) => [`${v} mg/dL`, 'Glicemia']}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Hipo', fontSize: 10, fill: '#ef4444' }} />
              <ReferenceLine y={126} stroke="#f97316" strokeDasharray="4 4" label={{ value: 'Alto', fontSize: 10, fill: '#f97316' }} />
              <Line
                type="monotone"
                dataKey="glicemia"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={<PontoCustom />}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Hipoglicemia (&lt;70)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Normal (70–99)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" /> Atenção (100–125)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block" /> Alto (&gt;125)</span>
          </div>
        </div>
      )}
    </div>
  )
}
