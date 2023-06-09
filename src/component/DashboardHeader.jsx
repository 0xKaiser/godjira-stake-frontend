import moment from "moment";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../action/uservalue";
import "../style/DashboardHeader.css";
import {
  COMMON_GENESIS,
  COMMON_GEN_2,
  LEGENDARY_GENESIS,
  LEGENDARY_GEN_2,
  LEGENDARY_GEN_2_FALSE,
  RARE_GEN_2,
  THREE_GEN_2_RATE_MULTIPLIER,
  TWO_GEN_2_RATE_MULTIPLIER,
} from "../utils/constants";
import {
  providerHandler,
  jiraBalance,
  unclaimedBalance,
  claim,
} from "../web3/contractInteraction";

const DashboardHeader = () => {
  const [show, setShow] = useState(false);
  const mainList = useSelector((state) => state.UI.mainList);
  const bagsData = useSelector((state) => state.UI.bagitems);
  const [wallet, setWallet] = useState(0);
  const [unClaimed, setUnClaimed] = useState(0);
  const dispatch = useDispatch();

  const bagWise = (bag) => {
    let genesisMultiplier =
      bag.length > 0 && bag[0]?.rarity === ""
        ? COMMON_GENESIS
        : bag[0]?.rarity === "1/1"
        ? LEGENDARY_GENESIS
        : 1;
    const gen2Items = bag.slice(1, 4);
    const mapArray = gen2Items.map((item) => {
      if (item?.rarity) {
        if (item?.rarity === "common") {
          item = { ...item, genValue: COMMON_GEN_2 };
        } else if (item?.rarity === "rare") {
          item = { ...item, genValue: RARE_GEN_2 };
        } else if (item?.rarity === "legendary") {
          item = { ...item, genValue: LEGENDARY_GEN_2 };
        }
      } else if (item?.rarity === "") {
        item = { ...item, genValue: LEGENDARY_GEN_2_FALSE };
      }
      return item;
    });
    const filteredArray =
      mapArray?.length > 0
        ? mapArray.filter(
            (filterItem) => filterItem !== null && filterItem !== undefined
          )
        : [];
    const gen2Length = filteredArray.length;
    const totalEarnings =
      gen2Length === 1
        ? genesisMultiplier * filteredArray[0].genValue
        : gen2Length === 2
        ? TWO_GEN_2_RATE_MULTIPLIER *
          genesisMultiplier *
          filteredArray?.reduce((a, c) => a + c.genValue, 0)
        : gen2Length === 3
        ? THREE_GEN_2_RATE_MULTIPLIER *
          genesisMultiplier *
          filteredArray?.reduce((a, c) => a + c.genValue, 0)
        : 0;
    const totalMultiplier =
      gen2Length === 1 || gen2Length === 0
        ? genesisMultiplier
        : gen2Length === 2
        ? TWO_GEN_2_RATE_MULTIPLIER * genesisMultiplier
        : gen2Length === 3
        ? THREE_GEN_2_RATE_MULTIPLIER * genesisMultiplier
        : 0;
    return { totalEarnings: totalEarnings.toFixed(2), totalMultiplier };
  };

  const sliceIntoChunks = (arr, chunkSize) => {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
    }
    return res;
  };

  const bags = () => {
    const totalBags = sliceIntoChunks(mainList, 4);
    const total = totalBags.map((bag) => bagWise(bag));
    var totalEarnings = total.reduce(
      (a, c) => parseFloat(a) + parseFloat(c.totalEarnings),
      0
    );

    dispatch(uiActions.setBagwise(total));
    return totalEarnings.toFixed(2);
  };

  const getData = async () => {
    await providerHandler();
    setWallet(await jiraBalance());
    setUnClaimed(await unclaimedBalance());
  };
  const countdown = (elementName, minutes, seconds) => {
    var element, endTime, hours, mins, msLeft, time;

    function twoDigits(n) {
      return n <= 9 ? "0" + n : n;
    }

    function updateTimer() {
      msLeft = endTime - +new Date();
      if (msLeft < 1000) {
        element.innerHTML = "Refresh page now!";
      } else {
        time = new Date(msLeft);
        hours = time.getUTCHours();
        mins = time.getUTCMinutes();
        if (mins < 1) {
          window.location.reload();
        } else {
          element.innerHTML =
            "Balance updates in: " +
            (hours
              ? twoDigits(hours) + "h " + twoDigits(mins) + "m. "
              : `0h ${mins}m`);
        }
        setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
      }
    }

    element = document.getElementById(elementName);
    endTime = +new Date() + 1000 * (60 * minutes + seconds) + 500;
    updateTimer();
  };

  useEffect(() => {
    console.log(bags());
  }, [mainList]);

  useEffect(() => {
    const utcStart = Math.floor(new Date().getTime() / 1000);
    let timerTime = Math.min.apply(
      null,
      bagsData.map((value) => value.nextUpdate)
    );
    if ((timerTime - utcStart) / 60 === 0) {
      window.location.reload();
    } else {
      countdown("time", (timerTime - utcStart) / 60, 0);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [unClaimed]);
  return (
    <div className=" mx-sm-5  ">
      {show && (
        <div className="modalDetails">
          <div className="d-flex">
            <div className="boxxx">
              <div className="d-flex">
                <p className="bold">Genesis 1/1: </p>
                <p>4x multiplier</p>
              </div>
              <div className="d-flex">
                <p className="bold">Genesis: </p>
                <p>2x multiplier</p>
              </div>
              <div className="d-flex">
                <p className="bold">Gen 2 Legendary: </p>
                <p>8 $JIRA/day</p>
              </div>
              <div className="d-flex">
                <p className="bold">Gen 2 Rare: </p>
                <p>6 $JIRA/day</p>
              </div>
            </div>
            <div className="ml-5">
              <div className="d-flex">
                <p className="bold">Gen 2 Common: </p>
                <p>4 $JIRA/day</p>
              </div>
              <div className="d-flex">
                <p className="bold">Titan: </p>
                <p>16 $JIRA/day</p>
              </div>
              <div className="d-flex">
                <p className="bold">Meka: </p>
                <p>16 $JIRA/day</p>
              </div>
              <div className="d-flex">
                <p className="bold">Hybrid: </p>
                <p>16 $JIRA/day</p>
              </div>
            </div>
          </div>
          <div className="arrow-down"></div>
        </div>
      )}
      <div className="dashboardHeaderContainer">
        <div className="wallet-detail1 mx-sm-2">
          <p className="wallet">Wallet</p>
          <div className="d-flex mb-0 pb-0">
            <p className="bold">Balance: </p>
            <p className="mb-0">{wallet} $JIRA</p>
          </div>
          <a
            href="https://jiratempmarketplace.projectgodjira.io/"
            className="link text-secondary mt-0 pt-0"
          >
            Go to marketplace
          </a>
        </div>
        <div className="wallet-detail2 mx-sm-2">
          <p className="tokenInfo d-flex align-items-center">
            Token Reward Info
            <img
              src="./question.svg"
              className="question pointer-cursor"
              onMouseEnter={() => setShow(true)}
              onMouseLeave={() => setShow(false)}
              alt=""
            />
          </p>
          <div className="d-flex">
            <p className="bold">Daily Reward: </p>
            <p className="mb-0">{`${bags()} `}$JIRA</p>
          </div>
          <p style={{ fontSize: "14px" }}>(Based on current configuration)</p>
        </div>
        <div className="wallet-detail3 mx-sm-2">
          <p className="tokenInfo d-flex">Unclaimed Balance</p>
          <div className="d-flex justify-content-between">
            <div>
              <p className="mb-0">{parseFloat(unClaimed).toFixed(2)} $JIRA</p>
              <p className="time" id="time"></p>
            </div>
            <div>
              <button
                className={
                  parseFloat(unClaimed) <= 0
                    ? "light_button"
                    : "daashboardButton"
                }
                onClick={async () => await claim()}
                disabled={parseFloat(unClaimed) <= 0 ? true : false}
              >
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
