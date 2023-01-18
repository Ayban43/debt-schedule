// import React from 'react'
import supabase from '../config/supabaseClient'
import FetchDebt from '../Query/FetchDebt'
import PaymentPerMonth from '../components/PaymentPerMonth'

const Dashboard = () => {
    console.log(supabase)
    
  return (
    
    <div className = "dashboard">
        <FetchDebt />
        {/* <PaymentPerMonth /> */}
    </div>
  )
}

export default Dashboard