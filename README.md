# 🌿 HabitTrack — Controle de Hábitos Diários

**Disciplina:** Programação Frontend
**Aluno:** AlexandreSampaioDutra

---

## 📖 Índice

1. [Proposta da Aplicação](#-proposta-da-aplicação)
2. [Tecnologias](#-tecnologias)
3. [Funcionalidades](#-funcionalidades)
4. [Estrutura do Projeto](#-estrutura-do-projeto)
5. [Banco de Dados](#-banco-de-dados)
6. [Como Rodar](#-como-rodar)
7. [Screenshots](#-screenshots)

---

## 🎯 Proposta da Aplicação

O **HabitTrack** é uma aplicação web para controle de hábitos diários. O usuário cadastra hábitos que deseja cultivar — como beber água, ler, exercitar-se — e marca diariamente quais realizou.

### Problema Identificado

Pessoas frequentemente abandonam bons hábitos por falta de acompanhamento visual e feedback de progresso. Sem um registro claro, é difícil perceber consistência ou identificar recaídas. As ferramentas existentes no mercado tendem a ser complexas demais para um uso simples e cotidiano.

### Solução Proposta

O HabitTrack resolve isso com uma interface minimalista e eficiente:

- ✅ Marcar hábito como concluído com um clique
- 📅 Grade visual dos últimos 7 dias por hábito
- 🔥 Contador de dias seguidos (streak) calculado automaticamente
- 🔒 Login seguro com e-mail e senha via Supabase Auth
- 🛡️ Dados isolados por usuário com Row Level Security (RLS)

---

## 🏗️ Tecnologias

| Categoria | Tecnologia |
|-----------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Estilização | Tailwind CSS + ShadCN UI |
| Backend / Auth | Supabase (BaaS) |
| Banco de Dados | PostgreSQL (via Supabase) |
| Hospedagem | Vercel |

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|----------------|-----------|
| Cadastro / Login | Autenticação segura com e-mail e senha |
| Criar hábito | Nome personalizado + emoji representativo |
| Marcar como feito | Registro do hábito com data e hora |
| Grade semanal | Visualização dos últimos 7 dias por hábito |
| Streak automático | Contador de sequência de dias consecutivos |
| Isolamento de dados | Cada usuário vê apenas os seus próprios hábitos (RLS) |

---

## 📁 Estrutura do Projeto

```
habittrack/
├── src/
│   ├── components/
│   │   ├── shared/
│   │   │   ├── HabitCard.tsx      # Card do hábito com grade semanal
│   │   │   ├── HabitModal.tsx     # Modal para criar/editar hábito
│   │   │   └── Toaster.tsx        # Notificações toast
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── dialog.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx        # Contexto de autenticação Supabase
│   ├── hooks/
│   │   ├── useHabits.ts           # Lógica principal dos hábitos
│   │   └── useToast.ts            # Gerenciamento de notificações
│   ├── lib/
│   │   ├── supabase.ts            # Configuração do cliente Supabase
│   │   └── utils.ts               # Funções utilitárias
│   ├── pages/
│   │   ├── Login.tsx              # Tela de login e cadastro
│   │   └── Dashboard.tsx          # Tela principal do usuário
│   └── types/
│       └── index.ts               # Tipagens TypeScript
├── .env                           # Variáveis de ambiente (não versionado)
├── vercel.json                    # Configuração de deploy
└── index.html
```

---

## 💾 Banco de Dados

O banco é gerenciado pelo **Supabase** (PostgreSQL) com Row Level Security habilitado para garantir o isolamento dos dados por usuário.

### Tabela: `habits`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | `UUID` PK | Identificador único do hábito |
| user_id | `UUID` FK | Referência ao usuário dono |
| name | `VARCHAR(100)` | Nome do hábito |
| emoji | `VARCHAR(10)` | Emoji visual representativo |
| created_at | `TIMESTAMP` | Data de criação |

### Tabela: `habit_logs`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | `UUID` PK | Identificador único do registro |
| habit_id | `UUID` FK | Referência ao hábito |
| user_id | `UUID` FK | Usuário (necessário para RLS) |
| date | `DATE` | Data de conclusão |

### Relacionamento

```
users (Supabase Auth)
  └── habits (1:N)
        └── habit_logs (1:N)
```

---

## 🚀 Como Rodar

### Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- Conta no [Supabase](https://supabase.com/) (gratuito)

### Passo a Passo

```bash
# 1. Clonar o repositório
git clone https://github.com/AlexandreSampaioDutra/habittrack.git
cd habittrack

# 2. Instalar as dependências
npm install

# 3. Configurar as variáveis de ambiente
# Crie um arquivo .env na raiz do projeto com o conteúdo abaixo:
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon

# 4. Rodar em modo de desenvolvimento
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

## 👤 Autor

**AlexandreSampaioDutra** — [@AlexandreSampaioDutra](https://github.com/AlexandreSampaioDutra)
