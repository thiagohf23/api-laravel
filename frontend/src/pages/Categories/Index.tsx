import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Tags, FolderOpen } from 'lucide-react'
import client from '../../api/client'
import { useToast } from '../../contexts/ToastContext'
import type { Category } from '../../types'
import Button from '../../components/ui/Button'
import { TableSkeleton } from '../../components/ui/LoadingSkeleton'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

export default function CategoryIndex() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    client.get('/categories')
      .then((res) => setCategories(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete() {
    if (deleteId === null) return
    setDeleting(true)
    try {
      await client.delete(`/categories/${deleteId}`)
      setCategories((prev) => prev.filter((c) => c.id !== deleteId))
      toast('Categoria excluída com sucesso!', 'success')
    } catch {
      toast('Erro ao excluir categoria.', 'error')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Categorias</h2>
        </div>
        <TableSkeleton rows={4} />
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Categorias</h2>
          <p className="text-sm text-zinc-500 mt-1">Organize suas tarefas por categorias</p>
        </div>
        <Link to="/categories/create">
          <Button>
            <Plus className="h-4 w-4" />
            Nova Categoria
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900/80 text-zinc-500 text-left">
            <tr>
              <th className="px-5 py-3.5 font-medium">Nome</th>
              <th className="px-5 py-3.5 font-medium">Cor</th>
              <th className="px-5 py-3.5 font-medium">Tarefas</th>
              <th className="px-5 py-3.5 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-zinc-900/40 transition-colors group">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 ring-2 ring-zinc-800"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-zinc-200 font-medium">{cat.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-xs text-zinc-600 font-mono">{cat.color}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <Tags className="h-3.5 w-3.5" />
                    {cat.tasks_count ?? 0}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/categories/${cat.id}/edit`}
                      className="p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
                      title="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => setDeleteId(cat.id)}
                      className="p-2 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-950/30 transition-all"
                      title="Excluir"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
                    <FolderOpen className="h-10 w-10 mb-3 text-zinc-700" />
                    <p className="text-sm">Nenhuma categoria cadastrada</p>
                    <Link to="/categories/create" className="text-sm text-zinc-400 hover:text-zinc-200 mt-2 transition-colors">
                      Criar primeira categoria
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir categoria"
        message={
          <>
            Esta ação não pode ser desfeita. Todas as tarefas desta categoria
            serão removidas.
          </>
        }
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
