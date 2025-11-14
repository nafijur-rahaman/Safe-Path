import { createBrowserRouter } from "react-router"; // must be "react-router-dom"
import RootLayout from "../Layout/RootLayout";
import HomePage from "../Pages/HomePage";
import Complaints from "../Pages/Complaints";
import Report_Complaint from "../Pages/Report_Complaint";
import Stories from "../Pages/Stories"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true, // Home page at "/"
        element: <HomePage />
      },
      {
        path: "complaints", // "/complaints"
        element: <Complaints />
      },
      {
        path: "report",
        element: <Report_Complaint />
      },
      {
        path: "stories",
        element: <Stories />
      }
    ]
  }
]);
