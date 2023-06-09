/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "../style/Index.css";
import { useNavigate } from "react-router-dom";
import {
  gen2IsInitialised,
  genIsInitialised,
  isApprovalForAllGen,
  isApprovalForAllGen2,
  providerHandler,
  setApprovalForAllGen,
  setApprovalForAllGen2,
  setGen2Rarity,
  setGenesisRarity,
  totalUnstakedTokensGen,
  totalUnstakedTokensGen2,
  totalBags,
  bagsDetails,
  gen2Tokens,
  getGenisisRarity,
  getGen2Rarity,
} from "../web3/contractInteraction";
import { uiActions } from "../action/uservalue";
import { useDispatch } from "react-redux";
import { useMetaMask } from "metamask-react";
import logo from "../assets/jirahype.gif";
import axios from "axios";
import moment from "moment";

const Index = () => {
  const { account } = useMetaMask();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      navigate("/staking_options");
    }
  }, [account]);

  const [allGen, setAllGen] = useState(true);
  const [allGen2, setAllGen2] = useState(true);
  const [initButtonGen, setInitButtonGen] = useState(true);
  const [initButtonGen2, setInitButtonGen2] = useState(true);
  const [initGen, setinitGen] = useState([]);
  const [initGen2, setinitGen2] = useState([]);
  const [update, setUpdate] = useState(true);
  const [loader, setLoader] = useState(false);
  const [allCheck, setAllCheck] = useState();
  const [buttonCheck, setButtonCheck] = useState(false);
  const [bagGenisisRarity, setBagGenisisRarity] = useState([]);
  const bagGetGenisisRarity = async (arr) => {
    let bagItems = [];
    const config = {
      method: "post",
      url: "https://godjirastaking.0xytocin.ml/rarity/genarray",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        tokenId: [arr],
      }),
    };

    await axios(config)
      .then(({ data }) => {
        bagItems = data.rarity;
      })
      .catch((error) => {
        console.warn(error);
      });
    return bagItems;
  };

  const bagGen2Rarity = async (arr) => {
    let bagItems = [];
    const config = {
      method: "post",
      url: "https://godjirastaking.0xytocin.ml/rarity/gen2array",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        tokenId: arr,
      }),
    };

    await axios(config)
      .then(({ data }) => {
        bagItems = data.rarity;
      })
      .catch((error) => {
        console.warn(error);
      });
    return bagItems;
  };

  const checkReload = () => {
    if (allGen && allGen2 && initButtonGen && initButtonGen2) {
      setUpdate(!update);
    }
  };
  useEffect(() => {
    checkReload();
  }, [buttonCheck]);
  const genisisRarity = (val) => {
    dispatch(uiActions.setGenisisRarity(val));
  };
  const gen2Rarity = (val) => {
    dispatch(uiActions.setGen2Rarity(val));
  };

  const calculateTime =  (lastStateChange)=>{
    const now = moment(new Date())
    const lastChange = moment.unix(lastStateChange)
    const hoursPassed = now.diff(lastChange, 'minutes')
    const timeLeft = (24*60)-hoursPassed%(24*60)
    const nextUpdate = now.add(timeLeft,'minutes').unix()
    return nextUpdate
  }
  const bagItems = async (bags) => {
    const itemList = [];
    for (let i = 0; i < bags.length; i++) {
      let n = await bagsDetails(bags[i]);
      let genId = n.genTokenId.toNumber();
      let genisisBagRarity = await bagGetGenisisRarity(genId);
      let m = await gen2Tokens(bags[i]);
      let gen2BagRarity = await bagGen2Rarity(m);
      let nextUpdate = calculateTime(n.lastStateChange.toNumber());
      const x = {
        bagId: bags[i],
        gen: genId,
        genisisBagRarity: genisisBagRarity[0],
        gen2: m,
        gen2Rarity: gen2BagRarity,
        lastStateChange: n.lastStateChange.toNumber(),
        nextUpdate: nextUpdate
      };
      itemList.push(x);
    }
    return itemList;
  };

  useEffect(() => {
    const approvebuttoncheck = async () => {
      setLoader(true);
      await providerHandler();
      const temp5 = await isApprovalForAllGen();
      const temp6 = await isApprovalForAllGen2();
      const temp = await totalUnstakedTokensGen(); //Genisis
      await getGenisisRarity(temp, genisisRarity);
      if (temp.length !== 0) {
        setAllGen(temp5);
      } else {
        setAllGen(true);
      }
      const temp2 = await totalUnstakedTokensGen2(); //Gen2 list for inventory
      await getGen2Rarity(temp2, gen2Rarity);
      if (temp2.length !== 0) {
        setAllGen2(temp6);
      } else {
        setAllGen2(true);
      }
      dispatch(uiActions.setTotalunstake(temp));
      dispatch(uiActions.setTotalunstake2(temp2));
      const temp3 = await genIsInitialised(temp);

      const temp4 = await gen2IsInitialised(temp2);
      setinitGen(temp3);
      setinitGen2(temp4);
      const temp7 = await totalBags();
      dispatch(uiActions.setTotalStakedBags(temp7));
      dispatch(uiActions.setBagItems(await bagItems(temp7))); //It'll return the staked items inside bag
      if (temp3.length !== 0) {
        setInitButtonGen(false);
      } else {
        setInitButtonGen(true);
      }
      if (temp4.length !== 0) {
        setInitButtonGen2(false);
      } else {
        setInitButtonGen2(true);
      }
      if (
        (temp5 || temp.length === 0) &&
        (temp6 || temp2.length === 0) &&
        temp3.length === 0 &&
        temp4.length === 0
      ) {
        setAllCheck(true);
      }
      setLoader(false);
    };
    approvebuttoncheck();
  }, [update, account]);

  if (allCheck) {
    navigate("/main");
  }
  return (
    <>
      <div className="navbar mx-md-5 mt-2">
        <div className="visiblity-hideme">
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
      <div className="landing-page">
        <div className="button-div">
          <div className="brand-logo">
            <img src="./projectgodjira.png" alt="logo missing" />
            <p className="color-white-text">{`Connect Wallet > Approve Genesis & Gen 2 > Initiate Genesis & Gen 2 > Access staking interface`}</p>
          </div>
          {!loader ? (
            <>
              <div className="d-flex justify-content-around align-items-center mt-5">
                <div>
                  <button
                    className={
                      allGen
                        ? "light_button staking_buttos"
                        : "staking_button staking_buttos"
                    }
                    onClick={async () => {
                      setAllGen(true);
                      if (!(await setApprovalForAllGen())) {
                        setAllGen(false);
                      }
                      setButtonCheck(!buttonCheck);
                      //setUpdate(!update);
                    }}
                    disabled={allGen}
                  >
                    Approve your Genesis
                  </button>
                </div>
                <div>
                  <button
                    className={
                      allGen2
                        ? "light_button staking_buttos"
                        : "staking_button staking_buttos"
                    }
                    onClick={async () => {
                      setAllGen2(true);
                      if (!(await setApprovalForAllGen2())) {
                        setAllGen2(false);
                      }
                      setButtonCheck(!buttonCheck);
                    }}
                    disabled={allGen2}
                  >
                    Approve your Gen 2
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-around align-items-center pt-4">
                <div>
                  <button
                    className={
                      initButtonGen
                        ? "light_button staking_buttos"
                        : "staking_button staking_buttos"
                    }
                    onClick={async () => {
                      setInitButtonGen(true);
                      if (!(await setGenesisRarity(initGen))) {
                        setInitButtonGen(false);
                      }
                      setButtonCheck(!buttonCheck);
                    }}
                    disabled={initButtonGen}
                  >
                    Initiate your Genesis
                  </button>
                </div>
                <div>
                  <button
                    className={
                      initButtonGen2
                        ? "light_button staking_buttos"
                        : "staking_button staking_buttos"
                    }
                    onClick={async () => {
                      setInitButtonGen2(true);
                      if (!(await setGen2Rarity(initGen2))) {
                        setInitButtonGen2(false);
                      }
                      setButtonCheck(!buttonCheck);
                    }}
                    disabled={initButtonGen2}
                  >
                    Initiate your Gen 2
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="loading-imageCnt">
              <img
                className="center-block ldg-img"
                src={logo}
                alt="loading..."
              />
              <h1 className="text-center text-white ldg-txt">Loading...</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
