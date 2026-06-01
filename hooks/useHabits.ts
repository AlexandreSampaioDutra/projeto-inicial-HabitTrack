import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { HabitWithLogs, HabitLog } from '@/types'
import { formatDate } from '@/lib/utils'

export function useHabits() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<HabitWithLogs[]>([])
  const [loading, setLoading] = useState(true)

  const loadHabits = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const today = formatDate(new Date())
    const thirtyDaysAgo = formatDate(new Date(Date.now() - 29 * 86400000))

    const { data: habitsData } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    const { data: logsData } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', thirtyDaysAgo)

    const result: HabitWithLogs[] = (habitsData ?? []).map(habit => {
      const logs: HabitLog[] = (logsData ?? []).filter(l => l.habit_id === habit.id)
      const todayLog = logs.find(l => l.date === today)
      const doneToday = todayLog ? todayLog.count >= (habit.goal ?? 1) : false
      const countToday = todayLog?.count ?? 0
      const noteToday = todayLog?.note ?? null

      // calcular streak
      let streak = 0
      const checkDate = new Date()
      if (!doneToday) checkDate.setDate(checkDate.getDate() - 1)
      while (true) {
        const dateStr = formatDate(checkDate)
        const log = logs.find(l => l.date === dateStr)
        if (log && log.count >= (habit.goal ?? 1)) {
          streak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          break
        }
      }

      return { ...habit, logs, streak, doneToday, countToday, noteToday }
    })

    setHabits(result)
    setLoading(false)
  }, [user])

  useEffect(() => { loadHabits() }, [loadHabits])

  const addHabit = async (name: string, emoji: string, goal: number, unit: string) => {
    if (!user) return
    await supabase.from('habits').insert({ name, emoji, goal, unit, user_id: user.id })
    await loadHabits()
  }

  const updateHabit = async (id: string, name: string, emoji: string, goal: number, unit: string) => {
    await supabase.from('habits').update({ name, emoji, goal, unit }).eq('id', id)
    await loadHabits()
  }

  const deleteHabit = async (id: string) => {
    await supabase.from('habits').delete().eq('id', id)
    await loadHabits()
  }

  // Incrementa +1 no count do dia (ou cria o log)
  const incrementHabit = async (habitId: string) => {
    if (!user) return
    const today = formatDate(new Date())
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return
    const existing = habit.logs.find(l => l.date === today)
    if (existing) {
      await supabase.from('habit_logs')
        .update({ count: existing.count + 1 })
        .eq('id', existing.id)
    } else {
      await supabase.from('habit_logs')
        .insert({ habit_id: habitId, user_id: user.id, date: today, count: 1, note: null })
    }
    await loadHabits()
  }

  // Decrementa -1 (não vai abaixo de 0)
  const decrementHabit = async (habitId: string) => {
    if (!user) return
    const today = formatDate(new Date())
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return
    const existing = habit.logs.find(l => l.date === today)
    if (!existing || existing.count <= 0) return
    if (existing.count === 1) {
      await supabase.from('habit_logs').delete().eq('id', existing.id)
    } else {
      await supabase.from('habit_logs')
        .update({ count: existing.count - 1 })
        .eq('id', existing.id)
    }
    await loadHabits()
  }

  // Toggle simples (para hábitos com goal = 1)
  const toggleHabit = async (habitId: string, doneToday: boolean) => {
    if (!user) return
    const today = formatDate(new Date())
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return
    const existing = habit.logs.find(l => l.date === today)
    if (doneToday) {
      if (existing) await supabase.from('habit_logs').delete().eq('id', existing.id)
    } else {
      if (existing) {
        await supabase.from('habit_logs').update({ count: habit.goal }).eq('id', existing.id)
      } else {
        await supabase.from('habit_logs')
          .insert({ habit_id: habitId, user_id: user.id, date: today, count: habit.goal, note: null })
      }
    }
    await loadHabits()
  }

  // Salva anotação do dia
  const saveNote = async (habitId: string, note: string) => {
    if (!user) return
    const today = formatDate(new Date())
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return
    const existing = habit.logs.find(l => l.date === today)
    if (existing) {
      await supabase.from('habit_logs').update({ note }).eq('id', existing.id)
    } else {
      await supabase.from('habit_logs')
        .insert({ habit_id: habitId, user_id: user.id, date: today, count: 0, note })
    }
    await loadHabits()
  }

  return { habits, loading, addHabit, updateHabit, deleteHabit, toggleHabit, incrementHabit, decrementHabit, saveNote, reload: loadHabits }
}
