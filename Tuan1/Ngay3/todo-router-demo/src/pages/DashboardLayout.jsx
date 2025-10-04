
import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function DashboardLayout(){
  return (
    <div style={{padding:12}}>
      <h2>Dashboard</h2>
      <nav><Link to="stats">Stats</Link> | <Link to="settings">Settings</Link></nav>
      <div style={{marginTop:12}}>
        <Outlet /> 
      </div>
    </div>
  )
}



