
import React, { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import * as api from '../api/api'

export default function TodoDetail(){
  const { id } = useParams()
  const location = useLocation()
  const [todo, setTodo] = useState(location.state?.todo || null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (todo) return
    const controller = new AbortController()
    api.getTodo(id, { signal: controller.signal })
      .then(setTodo)
      .catch(err => setError(err.message || 'Failed'))
    return () => controller.abort()
  }, [id])

  if (error) return <div style={{padding:12}}>Error: {error} <Link to="/todos">Back</Link></div>
  if (!todo) return <div style={{padding:12}}>Loading... </div>

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
