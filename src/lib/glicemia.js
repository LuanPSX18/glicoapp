export function classificarGlicemia(valor, momento) {
  if (valor < 70) {
    return { status: 'Hipoglicemia', cor: 'vermelho', corClasse: 'bg-red-100 text-red-800 border-red-300' }
  }
  if (momento === 'jejum') {
    if (valor <= 99) return { status: 'Normal', cor: 'verde', corClasse: 'bg-green-100 text-green-800 border-green-300' }
    if (valor <= 125) return { status: 'Atenção', cor: 'amarelo', corClasse: 'bg-yellow-100 text-yellow-800 border-yellow-300' }
    return { status: 'Hiperglicemia', cor: 'laranja', corClasse: 'bg-orange-100 text-orange-800 border-orange-300' }
  }
  if (momento === 'pos_refeicao' && valor > 180) {
    return { status: 'Hiperglicemia', cor: 'vermelho', corClasse: 'bg-red-100 text-red-800 border-red-300' }
  }
  if (valor <= 140) {
    return { status: 'Normal', cor: 'verde', corClasse: 'bg-green-100 text-green-800 border-green-300' }
  }
  return { status: 'Atenção', cor: 'amarelo', corClasse: 'bg-yellow-100 text-yellow-800 border-yellow-300' }
}

export const MOMENTOS = {
  jejum: 'Em jejum',
  pre_refeicao: 'Antes das refeições',
  pos_refeicao: 'Após as refeições',
  antes_dormir: 'Antes de dormir',
}
