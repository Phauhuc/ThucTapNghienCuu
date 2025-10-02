import React, { useState, useRef, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

function TodoItem({ todo, onToggle, onEdit, onDelete }){
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(todo.text)
  const inputRef = useRef(null)

  function startEdit(){
    setEditing(true)
    setTimeout(() => inputRef.current && inputRef.current.focus(), 0)
  }

  function saveEdit(){
    const trimmed = text.trim()
    if(trimmed.length === 0){
      onDelete(todo.id)
    } else {
      onEdit(todo.id, trimmed)
    }
    setEditing(false)
  }

  return (
    <li className="todo-item">
      <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
      {editing ? (
        <>
          <input
            ref={inputRef}
            className="edit-input"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if(e.key === 'Enter') saveEdit(); if(e.key === 'Escape') setEditing(false) }}
          />
          <button className="btn small" onClick={saveEdit}>Save</button>
        </>
      ) : (
        <>
          <span className={ todo.completed ? 'text done' : 'text' } onDoubleClick={startEdit}>
            {todo.text}
          </span>
          <div className="actions">
            <button className="btn small" onClick={startEdit}>Edit</button>
            <button className="btn small danger" onClick={() => onDelete(todo.id)}>Delete</button>
          </div>
        </>
      )}
    </li>
  )
}

export default function TodoApp(){
  const [todos, setTodos] = useLocalStorage('todos_v1', [])
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  function addTodo(text){
    const trimmed = text.trim()
    if(!trimmed) return
    const newTodo = { id: Date.now(), text: trimmed, completed: false }
    setTodos(prev => [newTodo, ...prev])
  }

  function handleAdd(e){
    e.preventDefault()
    const value = e.target.elements.todoInput.value
    addTodo(value)
    e.target.reset()
    inputRef.current && inputRef.current.focus()
  }

  function toggleTodo(id){
    setTodos(prev => prev.map(t => t.id === id ? {...t, completed: !t.completed} : t))
  }

  function editTodo(id, text){
    setTodos(prev => prev.map(t => t.id === id ? {...t, text} : t))
  }

  function deleteTodo(id){
    setTodos(prev => prev.filter(t => t.id !== id))
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
        <button className="btn">Add</button>
      </form>

      <div className="toolbar">
        <input placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} />
        <div className="left-info">{remaining} remaining</div>
        <button className="btn small" onClick={() => { setTodos([]) }}>Clear All</button>
      </div>

      <ul className="todo-list">
        {filtered.length === 0 ? <li className="empty">No todos</li> : filtered.map(todo =>
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onEdit={editTodo}
            onDelete={deleteTodo}
          />
        )}
      </ul>
    </section>
  )
}
