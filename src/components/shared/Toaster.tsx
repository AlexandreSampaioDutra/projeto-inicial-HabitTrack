import { cn } from '@/lib/utils'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error'
}

interface Props {
  toasts: Toast[]
}

export function Toaster({ toasts }: Props) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={cn(
            'px-4 py-3 rounded-lg text-white text-sm shadow-lg animate-in slide-in-from-bottom-4',
            t.type === 'success' ? 'bg-[#1B4332]' : 'bg-red-500'
          )}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
