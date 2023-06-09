import { useMetaMask } from "metamask-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Navbar.css";
import { providerHandler } from "./../web3/contractInteraction";

const Navbar = () => {
  const { account } = useMetaMask();
  const [wallet, setWallet] = useState();
  useEffect(() => {
    const callMe = async () => {
      setWallet(await providerHandler());
    };
    callMe();
  }, []);
  
  return (
    <div className="navbar mx-md-5 mt-2">
      <div>
        <a className="navbar-brand" href="/">
          <img src={"./projectgodjira.png"} width="285" alt="" />
        </a>
        <p className="dashboard">dashboard</p>
      </div>
      <div className="detail">
        <div className="wallet-container">
          <p>
            <img src="./check.svg" alt="" /> Wallet connected
          </p>
        </div>
        <div className="navButton">
          <img src={"./wallet.svg"} alt="wallet" className="wallet" />
          <p className="connection">{`${account?.slice(
            0,
            5
          )}...${account?.slice(38)}`}</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
