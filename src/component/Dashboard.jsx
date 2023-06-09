/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "../style/Dashboard.css";
import Filter from "./Filter";
import CardContainer from "./CardContainer";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../action/uservalue";
import { stake, unstake } from "../web3/contractInteraction";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  let navigate = useNavigate();
  let mainList = useSelector((state) => state.UI.mainList);
  const [row, setRow] = useState(() => {
    const temp = [];
    for (let i = 0; i <= mainList.length / 4; i++) {
      temp.push(i);
    }
    return temp;
  });
  const addRow = () => {
    setRow([...row, row.length]);
  };
  useEffect(() => {
    setRow(() => {
      const temp = [];
      for (let i = 0; i <= mainList.length / 4; i++) {
        temp.push(i);
      }
      return temp;
    });
  }, [mainList]);
  const initial = () => {
    setRow(() => {
      const temp = [];
      const newList = mainList.filter((item) => item !== null)
      for (let i = 0; i <= newList.length / 4; i++) {
        temp.push(i);
      }
      return temp;
    });
  };
  let newStaking = useSelector((state) => state.UI.newStaking);
  let filterList = useSelector((state) => state.UI.filterList);
  const dispatch = useDispatch();
  const stakeCall = async () => {
    let finalStake = [];
    let bagStake = [];
    const stakeList = newStaking.filter((item) => item !== null);
    const editStake = stakeList.filter((item) => item.bagId !== 0);
    const editBags = [...new Set(editStake.map((item) => item.bagId))];
    for (let i in editBags) {
      const gen = editStake.filter(
        (item) => item.bagId === editBags[i] && item.type === "genesis"
      );
      const gen2 = editStake.filter(
        (item) => item.bagId === editBags[i] && item.type === "gen 2"
      );
      let struct;
      if (gen.length !== 0) {
        struct = [gen[0].id, gen2.map((item) => item.id), 0, 0];
      } else {
        struct = [0, gen2.map((item) => item.id), 0, 0];
      }
      finalStake.push(struct);
      bagStake.push(editBags[i]);
    }

    let newStake = stakeList.filter((item) => item.bagId === 0);
    let newStakeBag = newStake.map((item) =>
      Object.assign({}, item, { newBagId: parseInt(item.row / 4) })
    );
    const newBags = [...new Set(newStakeBag.map((item) => item.newBagId))];

    console.log("stake1", finalStake, bagStake);

    for (let i in newBags) {
      const gen = newStakeBag.filter(
        (item) => item.newBagId === newBags[i] && item.type === "genesis"
      );
      const gen2 = newStakeBag.filter(
        (item) => item.newBagId === newBags[i] && item.type === "gen 2"
      );
      console.log("new gen", gen, gen2);
      let struct;
      if (gen.length !== 0) {
        struct = [gen[0].id, gen2.map((item) => item.id), 0, 0];
      } else {
        struct = [0, gen2.map((item) => item.id), 0, 0];
      }
      finalStake.push(struct);
      bagStake.push(0);
    }

    //console.log("alllist", stakeList, editStake, editBags, newStakeBag,newBags)
    console.log("stake2", finalStake, bagStake);
    if (bagStake.length !== 0) {
      await stake(finalStake, bagStake);
      navigate("/");
    } else {
      toast.error("No token Selected");
    }

    // const genToken = mainList.filter((item) => {if (item.type==="genesis") return item.id}).map((item) => item.id)
    // console.log(genToken);
    // let gen2Tokens = mainList.filter((item) => {if (item.type==="gen 2") return item.id}).map((item) => item.id)
    // console.log(gen2Tokens);
    // if (genToken[0]){
    //   await stake(genToken[0],gen2Tokens)
    // }
    // else{
    //   await stake(0,gen2Tokens)
    // }
  };

  const unstakeCall = async () => {
    let unstakeBagList = [];
    let unstakeGenList = [];
    let unstakeGen2List = [];

    const stakeList = filterList.filter(
      (item) => item !== null && item !== undefined
    );
    const stakeOnly = stakeList.filter(
      (item) => "bagid" in item && item.bagid !== 0
    );
    const unstakeBags = [...new Set(stakeOnly.map((item) => item.bagid))];
    for (let i in unstakeBags) {
      let temp = [];
      const gen = stakeOnly.filter(
        (item) => item.bagid === unstakeBags[i] && item.type === "genesis"
      );
      const gen2 = stakeOnly.filter(
        (item) => item.bagid === unstakeBags[i] && item.type === "gen 2"
      );
      unstakeBagList.push(unstakeBags[i]);
      if (gen.length !== 0) {
        unstakeGenList.push([gen[0].id]);
      } else {
        unstakeGenList.push([0]);
      }
      if (gen2.length !== 0) {
        gen2.forEach((item) => temp.push(item.id));
        unstakeGen2List.push([temp]);
      } else {
        unstakeGen2List.push([[]]);
      }
    }
    if (unstakeGen2List.length === 0) {
      unstakeGen2List = [[[]]];
    }
    await unstake(unstakeBagList, unstakeGenList, unstakeGen2List);
    navigate("/");
  };
  useEffect(() => {
    dispatch(uiActions.setInitial());
  }, []);
  //dispatch(uiActions.setInitial());
  const handleClick = () => {
    dispatch(uiActions.setInitial());
      initial();
  };
  return (
    <div className="dashboardMain">
      <div className="filterMar">
        <Filter />
      </div>
      <div className="width-70">
        <div className="dashboardHeadings">
          <div className="col-6">
            <div className="row">
              <div className="col-5 marlef">
                <p className="mb-0 text-grrenery ">Genesis</p>
                <small className="text-white">(Token Multiplier)</small>
              </div>
              <div className="col-5">
                <p className="mb-0 text-grrenery">Gen 2</p>
                <small className="text-white">(Token Generator)</small>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div>
              <div className="col-sm-12 text-end">
                <button
                  className={
                    newStaking.length === 0 ? "light_button" : "staking_button"
                  }
                  disabled={newStaking.length === 0 ? true : false}
                  onClick={() => {
                    stakeCall();
                  }}
                >
                  Stake
                </button>
                <button
                  className={
                    filterList.filter((item) => item !== undefined).length === 0
                      ? "ms-3 light_button"
                      : "ms-3 staking_button"
                  }
                  onClick={async () => {
                    await unstakeCall().then(() => {
                      window.location.reload(false);
                    });
                  }}
                  disabled={
                    filterList.filter((item) => item !== undefined).length === 0
                      ? true
                      : false
                  }
                >
                  Unstake
                </button>
                <button
                  onClick={handleClick}
                  className={
                    newStaking.length === 0
                      ? "ms-3 light_button"
                      : "ms-3 staking_button"
                  }
                  disabled={newStaking.length === 0 ? true : false}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="dasboardContainer  my-5">
          <CardContainer row={row} setRow={addRow} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
