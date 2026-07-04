import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import client from '../../api/client'
import { useToast } from '../../contexts/ToastContext'
import Button from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/LoadingSkeleton'

const presetColors = [
  '#3b82f6', '#06b6d4', '#10b981', '#84cc16',
  '#eab308', '#f97316', '#ef4444', '#ec4899',
  '#a855f7', '#6366f1',
]

export default function EditCategory() {
  const { id } = useParams()
  const [name, setName] = useState('')
  const [color, setColor] = useState('#3b82f6')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    client.get(`/categories/${id}`).then((res) => {
      setName(res.data.data.name)
      setColor(res.data.data.color)
    }).finally(() => setFetching(false))
  }, [id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await client.put(`/categories/${id}`, { name, color })
      toast('Categoria atualizada com sucesso!', 'success')
      navigate('/categories')
    } catch {
      toast('Erro ao atualizar categoria.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="space-y-4 animate-fade-in">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <div className="max-w-lg animate-fade-in">
      <button
        onClick={() => navigate('/categories')}
        className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

      <h2 className="text-xl font-semibold mb-6">Editar Categoria</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-sm text-zinc-400 block" htmlFor="cat-name">Nome</label>
          <input
            id="cat-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-zinc-400 block">Cor</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-9 rounded-lg border border-zinc-700 bg-zinc-900 cursor-pointer shrink-0"
            />
            <span className="text-sm text-zinc-600 font-mono">{color}</span>
            <span className="ml-auto text-xs text-zinc-600">Cores sugeridas:</span>
          </div>
          <div className="flex gap-2 mt-2">
            {presetColors.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setColor(preset)}
                className={`h-7 w-7 rounded-full border-2 transition-all hover:scale-110 ${
                  color === preset ? 'border-zinc-100 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: preset }}
                title={preset}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
          <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="text-sm text-zinc-400">
            Preview: <strong className="text-zinc-200 font-medium">{name}</strong>
          </span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" loading={loading}>
            {!loading && <Save className="h-4 w-4" />}
            Salvar
          </Button>
          <Button variant="secondary" type="button" onClick={() => navigate('/categories')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
