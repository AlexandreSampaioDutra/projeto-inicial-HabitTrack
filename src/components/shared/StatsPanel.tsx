import { HabitWithLogs } from '@/types'
import { formatDate } from '@/lib/utils'
import { Flame, Trophy, TrendingUp, Target } from 'lucide-react'

interface Props {
  habits: HabitWithLogs[]
}

export function StatsPanel({ habits }: Props) {
  if (habits.length === 0) return null

  const today = formatDate(new Date())

  // Total de dias únicos com pelo menos 1 hábito feito
  const allDates = new Set(
    habits.flatMap(h => h.logs.filter(l => l.count >= h.goal).map(l => l.date))
  )

  // Melhor streak entre todos
  const bestStreak = Math.max(...habits.map(h => h.streak), 0)

  // Hábito mais consistente (maior % de conclusão nos últimos 30 dias)
  const last30: string[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    last30.push(formatDate(d))
  }

  const consistency = habits.map(h => {
    const done = last30.filter(date => {
      const log = h.logs.find(l => l.date === date)
      return log && log.count >= h.goal
    }).length
    return { name: h.name, emoji: h.emoji, pct: Math.round((done / 30) * 100) }
  }).sort((a, b) => b.pct - a.pct)

  const topHabit = consistency[0]

  // Concluídos hoje
  const doneToday = habits.filter(h => h.doneToday).length

  const stats = [
    {
      icon: <Target className="w-5 h-5 text-[#52B788]" />,
      label: 'Hoje',
      value: `${doneToday}/${habits.length}`,
      sub: 'hábitos concluídos'
    },
    {
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      label: 'Melhor sequência',
      value: `${bestStreak}`,
      sub: bestStreak === 1 ? 'dia seguido' : 'dias seguidos'
    },
    {
      icon: <Trophy className="w-5 h-5 text-yellow-500" />,
      label: 'Mais consistente',
      value: topHabit ? `${topHabit.emoji} ${topHabit.pct}%` : '—',
      sub: topHabit?.name ?? ''
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
      label: 'Dias ativos',
      value: `${allDates.size}`,
      sub: 'nos últimos 30 dias'
    },
  ]

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Estatísticas</h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
            <div className="flex items-center gap-2 mb-1">
              {s.icon}
              <span className="text-xs text-gray-500">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-[#1B4332]">{s.value}</p>
            <p className="text-xs text-gray-400 truncate">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Barra de consistência dos hábitos */}
      {consistency.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 mt-3">
          <p className="text-xs text-gray-500 mb-2 font-medium">Consistência — últimos 30 dias</p>
          <div className="space-y-2">
            {consistency.map(h => (
              <div key={h.name}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-gray-600">{h.emoji} {h.name}</span>
                  <span className="font-medium text-[#1B4332]">{h.pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#52B788] rounded-full transition-all duration-700"
                    style={{ width: `${h.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
