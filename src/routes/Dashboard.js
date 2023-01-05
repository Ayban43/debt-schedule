// import React from 'react'
import supabase from '../config/supabaseClient'

const Dashboard = () => {
    console.log(supabase)
    
  return (
    
    <div className = "dashboard">
        <h1>Dashboard</h1>
    </div>
  )
}

export default Dashboard