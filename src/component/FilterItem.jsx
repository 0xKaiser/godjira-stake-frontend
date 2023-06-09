import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../action/uservalue";

const FilterItem = ({ type,searchItem }) => {
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();
  let inventoryList = useSelector((state) => state.UI.inventoryList);
  let searchArray = useSelector((state) => state.UI.searchArray);
  let searchList = useSelector((state) => state.UI.searchList);
  const setSearchArray = (array) => {
    dispatch(uiActions.setSearchArray(array));
  };
  const setSearchList = (array) => {
    console.log(array);
    dispatch(uiActions.setSearchList(array));
  };
  const handleChange = () => {
    if (!checked) {
      const tempList = [...searchList, searchItem];
      const tempArray = [];
      tempList.forEach((element) => {
        tempArray.push(
          ...inventoryList.filter((item) => 
            item.rarity === element.rarity
          )
        );
      });
      setSearchArray(tempArray);
      console.log("temp array",tempArray);
      
      setSearchList([...searchList, searchItem]);
    } else {
      const temp =
        searchArray.length !== 0
          ? searchArray.filter((item) => item.rarity !== searchItem.rarity)
          : [];
      setSearchArray(temp);
      setSearchList(searchList.filter((item) => item.rarity !== searchItem.rarity));
    }
    setChecked(!checked);
  };
  const handleSett = (event) => {
    console.log(`hi`);
    console.log(event.target.checked);
  };
  return (
    <div className="d-flex justify-content-between filter-item">
      <p>{searchItem?.type}</p>
      <input type="checkbox" checked={checked} onChange={handleSett} />
      <span className="checkmark" onClick={handleChange}>
        {checked ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.25 5.9L4.45 9.5L11.75 1"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        ) : (
          <></>
        )}
      </span>
    </div>
  );
};
export default FilterItem;
