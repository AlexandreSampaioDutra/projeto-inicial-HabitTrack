import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { HabitWithLogs } from '@/types'

const EMOJIS = ['✅', '💧', '📚', '🏃', '🧘', '🍎', '😴', '💪', '🎯', '🌿', '✏️', '🎵', '🚶', '🥗', '🧹', '💊', '🫁', '🛁']

const UNIT_SUGGESTIONS = ['vez', 'copos', 'minutos', 'páginas', 'km', 'séries', 'horas']

interface Props {
  open: boolean
  onClose: () => void
  onSave: (name: string, emoji: string, goal: number, unit: string) => void
  editing?: HabitWithLogs | null
}

export function HabitModal({ open, onClose, onSave, editing }: Props) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('✅')
  const [goal, setGoal] = useState(1)
  const [unit, setUnit] = useState('vez')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editing) {
      setName(editing.name)
      setEmoji(editing.emoji)
      setGoal(editing.goal ?? 1)
      setUnit(editing.unit ?? 'vez')
    } else {
      setName('')
      setEmoji('✅')
      setGoal(1)
      setUnit('vez')
    }
  }, [editing, open])

  const handleSave = async () => {
    if (!name.trim()) return
    setLoading(true)
    await onSave(name.trim(), emoji, goal, unit)
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar hábito' : 'Novo hábito'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nome */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Nome do hábito</label>
            <Input
              placeholder="Ex: Beber água"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </div>

          {/* Emoji */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Escolha um emoji</label>
            <div className="grid grid-cols-9 gap-2">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`text-2xl h-10 w-full rounded-lg transition-all ${
                    emoji === e ? 'bg-[#D8F3DC] ring-2 ring-[#52B788]' : 'hover:bg-gray-100'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Meta diária */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Meta diária</label>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setGoal(g => Math.max(1, g - 1))}
                className="w-9 h-9 rounded-lg border-2 border-gray-200 text-gray-600 font-bold hover:border-[#52B788] transition-all"
              >−</button>
              <span className="w-10 text-center font-bold text-[#1B4332] text-lg">{goal}</span>
              <button
                onClick={() => setGoal(g => Math.min(99, g + 1))}
                className="w-9 h-9 rounded-lg border-2 border-gray-200 text-gray-600 font-bold hover:border-[#52B788] transition-all"
              >+</button>
              <Input
                className="flex-1"
                placeholder="unidade (ex: copos)"
                value={unit}
                onChange={e => setUnit(e.target.value)}
              />
            </div>
            {/* Sugestões de unidade */}
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {UNIT_SUGGESTIONS.map(u => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                    unit === u
                      ? 'bg-[#D8F3DC] border-[#52B788] text-[#1B4332]'
                      : 'border-gray-200 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {goal === 1
                ? `Hábito simples — marque como feito com 1 clique`
                : `Você precisará registrar ${goal} ${unit} por dia`}
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button className="flex-1" onClick={handleSave} disabled={!name.trim() || loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
