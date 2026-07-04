import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import client from '../../api/client'
import { useToast } from '../../contexts/ToastContext'
import type { Category } from '../../types'
import Button from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/LoadingSkeleton'

export default function EditTask() {
  const { id } = useParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('pending')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      client.get('/categories?per_page=100'),
      client.get(`/tasks/${id}`),
    ]).then(([catRes, taskRes]) => {
      setCategories(catRes.data.data)
      const task = taskRes.data.data
      setTitle(task.title)
      setDescription(task.description ?? '')
      setStatus(task.status)
      setPriority(task.priority)
      setDueDate(task.due_date ?? '')
      setCategoryId(task.category_id ? String(task.category_id) : '')
    }).finally(() => setFetching(false))
  }, [id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await client.put(`/tasks/${id}`, {
        title,
        description: description || undefined,
        status,
        priority,
        due_date: dueDate || undefined,
        category_id: categoryId ? Number(categoryId) : undefined,
      })
      toast('Tarefa atualizada com sucesso!', 'success')
      navigate('/tasks')
    } catch {
      toast('Erro ao atualizar tarefa.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="space-y-4 animate-fade-in">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg animate-fade-in">
      <button
        onClick={() => navigate('/tasks')}
        className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

      <h2 className="text-xl font-semibold mb-6">Editar Tarefa</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm text-zinc-400 block" htmlFor="task-title">Título</label>
          <input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-zinc-400 block" htmlFor="task-desc">Descrição</label>
          <textarea
            id="task-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-zinc-400 block" htmlFor="task-status">Status</label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all cursor-pointer"
            >
              <option value="pending">Pendente</option>
              <option value="in_progress">Em andamento</option>
              <option value="completed">Concluída</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-zinc-400 block" htmlFor="task-priority">Prioridade</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all cursor-pointer"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-zinc-400 block" htmlFor="task-due">Vencimento</label>
            <input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-zinc-400 block" htmlFor="task-category">Categoria</label>
            <select
              id="task-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all cursor-pointer"
            >
              <option value="">Sem categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" loading={loading}>
            {!loading && <Save className="h-4 w-4" />}
            Salvar
          </Button>
          <Button variant="secondary" type="button" onClick={() => navigate('/tasks')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
