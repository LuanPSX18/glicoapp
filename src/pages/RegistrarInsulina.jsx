import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function RegistrarInsulina() {
  const navigate = useNavigate()
  const [dose, setDose] = useState('')
  const [observacao, setObservacao] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function salvar(e) {
    e.preventDefault()
    const valor = Number(dose)
    if (valor < 1 || valor > 100) {
      setErro('Dose inválida. Use um valor entre 1 e 100 unidades.')
      return
    }
    setSalvando(true)
    setErro('')
    const { error } = await supabase.from('insulina').insert({
      dose_unidades: valor,
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
      <h1 className="text-xl font-bold text-gray-800 mb-6">Registrar Insulina</h1>

      <form onSubmit={salvar} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dose aplicada (unidades)</label>
          <input
            type="number"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-4 text-3xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="0"
            min="1"
            max="100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observações (opcional)</label>
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Ex: aplicada no braço esquerdo..."
            rows={3}
          />
        </div>

        {erro && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">{erro}</p>
        )}

        <button
          type="submit"
          disabled={salvando}
          className="w-full bg-purple-600 text-white font-semibold py-4 rounded-xl text-base hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {salvando ? 'Salvando...' : 'Salvar Registro'}
        </button>
      </form>
    </div>
  )
}
