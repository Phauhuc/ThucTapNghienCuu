import React from 'react'
import TodoApp from './components/TodoApp'

export default function App(){
  return (
    <div className="app-container">
      <header><h1>TodoList - React Hooks</h1></header>
      <main>
        <TodoApp />
      </main>
      <footer>
        <small>React Hooks</small>
      </footer>
    </div>
  )
}
