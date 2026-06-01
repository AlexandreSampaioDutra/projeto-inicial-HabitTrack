# 🌿 HabitTrack — Controle de Hábitos Diários

**Disciplina:** Programação Frontend
**Equipe:** (Seu nome aqui)

---

## 📖 Índice

1. [Proposta da Aplicação](#proposta)
2. [Tecnologias](#tecnologias)
3. [Estrutura do Projeto](#estrutura)
4. [Banco de Dados](#banco)
5. [Como Rodar](#rodar)

---

## 🎯 Proposta da Aplicação

O **HabitTrack** é uma aplicação web para controle de hábitos diários. O usuário cadastra hábitos que deseja cultivar — como beber água, ler, exercitar-se — e marca diariamente quais realizou.

### Problema Identificado

- Pessoas abandonam hábitos por falta de acompanhamento visual
- Sem registro, é difícil perceber consistência ou recaídas
- Ferramentas existentes são complexas demais para uso simples

### Solução

✅ Marcar hábito como feito com um clique  
✅ Grade visual dos últimos 7 dias por hábito  
✅ Contador de dias seguidos (streak) automático  
✅ Login seguro com e-mail e senha  
✅ Dados isolados por usuário (RLS no banco)

---

## 🏗️ Tecnologias

| Categoria | Tecnologia |
|-----------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Estilização | Tailwind CSS + ShadCN UI |
| Backend/Auth | Supabase (BaaS) |
| Banco de Dados | Supabase (PostgreSQL) |
| Hospedagem | Vercel |

---

## 📁 Estrutura do Projeto

```
habittrack/
├── src/
│   ├── components/
│   │   ├── shared/
│   │   │   ├── HabitCard.tsx      # Card do hábito com grade semanal
│   │   │   ├── HabitModal.tsx     # Modal criar/editar hábito
│   │   │   └── Toaster.tsx        # Notificações
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── dialog.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx        # Autenticação Supabase
│   ├── hooks/
│   │   ├── useHabits.ts           # Lógica principal dos hábitos
│   │   └── useToast.ts            # Notificações
│   ├── lib/
│   │   ├── supabase.ts            # Cliente Supabase
│   │   └── utils.ts               # Funções utilitárias
│   ├── pages/
│   │   ├── Login.tsx              # Tela de login/cadastro
│   │   └── Dashboard.tsx          # Tela principal
│   └── types/
│       └── index.ts               # Tipos TypeScript
├── .env                           # Variáveis de ambiente (não sobe no git)
├── vercel.json
└── index.html
```

---

## 💾 Banco de Dados

### Tabela: habits
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID PK | Identificador único |
| user_id | UUID FK | Dono do hábito |
| name | VARCHAR(100) | Nome do hábito |
| emoji | VARCHAR(10) | Emoji visual |
| created_at | TIMESTAMP | Data de criação |

### Tabela: habit_logs
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID PK | Identificador único |
| habit_id | UUID FK | Hábito registrado |
| user_id | UUID FK | Usuário (para RLS) |
| date | DATE | Data de conclusão |

---

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+
- Conta no Supabase

### Passo a Passo

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/habittrack.git
cd habittrack

# 2. Instalar dependências
npm install

# 3. Criar o arquivo .env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon

# 4. Rodar em desenvolvimento
npm run dev
```

Acesse: http://localhost:5173 ou https://projeto-inicial-habit-track-1xvy.vercel.app/
