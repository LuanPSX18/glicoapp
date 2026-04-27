import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { MOMENTOS, classificarGlicemia } from '../lib/glicemia'

export default function RegistrarGlicemia() {
  const navigate = useNavigate()
  const [glicemia, setGlicemia] = useState('')
  const [momento, setMomento] = useState('jejum')
  const [observacao, setObservacao] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  const preview = glicemia ? classificarGlicemia(Number(glicemia), momento) : null

  async function salvar(e) {
    e.preventDefault()
    const valor = Number(glicemia)
    if (valor < 20 || valor > 600) {
      setErro('Valor fora do intervalo válido (20–600 mg/dL).')
      return
    }
    setSalvando(true)
    setErro('')
    const { error } = await supabase.from('medicoes').insert({
      glicemia: valor,
      momento,
      observacao: observacao.trim() || null,
      data_hora: new Date().toISOString(),
    })
    if (error) {
      setErro('Erro ao salvar. Tente novamente.')
      setSalvando(false)
      return
    }
    navigate('/')
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Registrar Glicemia</h1>

      <form onSubmit={salvar} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor da glicemia (mg/dL)</label>
          <input
            type="number"
            value={glicemia}
            onChange={(e) => setGlicemia(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-4 text-3xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
            min="20"
            max="600"
            required
          />
          {preview && (
            <div className={`mt-2 text-center text-sm font-semibold rounded-lg py-2 border ${preview.corClasse}`}>
              {preview.status}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Momento da medição</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(MOMENTOS).map(([valor, label]) => (
              <button
                key={valor}
                type="button"
                onClick={() => setMomento(valor)}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-colors ${
                  momento === valor
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observações (opcional)</label>
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Ex: reclamou de tontura, não almoçou bem..."
            rows={3}
          />
        </div>

        {erro && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">{erro}</p>
        )}

        <button
          type="submit"
          disabled={salvando}
          className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl text-base hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {salvando ? 'Salvando...' : 'Salvar Registro'}
        </button>
      </form>
    </div>
  )
}
