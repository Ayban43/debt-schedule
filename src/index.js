
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./routes/Dashboard";
import Debt from "./routes/Debt.js";
import CreateDebt from "./routes/CreateDebt";
import ViewDebt from "./routes/ViewDebt";

import ErrorPage from "./routes/ErrorPage";
import "./index.css";
import LoginPage from "./routes/LoginPage";
import supabase from "./config/supabaseClient";
import React, { createContext, useState, useEffect } from 'react';
import LoadingSpinner from "./components/LoadingSpinner";
import 'flowbite';
import MainPage from "./notLoggedInRoutes/MainPage";

export const SupabaseContext = createContext();

const AppLayout = () => {
  const [state, setState] = useState({ status: 'loading' });
  const [user, setUser] = useState({})
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('')
  const [queryResults, setQueryResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserData() {
      await supabase.auth.getUser().then((value => {
        setState({ status: 'loaded' });
        setLoading(false);

        if (value.data?.user) {
          setQueryResults(value.data.user)
          //console.log(value.data.user)
          setEmail(value.data.user.email)
          setUser(value.data.user)
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      }))
    }
    getUserData();
  }, [])

  //console.log(queryResults)

  return (
    <SupabaseContext.Provider value={queryResults}>
      {loading ?
      <>
      <LoadingSpinner />
      </>
      :
      <>
      <Navbar />
      <Outlet />
      </>
      }
    </SupabaseContext.Provider>
  )
}


const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
        // element: <MainPage />,
      },
      {
        path: "/debt",
        element: <Debt />,
      },
      {
        path: "/create-debt",
        element: <CreateDebt />,
      },
      {
        path: "/:id",
        element: <ViewDebt />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ]
  }

]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);



  // var themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
  // var themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

  // // Change the icons inside the button based on previous settings
  // if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  //   themeToggleLightIcon.classList.remove('hidden');
  // } else {
  //   themeToggleDarkIcon.classList.remove('hidden');
  // }

  // var themeToggleBtn = document.getElementById('theme-toggle');

  // themeToggleBtn.addEventListener('click', function () {

  //   // toggle icons inside button
  //   themeToggleDarkIcon.classList.toggle('hidden');
  //   themeToggleLightIcon.classList.toggle('hidden');

  //   // if set via local storage previously
  //   if (localStorage.getItem('color-theme')) {
  //     if (localStorage.getItem('color-theme') === 'light') {
  //       document.documentElement.classList.add('dark');
  //       localStorage.setItem('color-theme', 'dark');
  //     } else {
  //       document.documentElement.classList.remove('dark');
  //       localStorage.setItem('color-theme', 'light');
  //     }

  //     // if NOT set via local storage previously
  //   } else {
  //     if (document.documentElement.classList.contains('dark')) {
  //       document.documentElement.classList.remove('dark');
  //       localStorage.setItem('color-theme', 'light');
  //     } else {
  //       document.documentElement.classList.add('dark');
  //       localStorage.setItem('color-theme', 'dark');
  //     }
  //   }

  // });

