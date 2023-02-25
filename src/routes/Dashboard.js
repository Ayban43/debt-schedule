
// import supabase from '../config/supabaseClient'
import SelectDebt from '../components/SelectDebt'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import supabase from '../config/supabaseClient'
import MainPage from '../notLoggedInRoutes/MainPage'
import AnnouncementBottom from '../components/AnnouncementBottom'

const Dashboard = () => {

  const [user, setUser] = useState({})
  const navigate = useNavigate()
  const [state, setState] = useState({ status: 'loading' });
  const [userEmail, setUserEmail] = useState(null)
  const [companyName, setCompanyName] = useState(null)

  useEffect(() => {
    async function getUserData() {
      await supabase.auth.getUser().then((value => {
        setState({ status: 'loaded' });
        // value.data.user
        if (value.data?.user) {
          setUser(value.data.user)
          setUserEmail(value.data.user.email)
        }
      }))
    }
    getUserData();
  }, [])

  useEffect(() => {

    async function fetchData() {
        if (userEmail) {
            const { data, error } = await supabase
                .from('profiles')
                .select('company_name')
                .eq('email', userEmail);
            if (error) console.log('Error fetching data:', error);
            else
            setCompanyName(data[0].company_name)
        }
    }
    fetchData();
}, [userEmail]);

  async function signOutUser() {
    const { error } = await supabase.auth.signOut()
    navigate("/login")
  }

  if (state.status === 'loading') {
    return <LoadingSpinner />
  }

  if (Object.keys(user).length !== 0) {
    return (
      <div className="grid justify-center container-page bg-gradient-to-b from-slate-50 to-slate-300 p-5">
        <div className="page debt">
          <SelectDebt 
          object = {companyName}
          />
        </div>
      </div>
    )
  }

  return (
    <>
    <MainPage />
    <AnnouncementBottom />
    </>
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