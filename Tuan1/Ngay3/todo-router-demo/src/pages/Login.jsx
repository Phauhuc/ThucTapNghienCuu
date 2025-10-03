import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Login({ onLogin }){
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  function handleLogin(){
    // fake login
    onLogin({ name: 'DemoUser' })
    navigate(from, { replace: true })
  }

  return (
    <div style={{padding:12}}>
      <h2>Login</h2>
      <p>You must log in to access the dashboard.</p>
      <button onClick={handleLogin}>Login (mock)</button>
    </div>
  )
}
