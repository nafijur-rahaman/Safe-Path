import { createBrowserRouter } from "react-router"; 
import RootLayout from "../Layout/RootLayout";
import HomePage from "../Pages/HomePage";
import Complaints from "../Pages/Complaints";
import ReportComplaint from "../Pages/ReportComplaint";
import Stories from "../Pages/Stories"
import Login from "../Pages/Login";
import AdminLayout from "../admin/AdminLayout";
import Dashboard from "../admin/pages/Dashboard";
import AllReports from "../admin/pages/AllReports";
import AllTips from "../admin/pages/AllTips";

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
      },
      {
        path: "stories",
        element: <Stories />
      }
    ]
  },
    {
      path: "/admin",
      element:<AdminLayout></AdminLayout>,
      children:[
        {
          path:"dashboard",
          element:<Dashboard/>
        },{
          path:"all-reports",
          element:<AllReports></AllReports>
        },{
          path:"all-tips",
          element: <AllTips></AllTips>
        }
      ]

    },
  {
    path:"/admin-login",
    element:<Login />
  }
]);
