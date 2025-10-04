import React, { useState, useRef, useEffect } from 'react'

export default function TodoItem({ todo, onToggle, onEdit, onDelete }){
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(todo.text)
  const inputRef = useRef(null)

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])
  useEffect(() => { if (!editing) setText(todo.text) }, [todo.text, editing])

  function startEdit(){ setEditing(true) }
  function saveEdit(){
    const trimmed = text.trim()
    if(trimmed.length === 0) onDelete(todo.id)
    else onEdit(todo.id, trimmed)
    setEditing(false)
  }

  return (
    <li className="todo-item">
      <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
      {editing ? (
        <>
          <input ref={inputRef} className="edit-input" value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => { if(e.key === 'Enter') saveEdit(); if(e.key === 'Escape') setEditing(false) }} />
          <button className="btn small" onClick={saveEdit}>Save</button>
        </>
      ) : (
        <>
          <span className={ todo.completed ? 'text done' : 'text' } onDoubleClick={startEdit}>{todo.text}</span>
          <div className="actions">
            <button className="btn small" onClick={startEdit}>Edit</button>
            <button className="btn small danger" onClick={() => onDelete(todo.id)}>Delete</button>
          </div>
        </>
      )}
    </li>
  )
}
