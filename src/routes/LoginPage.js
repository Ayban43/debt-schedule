import React from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth, ThemeSupa} from '@supabase/auth-ui-react'
import { useNavigate } from 'react-router-dom'
import supabase from '../config/supabaseClient'

const LoginPage = () => {
const navigate = useNavigate();

    supabase.auth.onAuthStateChange(async (event) => {
        if (event !== "SINGED OUT"){
            // go to success URL
            navigate("/")
        }else{
            // go to login page
            navigate("/login")
        }
    })
  return (
    <div className="login-elements">
        <Auth 
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa}}
        providers={["google"]}
        //redirectTo ={"https://ayban43.github.io/debt-schedule/"}
        //redirectTo ={"http://localhost:3000/"}
        />
    </div>
  )
}

export default LoginPage