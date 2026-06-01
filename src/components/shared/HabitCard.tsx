import { useState } from 'react'
import { Pencil, Trash2, Flame, Plus, Minus, StickyNote, ChevronDown, ChevronUp } from 'lucide-react'
import { HabitWithLogs } from '@/types'
import { getLast7Days, getDayLabel, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  habit: HabitWithLogs
  onToggle: (id: string, doneToday: boolean) => void
  onIncrement: (id: string) => void
  onDecrement: (id: string) => void
  onEdit: (habit: HabitWithLogs) => void
  onDelete: (id: string) => void
  onNote: (habit: HabitWithLogs) => void
}

export function HabitCard({ habit, onToggle, onIncrement, onDecrement, onEdit, onDelete, onNote }: Props) {
  const [toggling, setToggling] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const last7 = getLast7Days()

  const isCountable = habit.goal > 1
  const progress = isCountable ? Math.min((habit.countToday / habit.goal) * 100, 100) : (habit.doneToday ? 100 : 0)

  const handleToggle = async () => {
    if (isCountable) return
    setToggling(true)
    await onToggle(habit.id, habit.doneToday)
    setToggling(false)
  }

  const handleIncrement = async () => {
    setToggling(true)
    await onIncrement(habit.id)
    setToggling(false)
  }

  const handleDecrement = async () => {
    setToggling(true)
    await onDecrement(habit.id)
    setToggling(false)
  }

  // Últimos 30 dias para histórico expandido
  const last30: string[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    last30.push(formatDate(d))
  }

  return (
    <div className={cn(
      'bg-white rounded-xl border-2 p-4 transition-all shadow-sm',
      habit.doneToday ? 'border-[#52B788]' : 'border-gray-200'
    )}>
      {/* Linha principal */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Botão emoji — toggle se goal=1, visual se contável */}
          <button
            onClick={isCountable ? undefined : handleToggle}
            disabled={toggling || isCountable}
            className={cn(
              'w-11 h-11 rounded-full text-2xl flex items-center justify-center transition-all border-2 select-none shrink-0',
              habit.doneToday
                ? 'bg-[#52B788] border-[#52B788] scale-105'
                : 'bg-white border-gray-300',
              !isCountable && 'hover:border-[#52B788] cursor-pointer',
              isCountable && 'cursor-default'
            )}
          >
            {habit.emoji}
          </button>

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[#1B4332] truncate">{habit.name}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {habit.streak > 0 && (
                <span className="text-xs text-orange-500 flex items-center gap-0.5">
                  <Flame className="w-3 h-3" /> {habit.streak} dia{habit.streak > 1 ? 's' : ''}
                </span>
              )}
              {isCountable && (
                <span className={cn(
                  'text-xs font-medium',
                  habit.doneToday ? 'text-[#52B788]' : 'text-gray-500'
                )}>
                  {habit.countToday}/{habit.goal} {habit.unit}
                </span>
              )}
              {habit.noteToday && (
                <span className="text-xs text-blue-400 flex items-center gap-0.5">
                  <StickyNote className="w-3 h-3" /> nota
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-1 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => onNote(habit)} title="Anotação do dia">
            <StickyNote className={cn('w-4 h-4', habit.noteToday ? 'text-blue-400' : '')} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(habit)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(habit.id)} className="hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            habit.doneToday ? 'bg-[#52B788]' : 'bg-[#95d5b2]'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controles de contagem (só aparece se goal > 1) */}
      {isCountable && (
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={handleDecrement}
            disabled={toggling || habit.countToday <= 0}
            className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-red-300 hover:text-red-500 disabled:opacity-30 transition-all"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <div className="flex gap-1 flex-1">
            {Array.from({ length: habit.goal }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'flex-1 h-5 rounded transition-colors',
                  i < habit.countToday ? 'bg-[#52B788]' : 'bg-gray-100'
                )}
              />
            ))}
          </div>

          <button
            onClick={handleIncrement}
            disabled={toggling || habit.countToday >= habit.goal}
            className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#52B788] hover:text-[#52B788] disabled:opacity-30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Grade semanal (7 dias) */}
      <div className="flex gap-1.5">
        {last7.map(date => {
          const log = habit.logs.find(l => l.date === date)
          const done = log ? log.count >= habit.goal : false
          const partial = log && !done && log.count > 0
          return (
            <div key={date} className="flex flex-col items-center gap-1 flex-1">
              <div className={cn(
                'w-full h-7 rounded-md transition-colors',
                done ? 'bg-[#52B788]' : partial ? 'bg-[#b7e4c7]' : 'bg-gray-100'
              )} />
              <span className="text-[10px] text-gray-400">{getDayLabel(date)}</span>
            </div>
          )
        })}
      </div>

      {/* Botão expandir histórico 30 dias */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full mt-2 text-xs text-gray-400 flex items-center justify-center gap-1 hover:text-gray-600 transition-colors"
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? 'Ocultar histórico' : 'Ver 30 dias'}
      </button>

      {/* Histórico 30 dias expandido */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2">Últimos 30 dias</p>
          <div className="grid grid-cols-10 gap-1">
            {last30.map(date => {
              const log = habit.logs.find(l => l.date === date)
              const done = log ? log.count >= habit.goal : false
              const partial = log && !done && log.count > 0
              const isToday = date === formatDate(new Date())
              return (
                <div
                  key={date}
                  title={date}
                  className={cn(
                    'aspect-square rounded-sm transition-colors',
                    done ? 'bg-[#52B788]' : partial ? 'bg-[#b7e4c7]' : 'bg-gray-100',
                    isToday && 'ring-2 ring-[#1B4332] ring-offset-1'
                  )}
                />
              )
            })}
          </div>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#52B788] inline-block" /> Concluído</span>
            {isCountable && <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#b7e4c7] inline-block" /> Parcial</span>}
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-gray-100 inline-block" /> Não feito</span>
          </div>
        </div>
      )}
    </div>
  )
}
