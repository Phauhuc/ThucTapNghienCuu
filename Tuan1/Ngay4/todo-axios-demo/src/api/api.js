import axios from 'axios'

const STORAGE_KEY = 'axios_todos_v1'

function readTodos(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch(e){ return [] }
}
function writeTodos(todos){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: { 'X-App': 'todo-axios-demo' },
  transformRequest: [ (data, headers) => {
    if (data && typeof data === 'object') data._sentAt = Date.now()
    return JSON.stringify(data)
  }],
  transformResponse: [ data => {
    try { return JSON.parse(data) } catch(e) { return data }
  }]
})

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('demo_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})
api.interceptors.response.use(res => res, err => Promise.reject(err))

api.defaults.adapter = function(config){
  const { method, url, data, signal } = config
  function respond(status, body){
    return { status, statusText: status === 200 ? 'OK' : 'Error', config, headers:{}, data: body }
  }
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      try {
        const todos = readTodos()
        if (method === 'get' && url === '/todos') {
          resolve(respond(200, todos))
        } else if (method === 'get' && url && url.startsWith('/todos/')) {
          const id = url.replace('/todos/','')
          const t = todos.find(x => x.id === id)
          if (t) resolve(respond(200, t))
          else resolve(respond(404, { message: 'Not found' }))
        } else if (method === 'post' && url === '/todos') {
          const obj = data ? JSON.parse(data) : {}
          const newTodo = { id: Date.now().toString(), text: obj.text || '', completed: !!obj.completed }
          const next = [newTodo, ...todos]
          writeTodos(next)
          resolve(respond(200, newTodo))
        } else if ((method === 'put' || method === 'patch') && url && url.startsWith('/todos/')) {
          const id = url.replace('/todos/','')
          const body = data ? JSON.parse(data) : {}
          const next = todos.map(t => t.id === id ? { ...t, ...body } : t)
          writeTodos(next)
          const updated = next.find(t => t.id === id)
          resolve(respond(200, updated))
        } else if (method === 'delete' && url && url.startsWith('/todos/')) {
          const id = url.replace('/todos/','')
          const next = todos.filter(t => t.id !== id)
          writeTodos(next)
          resolve(respond(200, { success: true }))
        } else {
          resolve(respond(404, { message: 'Not found' }))
        }
      } catch(err){
        reject(err)
      }
    }, 220)
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeout)
        const e = new Error('canceled')
        e.name = 'CanceledError'
        reject(e)
      })
    }
  })
}

export async function getTodos(opts = {}){ return api.get('/todos', opts).then(r => r.data) }
export async function getTodo(id, opts = {}){ return api.get(`/todos/${id}`, opts).then(r => r.data) }
export async function createTodo(payload){ return api.post('/todos', payload).then(r => r.data) }
export async function updateTodo(id, payload){ return api.put(`/todos/${id}`, payload).then(r => r.data) }
export async function deleteTodo(id){ return api.delete(`/todos/${id}`).then(r => r.data) }

export default api
