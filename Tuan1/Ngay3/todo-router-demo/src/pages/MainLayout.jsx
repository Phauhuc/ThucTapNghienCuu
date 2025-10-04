
import React from 'react'
import { Outlet, Link, NavLink } from 'react-router-dom'

export default function MainLayout({ user, onLogout }){
  return (
    <div className="app-container">
      <header>
        <h1>TodoList - Router Demo</h1>
        <nav className="main-nav">
          <NavLink to="/" end>Home</NavLink> |{' '}
          <NavLink to="/todos">Todos</NavLink> |{' '}
          <NavLink to="/about">About</NavLink> |{' '}
          <NavLink to="/dashboard">Dashboard</NavLink> |{' '}
          {user ? <button className="linkish" onClick={onLogout}>Logout</button> : <Link to="/login">Login</Link>}
        </nav>
      </header>
      <main>
        <Outlet /> 
      </main>
      <footer>
        <small>
        Demo: BrowserRouter + Routes + Link + NavLink + Navigate + useNavigate + useParams + useLocation + Outlet
        </small>
      </footer>
    </div>
  )
}


