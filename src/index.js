
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
import Debt from "./routes/Debt";
import CreateDebt from "./routes/CreateDebt";
import ViewDebt from "./routes/ViewDebt";

import ErrorPage from "./routes/ErrorPage";
import "./App.css";
import LoginPage from "./routes/LoginPage";
import supabase from "./config/supabaseClient";
import React, { createContext, useState, useEffect } from 'react';
import LoadingSpinner from "./components/LoadingSpinner";

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
        path: "/debt-schedule/",
        element: <Dashboard />,
      },
      {
        path: "debt-schedule/debt",
        element: <Debt />,
      },
      {
        path: "debt-schedule/create-debt",
        element: <CreateDebt />,
      },
      {
        path: "debt-schedule/:id",
        element: <ViewDebt />,
      },
      {
        path: "debt-schedule/login",
        element: <LoginPage />,
      },
    ]
  }

]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
