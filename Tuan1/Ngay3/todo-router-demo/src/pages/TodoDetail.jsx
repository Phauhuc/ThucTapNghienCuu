// src/pages/TodoDetail.jsx
import React from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'

export default function TodoDetail(){
  const { id } = useParams()
  const location = useLocation()
  const [todos] = useLocalStorage('todos_v1', [])
  // find in persisted todos
  const todoFromStorage = todos.find(t => t.id === id)
  // fallback to router state (if we navigated immediately after creating)
  const todo = todoFromStorage || location.state?.todo

  if(!todo) {
    return (
      <div style={{padding:12}}>
        <h2>Todo not found</h2>
        <Link to="/todos">Back to list</Link>
      </div>
    )
  }

  return (
    <div style={{padding:12}}>
      <h2>Todo Detail</h2>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Text:</strong> {todo.text}</p>
      <p><strong>Completed:</strong> {todo.completed ? 'Yes' : 'No'}</p>
      <p><strong>From:</strong> {location.state?.from || 'direct'}</p>
      <Link to="/todos">Back to todos</Link>
    </div>
  )
}
