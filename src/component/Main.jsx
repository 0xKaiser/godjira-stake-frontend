import React, { useEffect, useRef, useState } from "react";
import Dashboard from "./Dashboard";
import DashboardHeader from "./DashboardHeader";
import Navbar from "./Navbar";
import { useMetaMask } from "metamask-react";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const { account } = useMetaMask();
    const firstRender = useRef(true);

  const navigate = useNavigate();
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      navigate("/staking_options");
    }
  }, [account]);

  return (
    <>
      <Navbar />
      <DashboardHeader />
      <Dashboard />
    </>
  );
};

export default Main;
