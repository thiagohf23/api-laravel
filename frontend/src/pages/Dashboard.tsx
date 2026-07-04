import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ListChecks, CheckCircle2, Clock, AlertTriangle, Tags, ArrowRight } from 'lucide-react'
import client from '../api/client'
import type { Category, Task } from '../types'
import { CardSkeleton, Skeleton } from '../components/ui/LoadingSkeleton'

export default function Dashboard() {
  const [categories, setCategories] = useState<Category[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      client.get('/categories'),
      client.get('/tasks?per_page=50'),
    ]).then(([catRes, taskRes]) => {
      setCategories(catRes.data.data)
      setTasks(taskRes.data.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-7 w-40" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    )
  }

  const total = tasks.length
  const completed = tasks.filter((t) => t.status === 'completed').length
  const pending = tasks.filter((t) => t.status === 'pending').length
  const high = tasks.filter((t) => t.priority === 'high' && t.status !== 'completed').length
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0

  const cards = [
    { label: 'Total de Tarefas', value: total, icon: ListChecks, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-900/30' },
    { label: 'Concluídas', value: completed, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-900/30' },
    { label: 'Pendentes', value: pending, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-900/30' },
    { label: 'Alta Prioridade', value: high, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-900/30', highlight: high > 0 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p className="text-sm text-zinc-500 mt-1">Visão geral do seu gerenciamento de tarefas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className={`rounded-xl border p-4 transition-all duration-200 hover:border-zinc-700 ${
                card.highlight ? `${card.border} ${card.bg}` : 'border-zinc-800 bg-zinc-900/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-zinc-500">{card.label}</p>
                <div className={`h-8 w-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold mt-2 ${card.highlight ? card.color : 'text-zinc-100'}`}>
                {card.value}
              </p>
            </div>
          )
        })}
      </div>

      {total > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-500">Progresso Geral</span>
            <span className="text-sm text-zinc-400 font-medium">{completionPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-zinc-400 to-zinc-200 transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Tags className="h-4 w-4 text-zinc-500" />
              <h3 className="text-sm font-medium text-zinc-400">Categorias</h3>
            </div>
            <Link
              to="/categories"
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1"
            >
              Ver todas <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 text-sm px-2 py-1.5 rounded-lg hover:bg-zinc-800/30 transition-colors">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-zinc-300">{cat.name}</span>
                <span className="text-zinc-600 text-xs ml-auto">{cat.tasks_count ?? 0} tarefas</span>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-sm text-zinc-600 text-center py-4">Nenhuma categoria criada.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-zinc-500" />
              <h3 className="text-sm font-medium text-zinc-400">Tarefas Recentes</h3>
            </div>
            <Link
              to="/tasks"
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1"
            >
              Ver todas <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-1">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center gap-3 text-sm px-2 py-2 rounded-lg hover:bg-zinc-800/30 transition-colors">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    task.status === 'completed' ? 'bg-green-500' :
                    task.status === 'in_progress' ? 'bg-blue-500' : 'bg-zinc-600'
                  }`}
                />
                <span className="text-zinc-300 truncate">{task.title}</span>
                <span className={`text-xs ml-auto shrink-0 px-1.5 py-0.5 rounded font-medium ${
                  task.priority === 'high' ? 'bg-red-950/60 text-red-400' :
                  task.priority === 'medium' ? 'bg-yellow-950/60 text-yellow-400' :
                  'bg-zinc-800 text-zinc-500'
                }`}>
                  {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-sm text-zinc-600 text-center py-4">Nenhuma tarefa criada.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
