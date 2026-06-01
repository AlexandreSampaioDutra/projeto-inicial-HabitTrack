export interface Habit {
  id: string
  user_id: string
  name: string
  emoji: string
  goal: number        // meta diária (ex: 8 copos de água)
  unit: string        // unidade (ex: "copos", "minutos", "páginas")
  created_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  date: string
  count: number       // quantas vezes foi feito naquele dia
  note: string | null // anotação do dia
}

export interface HabitWithLogs extends Habit {
  logs: HabitLog[]
  streak: number
  doneToday: boolean
  countToday: number
  noteToday: string | null
}

export interface User {
  id: string
  email: string
}
