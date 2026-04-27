# GlicoApp — Documento de Definição do Projeto

> Versão 1.0 — 26/04/2026  
> Entrevista realizada com o responsável pelo desenvolvimento

---

## 1. Visão Geral

Aplicativo web para **acompanhamento de glicemia** de uma paciente com diabetes, permitindo que cuidadores registrem medições diárias e acompanhem o histórico e tendências, com acesso remoto para familiares que não estão presentes no mesmo local.

O objetivo principal é substituir apps pagos por uma solução gratuita, personalizada para as necessidades específicas desta família.

---

## 2. Usuários e Papéis

### Paciente
- **Nome**: Avó (não identificada no documento por privacidade)
- **Idade**: 65 anos
- **Condição**: Diabetes (tipo a confirmar com o médico)
- **Rotina de medicação**: Insulina 1x por dia
- **Medição**: Glicosímetro de ponta de dedo (entrada manual de dados)
- **Relação com tecnologia**: Não usa o app diretamente (não sabe ler)

### Cuidadores / Usuários do App
| Papel | Quem | O que faz no app |
|---|---|---|
| Cuidador principal | Mãe ou tio (quem estiver presente) | Registra glicemia, insulina e observações |
| Observador remoto | Quem não está em casa | Visualiza histórico e gráficos em tempo real |

**Login**: acesso único compartilhado entre mãe e tio (sem contas separadas).

---

## 3. Funcionalidades

### 3.1 Registro de Dados (Cuidador)
- Registrar leitura de glicemia (mg/dL) com data e hora
- Indicar momento da medição: em jejum / antes das refeições / após refeições / antes de dormir
- Registrar aplicação de insulina (dose e horário)
- Campo de observações livres (ex: "reclamou de tontura", "não almoçou bem")

### 3.2 Acompanhamento (Cuidador e Observador)
- Visualizar registros do dia atual
- Histórico completo com filtro por período
- Gráfico de linha mostrando variação da glicemia ao longo dos dias/semanas
- Indicação visual de alertas: valores fora da faixa saudável destacados em vermelho (hipoglicemia) ou laranja (hiperglicemia)

### 3.3 Alertas (In-App)
- Destaque visual automático quando o valor registrado estiver fora da faixa:
  - Abaixo de 70 mg/dL → **Hipoglicemia** (perigo imediato, cor vermelha)
  - 70–99 mg/dL em jejum → **Normal**
  - 100–125 mg/dL em jejum → **Pré-diabetes / atenção** (cor amarela)
  - Acima de 126 mg/dL em jejum → **Diabetes / hiperglicemia** (cor laranja/vermelha)
  - Acima de 180 mg/dL após refeição → **Hiperglicemia** (cor vermelha)

> **Nota**: Esses valores são referências gerais. O ideal é ajustar as metas conforme orientação do médico da paciente.

### 3.4 Funcionalidades Futuras (Backlog)
- Relatório em PDF para consultas médicas
- Notificações fora do app (push, email ou WhatsApp)
- Registro de refeições e carboidratos
- Registro de pressão arterial
- Contas separadas por usuário

---

## 4. Requisitos Não-Funcionais

- **Responsivo**: funciona em celular, tablet e desktop
- **Simples**: interface clara, sem excesso de menus ou informações
- **Gratuito**: sem custos de assinatura ou infraestrutura (dentro dos limites das plataformas gratuitas)
- **Privado**: dados sensíveis de saúde armazenados de forma segura

---

## 5. Stack Tecnológica

### Frontend — React + Vite
**Por quê?**  
React é o framework JavaScript mais usado no mundo, com enorme comunidade e documentação. O Vite é a ferramenta de build moderna e rápida que complementa o React. Juntos, produzem um app que roda direto no navegador (sem servidor próprio), o que é essencial para funcionar no GitHub Pages.

### Estilização — Tailwind CSS
**Por quê?**  
Tailwind facilita criar interfaces responsivas (que se adaptam ao celular e ao desktop) com muito menos código. Ele tem um sistema de cores e tamanhos consistente que vai deixar o app com visual limpo sem esforço excessivo.

### Gráficos — Recharts
**Por quê?**  
É uma biblioteca de gráficos feita especificamente para React, simples de usar e com ótimo visual para gráficos de linha — perfeito para mostrar a evolução da glicemia.

### Backend / Banco de Dados — Supabase
**Por quê?**  
O usuário já tem conta. O Supabase oferece banco de dados PostgreSQL (robusto e gratuito até limites generosos), autenticação de usuários e atualização em tempo real — tudo que o app precisa, sem precisar programar um servidor. O plano gratuito suporta tranquilamente um uso familiar como este.

### Hospedagem — GitHub Pages
**Por quê?**  
Gratuito, integrado ao GitHub (onde o código ficará armazenado), e simples de configurar. Ideal para apps estáticos como este.

---

## 6. Arquitetura Resumida

```
[Celular / Computador]
        |
   [React App]  ←→  [Supabase]
   (GitHub Pages)    - Banco de dados (registros de glicemia, insulina)
                     - Autenticação (login único)
                     - Tempo real (observador vê atualizações sem precisar recarregar)
```

---

## 7. Modelo de Dados (Inicial)

### Tabela: `medicoes`
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | Identificador único |
| data_hora | timestamp | Data e hora da medição |
| glicemia | integer | Valor em mg/dL |
| momento | enum | jejum / pre_refeicao / pos_refeicao / antes_dormir |
| observacao | text | Texto livre opcional |
| criado_em | timestamp | Quando o registro foi criado |

### Tabela: `insulina`
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | Identificador único |
| data_hora | timestamp | Data e hora da aplicação |
| dose_unidades | integer | Quantidade em unidades |
| observacao | text | Texto livre opcional |

---

## 8. Próximos Passos

1. Configurar projeto no GitHub (repositório)
2. Criar projeto no Supabase e configurar as tabelas
3. Inicializar projeto React + Vite localmente
4. Implementar tela de login
5. Implementar tela de registro de glicemia
6. Implementar histórico e gráficos
7. Fazer deploy no GitHub Pages

---

## 9. Informações a Confirmar

- [ ] Tipo exato de diabetes da paciente (tipo 1 ou tipo 2) — perguntar ao médico
- [ ] Metas de glicemia personalizadas definidas pelo médico
- [ ] Dose exata de insulina (para validação de entrada no app)
- [ ] Nome do app (a definir)
