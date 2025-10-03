import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './pages/MainLayout'
import Home from './pages/Home'
import About from './pages/About'
import TodosPage from './pages/TodosPage'
import TodoDetail from './pages/TodoDetail'
import DashboardLayout from './pages/DashboardLayout'
import Stats from './pages/Stats'
import Settings from './pages/Settings'
import Login from './pages/Login'

export default function App(){
  const [user, setUser] = useState(null) 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout user={user} onLogout={() => setUser(null)} />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="todos" element={<TodosPage />} />
          <Route path="todos/:id" element={<TodoDetail />} />
          <Route path="login" element={<Login onLogin={(u) => setUser(u)} />} />
          <Route path="dashboard" element={ user ? <DashboardLayout /> : <Navigate to="/login\" replace /> }>
            <Route index element={<div style={{padding:12}}>Dashboard Home</div>} />
            <Route path="stats" element={<Stats />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<h2 style={{padding:20}}>404 — Not Found</h2>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
