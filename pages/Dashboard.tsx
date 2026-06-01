import { useState } from 'react'
import { Plus, LogOut, CheckCircle2, BarChart2, List } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useHabits } from '@/hooks/useHabits'
import { useToast } from '@/hooks/useToast'
import { HabitCard } from '@/components/shared/HabitCard'
import { HabitModal } from '@/components/shared/HabitModal'
import { NoteModal } from '@/components/shared/NoteModal'
import { StatsPanel } from '@/components/shared/StatsPanel'
import { Toaster } from '@/components/shared/Toaster'
import { Button } from '@/components/ui/button'
import { HabitWithLogs } from '@/types'
import { cn } from '@/lib/utils'

type Tab = 'habits' | 'stats'

export function Dashboard() {
  const { user, signOut } = useAuth()
  const { habits, loading, addHabit, updateHabit, deleteHabit, toggleHabit, incrementHabit, decrementHabit, saveNote } = useHabits()
  const { toasts, toast } = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [editing, setEditing] = useState<HabitWithLogs | null>(null)
  const [noteTarget, setNoteTarget] = useState<HabitWithLogs | null>(null)
  const [tab, setTab] = useState<Tab>('habits')

  const doneTodayCount = habits.filter(h => h.doneToday).length
  const allDone = habits.length > 0 && doneTodayCount === habits.length

  const handleSave = async (name: string, emoji: string, goal: number, unit: string) => {
    if (editing) {
      await updateHabit(editing.id, name, emoji, goal, unit)
      toast('Hábito atualizado!')
    } else {
      await addHabit(name, emoji, goal, unit)
      toast('Hábito criado!')
    }
    setEditing(null)
  }

  const handleEdit = (habit: HabitWithLogs) => {
    setEditing(habit)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este hábito?')) return
    await deleteHabit(id)
    toast('Hábito excluído.')
  }

  const handleToggle = async (id: string, doneToday: boolean) => {
    await toggleHabit(id, doneToday)
    if (!doneToday) toast('Hábito concluído! 🎉')
  }

  const handleIncrement = async (id: string) => {
    await incrementHabit(id)
    const habit = habits.find(h => h.id === id)
    if (habit && habit.countToday + 1 >= habit.goal) toast(`${habit.emoji} Meta atingida! 🎉`)
  }

  const handleDecrement = async (id: string) => {
    await decrementHabit(id)
  }

  const handleNote = (habit: HabitWithLogs) => {
    setNoteTarget(habit)
    setNoteModalOpen(true)
  }

  const handleSaveNote = async (habitId: string, note: string) => {
    await saveNote(habitId, note)
    toast('Anotação salva!')
  }

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-[#1B4332] text-white px-4 py-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold">HabitTrack</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-200 hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={signOut} className="text-white hover:bg-white/20">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Resumo do dia */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
          <p className="text-sm text-gray-500 capitalize">{today}</p>
          <div className="flex items-center justify-between mt-1">
            <h2 className="text-xl font-bold text-[#1B4332]">Seus hábitos de hoje</h2>
            <div className="flex items-center gap-1.5 bg-[#D8F3DC] text-[#1B4332] px-3 py-1 rounded-full text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              {doneTodayCount}/{habits.length}
            </div>
          </div>

          {/* Barra geral do dia */}
          {habits.length > 0 && (
            <div className="mt-3">
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#52B788] rounded-full transition-all duration-500"
                  style={{ width: `${(doneTodayCount / habits.length) * 100}%` }}
                />
              </div>
              {allDone && (
                <p className="text-[#52B788] text-sm mt-2 font-medium">🎉 Parabéns! Todos os hábitos concluídos!</p>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        {habits.length > 0 && (
          <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-4 shadow-sm">
            <button
              onClick={() => setTab('habits')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all',
                tab === 'habits'
                  ? 'bg-[#1B4332] text-white'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <List className="w-4 h-4" /> Hábitos
            </button>
            <button
              onClick={() => setTab('stats')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all',
                tab === 'stats'
                  ? 'bg-[#1B4332] text-white'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <BarChart2 className="w-4 h-4" /> Estatísticas
            </button>
          </div>
        )}

        {/* Conteúdo */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border-2 border-gray-100 p-4 h-32 animate-pulse" />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🌱</div>
            <p className="font-medium text-lg text-gray-500">Nenhum hábito ainda</p>
            <p className="text-sm mt-1">Clique no botão abaixo para começar!</p>
          </div>
        ) : tab === 'habits' ? (
          <div className="space-y-3">
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={handleToggle}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onNote={handleNote}
              />
            ))}
          </div>
        ) : (
          <StatsPanel habits={habits} />
        )}

        {/* Botão adicionar */}
        <Button
          className="w-full mt-6"
          size="lg"
          onClick={() => { setEditing(null); setModalOpen(true) }}
        >
          <Plus className="w-5 h-5" /> Adicionar hábito
        </Button>
      </main>

      <HabitModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSave={handleSave}
        editing={editing}
      />

      <NoteModal
        open={noteModalOpen}
        onClose={() => { setNoteModalOpen(false); setNoteTarget(null) }}
        onSave={handleSaveNote}
        habit={noteTarget}
      />

      <Toaster toasts={toasts} />
    </div>
  )
}
