import { createBrowserRouter } from "react-router"; 
import RootLayout from "../Layout/RootLayout";
import HomePage from "../Pages/HomePage";
import Complaints from "../Pages/Complaints";
import ReportComplaint from "../Pages/ReportComplaint";
import Login from "../Pages/Login";
import AdminLayout from "../admin/AdminLayout";
import Dashboard from "../admin/pages/Dashboard";
import AllReports from "../admin/pages/AllReports";
import AllTips from "../admin/pages/AllTips";
import PrivateRoute from "../context/PrivateRoute";
import Tips from "../Pages/Tips";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true, 
        element: <HomePage />
      },
      {
        path: "complaints", 
        element: <Complaints />
      },
      {
        path: "report",
        element: <ReportComplaint />
      },{
        path: "tips",
        element: <Tips />
      }
    ]
  },
    {
      path: "/admin-dashboard",
      element:<PrivateRoute>
        <AdminLayout/>
      </PrivateRoute>,
      children:[
        {
          index:true,
          element:<PrivateRoute>
            <Dashboard/>
          </PrivateRoute>
        },{
          path:"all-reports",
          element:<PrivateRoute>
            <AllReports></AllReports>
          </PrivateRoute>
        },{
          path:"all-tips",
          element: <PrivateRoute>
            <AllTips></AllTips>
          </PrivateRoute>
        }
      ]

    },
  {
    path:"/admin-login",
    element:<Login />
  }
]);
