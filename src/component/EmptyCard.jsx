import React from "react";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { uiActions } from "../action/uservalue";
const EmptyCard = ({ type, value, rowPos }) => {
  const dispatch = useDispatch();
  const setMainList = (array) => {
    dispatch(uiActions.setMainList(array));
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "image",
    drop: (item) => image(item.id, item.type, item.draggable, item.rarity),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));

  const image = (id, ty, draggable, rarity) => {
    let count;
    if (rowPos >= 0) {
      count = 4 * rowPos + value;
    }
    if (draggable) {
      if (ty === "genesis" && type === "genesis") {
        setMainList({
          id: id,
          type: type,
          draggable: false,
          rarity: rarity,
          row: count,
        });
        dispatch(uiActions.setInventoryNull(id));
      } else if (ty !== "genesis" && type !== "genesis") {
        setMainList({
          id: id,
          type: type,
          draggable: false,
          rarity: rarity,
          row: count,
        });
        dispatch(uiActions.setInventoryNull(id));
      }
    }
  };
  return (
    <>
      <div className="emptyObject m-2 click" ref={drop}>
        <img
          src={type === "genesis" ? "./emptygenesis.png" : "./emptygen2.png"}
          className="emptyBackground"
          alt="empty"
        />
        <div
          className="position-relative img-cnt"
          style={{ visibility: "hidden" }}
        >
          <p className="text-white">Genesis</p>
          <p className="text-grrenery">Jira#17</p>
        </div>
      </div>
    </>
  );
};

export default EmptyCard;
