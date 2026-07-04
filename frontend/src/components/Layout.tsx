import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Tags, CheckSquare, LogOut, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const nav = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Categorias', path: '/categories', icon: Tags },
  { label: 'Tarefas', path: '/tasks', icon: CheckSquare },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  function isActive(path: string) {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <aside className="w-60 border-r border-zinc-800/60 p-4 flex flex-col shrink-0">
        <div className="flex items-center gap-2 px-3 mb-8">
          <div className="h-8 w-8 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center text-sm font-bold">
            T
          </div>
          <span className="text-base font-bold tracking-tight">Task Manager</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {nav.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 relative ${
                  active
                    ? 'bg-zinc-800/80 text-white font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-zinc-100" />
                )}
                <Icon className={`h-4 w-4 transition-colors ${active ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-zinc-800/60 pt-4">
          <div className="flex items-center gap-3 px-3">
            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-300 truncate">{user?.name}</p>
              <p className="text-xs text-zinc-600 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sair"
              className="text-zinc-600 hover:text-zinc-400 transition-colors p-1 rounded hover:bg-zinc-800/50"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 lg:p-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  )
}
