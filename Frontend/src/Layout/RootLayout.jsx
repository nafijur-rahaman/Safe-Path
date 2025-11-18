import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";


const RootLayout = () => {
  return (
    <div>
      <Navbar />
    <div className="max-w-7xl mx-auto">
          <Outlet></Outlet>
    </div>
    </div>
  );
};

export default RootLayout;
