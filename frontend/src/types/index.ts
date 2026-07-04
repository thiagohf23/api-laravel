export interface User {
  id: number
  name: string
  email: string
  created_at: string
}

export interface Category {
  id: number
  name: string
  color: string
  tasks_count?: number
  created_at?: string
}

export interface Task {
  id: number
  title: string
  description: string | null
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  category_id: number | null
  category?: Pick<Category, 'id' | 'name' | 'color'> | null
  created_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
