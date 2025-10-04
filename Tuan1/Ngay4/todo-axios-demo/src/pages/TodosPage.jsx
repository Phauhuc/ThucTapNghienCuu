import React, { useEffect, useState, useRef, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TodoItem from '../components/TodoItem'
import * as api from '../api/api'

export default function TodosPage(){
  const [todos, setTodos] = useState([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    api.getTodos({ signal: controller.signal })
      .then(setTodos)
      .catch(err => { if (err?.name !== 'CanceledError') setError(err.message || 'Load failed') })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  async function handleAdd(e){
    e.preventDefault()
    const value = e.target.elements.todoInput.value.trim()
    if(!value) return
    try{
      const created = await api.createTodo({ text: value, completed: false })
      navigate(`/todos/${created.id}`, { state: { todo: created, from: '/todos' } })
      const fresh = await api.getTodos()
      setTodos(fresh)
    } catch(err){ setError(err.message || 'Create failed') }
    e.target.reset()
    inputRef.current?.focus()
  }

  async function toggleTodo(id){
    try{
      const t = todos.find(x => x.id === id)
      await api.updateTodo(id, { completed: !t.completed })
      const next = await api.getTodos()
      setTodos(next)
    } catch(err){ setError(err.message) }
  }

  async function editTodo(id, text){
    try{
      await api.updateTodo(id, { text })
      const next = await api.getTodos()
      setTodos(next)
    } catch(e){ setError(e.message) }
  }

  async function deleteTodo(id){
    try{
      await api.deleteTodo(id)
      const next = await api.getTodos()
      setTodos(next)
    } catch(e){ setError(e.message) }
  }

  async function clearCompleted(){
    try{
      const list = await api.getTodos()
      for(const t of list.filter(x=>x.completed)) await api.deleteTodo(t.id)
      const fresh = await api.getTodos()
      setTodos(fresh)
    } catch(e){ setError(e.message) }
  }
  async function clearAll(){
    try{
      const list = await api.getTodos()
      for(const t of list) await api.deleteTodo(t.id)
      setTodos([])
    } catch(e){ setError(e.message) }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if(!q) return todos
    return todos.filter(t => t.text.toLowerCase().includes(q))
  }, [todos, query])

  const remaining = useMemo(() => todos.filter(t => !t.completed).length, [todos])

  return (
    <section className="todo-app">
      <form className="todo-form" onSubmit={handleAdd}>
        <input name="todoInput" ref={inputRef} placeholder="Add a new todo and press Enter..." autoComplete="off" />
        <button className="btn">Add & View</button>
      </form>

      <div className="toolbar">
        <input placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} />
        <div className="left-info">{remaining} remaining</div>
        <button className="btn small" onClick={clearAll}>Clear All</button>
        <button className="btn small" onClick={clearCompleted}>Clear Completed</button>
      </div>

      {loading ? <div style={{padding:12}}>Loading...</div> : null}
      {error ? <div style={{color:'red',padding:8}}>Error: {error}</div> : null}

      <ul className="todo-list">
        {filtered.length === 0 ? <li className="empty">No todos</li> : filtered.map(todo => (
          <React.Fragment key={todo.id}>
            <TodoItem todo={todo} onToggle={toggleTodo} onEdit={editTodo} onDelete={deleteTodo} />
            <li style={{padding:'4px 12px'}}><Link to={`/todos/${todo.id}`}>View details</Link></li>
          </React.Fragment>
        ))}
      </ul>
    </section>
  )
}
