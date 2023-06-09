import React, { useEffect } from "react";
import "../style/LandingPage.css";
import { useNavigate } from "react-router-dom";
import { useMetaMask } from "metamask-react";
import { toast } from "react-toastify";
import { providerHandler } from "../web3/contractInteraction";

const LnadingPage = () => {
  const navigate = useNavigate();
  const { status, connect, chainId } = useMetaMask();
  useEffect(() => {
    const initialt = async () => {
      if (status === "connected") {
        await providerHandler();
        window.location.pathname === "/" && navigate("/staking_options");
      } else {
        navigate("/");
      }
    };
    initialt();
  }, [navigate, status]);

  const handleConnect = async () => {
    if (chainId === "0x4") {
      await connect()
        .then(() => {
          navigate("/staking_options");
          // Call any functin if connection success
        })
        .catch((err) => {
          console.warn(err);
        });
    } else {
      toast.warning(`You are not connected with Mainnet`);
    }
  };
  return (
    <div className="landing-page">
      <div className="button-div">
        <div className="brand-logo">
          <img src="./projectgodjira.png" alt="logo missing" />
        </div>
        <button className="connect" onClick={handleConnect}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Connect Metamask
        </button>
      </div>
    </div>
  );
};

export default LnadingPage;
