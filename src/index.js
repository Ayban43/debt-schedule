import React from "react";
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

import ErrorPage from "./routes/ErrorPage";
import "./App.css";

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/debt-schedule",
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
    ]
  }

]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
