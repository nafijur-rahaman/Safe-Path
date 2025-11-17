import { createBrowserRouter } from "react-router"; 
import RootLayout from "../Layout/RootLayout";
import HomePage from "../Pages/HomePage";
import Complaints from "../Pages/Complaints";
import ReportComplaint from "../Pages/ReportComplaint";
import Stories from "../Pages/Stories"

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
  }
]);
