
// import supabase from '../config/supabaseClient'
import FetchDebt from '../Query/FetchDebt'
import PaymentPerMonth from '../components/PaymentPerMonth'
import Example from '../components/SelectDebt'
import SelectDebt from '../components/SelectDebt'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState, useContext } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import NotLoggedInPage from './NotLoggedInPage'
import supabase from '../config/supabaseClient'

const Dashboard = () => {

  const [user, setUser] = useState({})
  const navigate = useNavigate()
  const [state, setState] = useState({ status: 'loading' });

  useEffect(() => {
    async function getUserData() {
      await supabase.auth.getUser().then((value => {
        setState({ status: 'loaded' });
        // value.data.user
        if (value.data?.user) {

          // console.log(value.data.user)
          setUser(value.data.user)
        }
      }))
    }
    getUserData();
  }, [])

  async function signOutUser() {
    const { error } = await supabase.auth.signOut()
    navigate("/login")
  }

  if (state.status === 'loading') {
    return <LoadingSpinner />
  }

  if (Object.keys(user).length !== 0) {
    return (
      <div className="container-page bg-gradient-to-b from-gray-100 to-gray-300" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="page debt">
          <div className="grid bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <SelectDebt />
          </div>
          
        </div>
      </div>
    )
  }

  return (
    <NotLoggedInPage />
  )
  // return (
  //   <>
  //     {
  //       Object.keys(user).length !== 0 ?
  //         <>
  //           <SelectDebt />
  //           <button onClick={() => signOutUser()}>Sign Out</button>
  //         </>
  //         :
  //         <>
  //           <h1>Not Logged In!</h1>
  //           <button onClick={() => { navigate("/debt-schedule/login") }}>Go to login page</button>
  //         </>
  //     }
  //   </>
  // )


  // if(Object.keys(user).length !== 0 ){
  //   console.log("logged in")
  //   return (
  //     <>
  //       <SelectDebt />
  //       <button onClick={() => signOutUser()}>Sign Out</button>
  //     </>
  //   )

  // } else {
  //   console.log("logged out")
  //   return (
  //     <div>
  //       <h1>Not Logged In!</h1>
  //       <button onClick={() => { navigate("/debt-schedule/login") }}>Go to login page</button>
  //     </div>
  //   )

  // }

}

export default Dashboard