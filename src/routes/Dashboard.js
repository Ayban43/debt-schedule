// import React from 'react'
import supabase from '../config/supabaseClient'
import FetchDebt from '../Query/FetchDebt'
import PaymentPerMonth from '../components/PaymentPerMonth'
import Example from '../components/SelectDebt'
import SelectDebt from '../components/SelectDebt'

const Dashboard = () => {
    console.log(supabase)
    
  return (
    
    <div className = "dashboard">
        {/* <FetchDebt /> */}
        {/* <PaymentPerMonth /> */}
        <SelectDebt />
    </div>
  )
}

export default Dashboard