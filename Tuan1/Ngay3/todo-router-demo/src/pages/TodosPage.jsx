// src/pages/TodosPage.jsx
import React, { useState, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import TodoItem from '../components/TodoItem'

export default function TodosPage(){
  const [todos, setTodos] = useLocalStorage('todos_v1', [])
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // chỉ phần liên quan trong TodosPage.jsx
  function addTodoSync(text){
    const trimmed = text.trim()
    if (!trimmed) return null
    const newTodo = { id: Date.now().toString(), text: trimmed, completed: false }
    const next = [newTodo, ...todos]    // todos là state hiện tại (synchronous read)
    setTodos(next)                      // cập nhật state React
    try {
      localStorage.setItem('todos_v1', JSON.stringify(next)) // persist ngay
    } catch (err) {
      console.error('localStorage write failed', err)
    }
    return newTodo
  }

  function handleAdd(e){
    e.preventDefault()
    const value = e.target.elements.todoInput.value
    const created = addTodoSync(value)
    e.target.reset()
    inputRef.current?.focus()
    if (created) navigate(`/todos/${created.id}`, { state: { todo: created, from: '/todos' } })
  }


  function toggleTodo(id){
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  function editTodo(id, text){
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t))
  }

  function deleteTodo(id){
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function clearCompleted(){
    setTodos(prev => prev.filter(t => !t.completed))
  }

  function clearAll(){
    setTodos([])
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

      <ul className="todo-list">
        {filtered.length === 0 ? (
          <li className="empty">No todos</li>
        ) : (
          filtered.map(todo => (
            <React.Fragment key={todo.id}>
              <TodoItem todo={todo} onToggle={toggleTodo} onEdit={editTodo} onDelete={deleteTodo} />
              <li style={{padding:'4px 12px'}}><Link to={`/todos/${todo.id}`}>View details</Link></li>
            </React.Fragment>
          ))
        )}
      </ul>
    </section>
  )
}
