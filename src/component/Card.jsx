import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../action/uservalue";
import axios from "axios";

const Card = ({ id, type, draggable, newItem, row, rarity }) => {
  const [isClicked, setIsClicked] = useState(false);
  const temp2 = useSelector((state) => state.UI.filterList);
  const temp3 = useSelector((state) => state.UI.mainList);
  const [searchList, setSearchList] = useState(temp2);
  const dispatch = useDispatch();
  useEffect(() => {
    setSearchList(temp2);
  }, [searchList, temp2]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    item: { id: id, type: type, draggable: draggable, rarity: rarity },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const [image, setImage] = useState("./godjira.png");
  const getImage = async (id) => {
    let data;
    if (id) {
      if (type == "gen 2") {
        data = await axios.get(
          "https://api.opensea.io/api/v1/asset/0xedc3ad89f7b0963fe23d714b34185713706b815b/" +
            id
        );
      } else {
        data = await axios.get(
          "https://api.opensea.io/api/v1/asset/0x9ada21a8bc6c33b49a089cfc1c24545d2a27cd81/" +
            id
        );
      }
      setImage(data.data.image_thumbnail_url);
    }
  };
  useEffect(() => {
    getImage(id);
  }, []);

  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele.id !== value;
    });
  }

  const handleClick = (val) => {
    if (!isClicked) {
      const temp = temp3.find(
        (value) => value && value.id === id && value.draggable === true
      );
      dispatch(uiActions.setFilterhList(temp));
    } else {
      var result = arrayRemove(searchList, val);
      dispatch(uiActions.setAgainfilterList(result));
    }
  };
  // !TODO this function is execution too slow becuase it'll render for every card
  // getType(id);
  return (
    <>
      <div
        draggable
        className={`card filterObject m-2 ${
          isClicked
            ? "clicked"
            : row === 0 || row
            ? "red-border"
            : newItem
            ? "clickeds"
            : ""
        }`}
        onClick={() => {
          setIsClicked(!isClicked);
          handleClick(id, type);
        }}
      >
        <div className="card-body p-0 px-0">
          <div className="card-img">
            <img
              ref={drag}
              src={image}
              alt="card"
              className={
                isClicked
                  ? "filterBackground"
                  : newItem
                  ? "filterBackground"
                  : "filterBackground"
              }
            />
          </div>
          <div className="mar-neg mt-2">
            <h5 className="text-grrenery text-center mb-0 text-capitalize mb-0 pb-0">{`${type} #${id}`}</h5>
            {rarity === "" ? (
              <p className="text-white" style={{ visibility: "hidden" }}>
                noText
              </p>
            ) : (
              <p className="text-white text-capitalize">{rarity}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
