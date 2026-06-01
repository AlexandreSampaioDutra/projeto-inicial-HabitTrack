import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { HabitWithLogs } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (habitId: string, note: string) => void
  habit: HabitWithLogs | null
}

export function NoteModal({ open, onClose, onSave, habit }: Props) {
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (habit) setNote(habit.noteToday ?? '')
  }, [habit, open])

  const handleSave = async () => {
    if (!habit) return
    setLoading(true)
    await onSave(habit.id, note)
    setLoading(false)
    onClose()
  }

  if (!habit) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {habit.emoji} {habit.name} — Anotação de hoje
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Como foi? Alguma observação?
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#52B788] min-h-[120px]"
              placeholder="Ex: Tomei 6 copos. Tive dificuldade porque esqueci a garrafinha no trabalho..."
              value={note}
              onChange={e => setNote(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button className="flex-1" onClick={handleSave} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar anotação'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
