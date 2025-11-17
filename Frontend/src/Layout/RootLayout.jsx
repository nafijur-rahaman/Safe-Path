import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";


const RootLayout = () => {
  return (
    <div>
      <Navbar />
    <div className="pt-20 px-4 md:px-8 lg:px-16">
          <Outlet></Outlet>
    </div>
    </div>
  );
};

export default RootLayout;
