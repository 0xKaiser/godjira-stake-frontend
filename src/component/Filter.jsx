import React from "react";
import FilterItem from "./FilterItem";
import { Icon } from "@iconify/react";
import Card from "./Card";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../action/uservalue";
const Filter = () => {
  const dispatch = useDispatch();
  let inventoryList = useSelector((state) => state.UI.inventoryList);
  let isOpen = useSelector((state) => state.UI.isOpen);
  let searchArray = useSelector((state) => state.UI.searchArray);
  let searchList = useSelector((state) => state.UI.searchList);
  const search = [
    {rarity:"1/1", type:"genesis 1/1"},
    {rarity:"", type:"genesis"},
    {rarity:"legendary", type:"gen 2 legendary"},
    {rarity:"rare", type:"gen 2 rare"},
    {rarity:"common", type:"gen 2 common"},
  ];
  const handleClick = () => {
    dispatch(uiActions.setIsOpen(!isOpen));
  };
  return (
    <div className="filterContainer">
      <div className="d-flex justify-content-between">
        <p className="dashboardHeading">Inventory</p>
        <div className="d-flex filter" onClick={handleClick}>
          <p className="my-1">Filter</p>
          <Icon
            icon={isOpen ? "prime:chevron-up" : "prime:chevron-down"}
            color="white"
            className="my-2"
          />
        </div>
        <div className={isOpen ? "dashboardModal" : "collapse"}>
          {search.map((item, key) => (
            <FilterItem type={item.type} searchItem={item} key={key}  />
          ))}
        </div>
      </div>
      <div className="filterObjects mt-5">
        {searchList.length === 0
          ? inventoryList &&
            inventoryList.map((item) => (
              <div key={Math.random()} className="mb-3 ">
                <Card
                  id={item.id}
                  type={item.type}
                  draggable={item.draggable}
                  rarity={item.rarity}
                />
              </div>
            ))
          : searchArray.map((item) => (
              <div key={Math.random()} className="mb-3 ">
                <Card
                  id={item.id}
                  type={item.type}
                  draggable={item.draggable}
                  rarity={item.rarity}
                />
              </div>
            ))}
      </div>
    </div>
  );
};
export default Filter;
