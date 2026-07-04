<p align="center">
  <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="300" alt="Laravel">
</p>

<h1 align="center">TaskFlow API</h1>

<p align="center">
  <strong>API RESTful de gerenciamento de tarefas com autenticação Sanctum, multi-tenancy por design e testes automatizados.</strong>
  <br>
  <br>
  <img src="https://img.shields.io/badge/PHP-8.4-%23777BB4?logo=php&logoColor=white" alt="PHP 8.4">
  <img src="https://img.shields.io/badge/Laravel-13-%23FF2D20?logo=laravel&logoColor=white" alt="Laravel 13">
  <img src="https://img.shields.io/badge/Sanctum-4-%23E74430?logo=laravel&logoColor=white" alt="Sanctum 4">
  <img src="https://img.shields.io/badge/Pest-4-%23C5232D?logo=php&logoColor=white" alt="Pest 4">
  <img src="https://img.shields.io/badge/React-19-%2361DAFB?logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/LICENSE-MIT-green" alt="MIT">
  <img src="https://img.shields.io/badge/coverage-32%20tests-brightgreen" alt="32 testes">
</p>

---

## Sobre o Projeto

TaskFlow é uma **API RESTful** completa para gerenciamento de tarefas pessoais, construída com **Laravel 13** e **PHP 8.4**. O projeto demonstra boas práticas de desenvolvimento profissional como:

| Prática | Implementação |
|---------|--------------|
| 🔐 Autenticação segura | Sanctum com tokens de API + rate limiting multicamada |
| 🏢 Multi-tenancy | Isolamento total de dados por usuário (escopo em queries + policies) |
| ✅ Validação robusta | Form Requests com regras complexas (enums, regex, unicidade composta) |
| 🧪 Cobertura de testes | 32 testes Pest (auth, categorias, tarefas, isolamento) |
| 🚦 Versionamento de API | Prefixo `/v1` preparado para evolução sem breaking changes |
| 🛡️ Segurança por padrão | Headers HTTP, rate limiting, CSRF, SQL injection prevention |
| 📦 API Resources | Transformação consistente de dados (sem expor `user_id`) |
| 🎯 Enums tipados | PHP 8 backed enums para status e prioridade |

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| **Backend** | Laravel 13, PHP 8.4, Eloquent ORM |
| **API** | RESTful, Sanctum Token Auth, JSON Responses |
| **Banco** | SQLite (dev) / PostgreSQL, MySQL (prod) — migrations prontas |
| **Testes** | Pest PHP 4, Laravel Factories |
| **Frontend** | React 19, TypeScript, React Router, TailwindCSS 4, Vite 8 |
| **DevOps** | Laravel Pint (code style), Laravel Pail (logs), Vite (HMR) |

---

## Funcionalidades

### 🔐 Autenticação
- Cadastro com validação forte de senha (maiúscula, minúscula, número)
- Login com rate limiting (5 tentativas/min)
- Tokens Sanctum com expiração (60 min)
- Logout com revogação de token

### 📋 Tarefas (CRUD + Filtros)
- Criar, listar, visualizar, editar e excluir tarefas
- Filtros por **status**, **prioridade**, **categoria** e **busca textual**
- Paginação com limite configurável (máx. 100 por página)
- Validação de enum para `status` e `priority`
- `due_date` deve ser futura ou igual a hoje

### 🗂️ Categorias (CRUD)
- Criar, listar, visualizar, editar e excluir categorias
- Cor hexadecimal validada por regex (`#RRGGBB`)
- Nome único por usuário (unique composto)
- Contagem de tarefas por categoria (`withCount`)

### 🔒 Segurança
| Camada | Medida |
|--------|--------|
| Autenticação | Sanctum tokens com `Hash::make` nas senhas |
| Autorização | Policies verificando `user_id` em cada operação |
| Escopo de queries | `$request->user()->tasks()` — nunca `Task::all()` |
| Rate limiting | API (60/min), login (5/min), register (3/min) |
| Headers HTTP | HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` |
| Validação | Form Requests com regras específicas por operação |
| Categoria alheia | `exists:categories,id WHERE user_id = auth()->id()` |

---

## API

### Rotas Públicas

```http
POST /api/v1/register   # Cadastro (3 req/min)
POST /api/v1/login      # Login (5 req/min)
```

### Rotas Protegidas (Bearer Token)

```http
GET    /api/v1/user          # Dados do usuário
POST   /api/v1/logout        # Revogar token

GET    /api/v1/categories    # Listar categorias
POST   /api/v1/categories    # Criar categoria
GET    /api/v1/categories/{id}  # Exibir categoria
PUT    /api/v1/categories/{id}  # Atualizar categoria
DELETE /api/v1/categories/{id}  # Excluir categoria

GET    /api/v1/tasks         # Listar tarefas (com filtros)
POST   /api/v1/tasks         # Criar tarefa
GET    /api/v1/tasks/{id}    # Exibir tarefa
PUT    /api/v1/tasks/{id}    # Atualizar tarefa
DELETE /api/v1/tasks/{id}    # Excluir tarefa
```

### Filtros de Tarefas

```
GET /api/v1/tasks?status=pending&priority=high&category_id=1&search=comprar&per_page=20
```

### Exemplos

<details>
<summary><strong>Cadastro</strong></summary>

```json
// POST /api/v1/register
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "MinhaSenha123",
  "password_confirmation": "MinhaSenha123"
}

// 201 Created
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "created_at": "2026-07-04T18:00:00+00:00"
  },
  "token": "1|abc123..."
}
```
</details>

<details>
<summary><strong>Listar tarefas com filtros</strong></summary>

```json
// GET /api/v1/tasks?status=completed&per_page=10
// Authorization: Bearer 1|abc123...

// 200 OK
{
  "data": [
    {
      "id": 42,
      "title": "Finalizar relatório",
      "status": "completed",
      "priority": "high",
      "due_date": "2026-07-11",
      "category": {
        "id": 1,
        "name": "Trabalho",
        "color": "#ef4444"
      },
      "created_at": "2026-07-04T18:00:00+00:00",
      "updated_at": "2026-07-04T18:30:00+00:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 10,
    "total": 1
  }
}
```
</details>

<details>
<summary><strong>Erro de validação</strong></summary>

```json
// POST /api/v1/tasks (sem title)
// 422 Unprocessable Entity
{
  "message": "O campo title é obrigatório.",
  "errors": {
    "title": ["O campo title é obrigatório."]
  }
}
```
</details>

---

## Quick Start

```bash
# 1. Clonar
git clone https://github.com/seu-usuario/api-laravel.git
cd api-laravel

# 2. Instalar dependências
composer install
npm install

# 3. Configurar ambiente
cp .env.example .env
php artisan key:generate

# 4. Banco de dados + dados de exemplo
php artisan migrate --seed

# 5. Iniciar servidor
php artisan serve
```

Usuário de teste criado pelo seeder:

| Email | Senha |
|-------|-------|
| `test@example.com` | `Password1` |

```bash
# Rodar testes
php artisan test --compact

# Verificar code style
vendor/bin/pint
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Estrutura do Projeto

```
app/
├── Enums/                    # TaskStatus, TaskPriority (PHP 8 backed)
├── Http/
│   ├── Controllers/Api/V1/  # Auth, Category, Task
│   ├── Middleware/           # SecurityHeaders
│   ├── Requests/Api/V1/     # 6 Form Requests com validação
│   └── Resources/V1/        # User, Category, Task + TaskCollection
├── Models/                   # User, Category, Task
├── Policies/                 # CategoryPolicy, TaskPolicy
└── Providers/                # AppServiceProvider (rate limiters)

database/
├── factories/                # User, Category, Task factories
├── migrations/               # 6 migrations
└── seeders/                  # DatabaseSeeder (dados de exemplo)

tests/
├── Feature/Api/V1/           # AuthTest, CategoryTest, TaskTest
└── Pest.php                  # LazilyRefreshDatabase

frontend/                     # React 19 + TypeScript SPA
```

---

## Testes

```bash
# Suite completa
php artisan test --compact

# Por arquivo
php artisan test --compact --filter=AuthTest
php artisan test --compact --filter=CategoryTest
php artisan test --compact --filter=TaskTest
```

**32 testes · 77 asserções · Cobertura completa de:**

- Registro com validação forte de senha
- Login com credenciais válidas e inválidas
- Isolamento total entre usuários (não vê dados alheios)
- CRUD completo de categorias e tarefas
- Filtros por status, prioridade, busca textual
- Regras de unicidade composta (`user_id + name`)
- Autorização por Policy (403 em recursos de outro usuário)
- Rate limiting (401 sem token)

---

## Licença

MIT
