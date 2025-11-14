import React from "react";
import MapView from "../components/MapViiew";
import HamburgerMenu from "../components/HamburgerMenu";

const HomePage = () => {
  return (
    <div>
      <div className="App">
        <HamburgerMenu />
        <MapView />
      </div>
    </div>
  );
};

export default HomePage;
