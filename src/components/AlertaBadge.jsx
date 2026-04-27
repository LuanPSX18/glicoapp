import { classificarGlicemia } from '../lib/glicemia'

export default function AlertaBadge({ valor, momento }) {
  const { status, corClasse } = classificarGlicemia(valor, momento)
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full border text-xs font-semibold ${corClasse}`}>
      {status}
    </span>
  )
}
