import React from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { NavWrapper } from "./components/layout/nav-wrapper";

function App() {
  return (
    <NavWrapper>
      <Outlet />
      <Toaster />
    </NavWrapper>
  );
}

export default App;
