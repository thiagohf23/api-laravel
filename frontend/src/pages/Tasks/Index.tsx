import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, X, CheckCircle2, Clock, ListTodo, ArrowRight, ArrowLeft, AlertTriangle, Inbox } from 'lucide-react'
import client from '../../api/client'
import { useToast } from '../../contexts/ToastContext'
import type { Task } from '../../types'
import Button from '../../components/ui/Button'
import { TableSkeleton } from '../../components/ui/LoadingSkeleton'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const statusOrder: Record<string, number> = { pending: 0, in_progress: 1, completed: 2 }

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending: { label: 'Pendente', color: 'text-zinc-400', bg: 'bg-zinc-800/60', icon: Clock },
  in_progress: { label: 'Em andamento', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: ListTodo },
  completed: { label: 'Concluída', color: 'text-green-400', bg: 'bg-green-500/10', icon: CheckCircle2 },
}

const priorityConfig: Record<string, { label: string; bg: string; color: string }> = {
  low: { label: 'Baixa', bg: 'bg-zinc-800', color: 'text-zinc-500' },
  medium: { label: 'Média', bg: 'bg-yellow-950/50', color: 'text-yellow-400' },
  high: { label: 'Alta', bg: 'bg-red-950/40', color: 'text-red-400' },
}

export default function TaskIndex() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  function load() {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterStatus) params.set('status', filterStatus)
    if (filterPriority) params.set('priority', filterPriority)
    if (search) params.set('search', search)
    params.set('page', String(page))

    client.get(`/tasks?${params}`).then((res) => {
      setTasks(res.data.data)
      setLastPage(res.data.meta.last_page)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page, filterStatus, filterPriority, search])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  async function handleDelete() {
    if (deleteId === null) return
    setDeleting(true)
    try {
      await client.delete(`/tasks/${deleteId}`)
      toast('Tarefa excluída com sucesso!', 'success')
      load()
    } catch {
      toast('Erro ao excluir tarefa.', 'error')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  function handleSearch() {
    setSearch(searchInput)
    setPage(1)
  }

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch()
  }

  function clearFilters() {
    setSearch('')
    setSearchInput('')
    setFilterStatus('')
    setFilterPriority('')
    setPage(1)
  }

  const hasFilters = search || filterStatus || filterPriority

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Tarefas</h2>
          <p className="text-sm text-zinc-500 mt-1">Gerencie suas tarefas do dia a dia</p>
        </div>
        <Link to="/tasks/create">
          <Button>
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
          <input
            placeholder="Buscar tarefas…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-56 rounded-lg border border-zinc-700 bg-zinc-900 pl-10 pr-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all cursor-pointer"
        >
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="in_progress">Em andamento</option>
          <option value="completed">Concluída</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => { setFilterPriority(e.target.value); setPage(1) }}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all cursor-pointer"
        >
          <option value="">Todas as prioridades</option>
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-500 hover:text-zinc-200 hover:border-zinc-600 transition-all"
          >
            <X className="h-3.5 w-3.5" />
            Limpar
          </button>
        )}
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900/80 text-zinc-500 text-left">
              <tr>
                <th className="px-5 py-3.5 font-medium">Título</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium">Prioridade</th>
                <th className="px-5 py-3.5 font-medium">Categoria</th>
                <th className="px-5 py-3.5 font-medium">Vencimento</th>
                <th className="px-5 py-3.5 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {[...tasks].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]).map((task) => {
                const st = statusConfig[task.status]
                const StatusIcon = st.icon
                const pr = priorityConfig[task.priority]

                return (
                  <tr key={task.id} className="hover:bg-zinc-900/40 transition-colors group">
                    <td className="px-5 py-3.5">
                      <span className="text-zinc-200 font-medium">{task.title}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium ${st.color} ${st.bg}`}>
                        <StatusIcon className="h-3 w-3" />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${pr.color} ${pr.bg}`}>
                        {task.priority === 'high' && <AlertTriangle className="h-3 w-3" />}
                        {pr.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {task.category ? (
                        <span className="flex items-center gap-1.5 text-zinc-500">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: task.category.color }} />
                          {task.category.name}
                        </span>
                      ) : (
                        <span className="text-zinc-700">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR') : <span className="text-zinc-700">—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/tasks/${task.id}/edit`}
                          className="p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(task.id)}
                          className="p-2 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-950/30 transition-all"
                          title="Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              )}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
                      <Inbox className="h-10 w-10 mb-3 text-zinc-700" />
                      <p className="text-sm">Nenhuma tarefa encontrada</p>
                      {hasFilters ? (
                        <button onClick={clearFilters} className="text-sm text-zinc-400 hover:text-zinc-200 mt-2 transition-colors">
                          Limpar filtros
                        </button>
                      ) : (
                        <Link to="/tasks/create" className="text-sm text-zinc-400 hover:text-zinc-200 mt-2 transition-colors">
                          Criar primeira tarefa
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-400 disabled:opacity-30 hover:text-zinc-200 hover:border-zinc-600 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Anterior
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: lastPage }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === lastPage || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-1 text-zinc-700">…</span>
                  )}
                  <button
                    onClick={() => setPage(p)}
                    className={`min-w-[2rem] h-8 rounded-lg text-sm font-medium transition-all ${
                      page === p
                        ? 'bg-zinc-800 text-zinc-100'
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}
          </div>

          <button
            disabled={page === lastPage}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-400 disabled:opacity-30 hover:text-zinc-200 hover:border-zinc-600 transition-all"
          >
            Próxima
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir tarefa"
        message="Esta ação não pode ser desfeita."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
