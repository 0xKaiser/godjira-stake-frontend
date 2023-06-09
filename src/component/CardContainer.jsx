/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Card from "./Card";
import EmptyCard from "./EmptyCard";
import { useSelector } from "react-redux";
function CardContainer({ row, setRow }) {
  const mainList = useSelector((state) => state.UI.mainList);
  const bagWise = useSelector((state) => state.UI.bagwise);
  useEffect(() => {
    setRow(() => {
      const temp = [];
      for (let i = 0; i <= mainList.length / 4; i++) {
        temp.push(i);
      }
      return temp;
    });
  }, [mainList]);
  let col = ["genesis", "gen 2", "gen 2", "gen 2"];

  return (
    <>
      {row.map((item, value) => (
        <div className="godjiraContainer my-2 align-items-center">
          {col.map((element, key) => (
            <>
              {mainList[item * col.length + key] && key === 3 ? (
                <>
                  <Card
                    id={mainList[item * col.length + key].id}
                    type={mainList[item * col.length + key].type}
                    newItem={true}
                    row={mainList[item * col.length + key].row}
                    rarity={mainList[item * col.length + key].rarity}
                  />
                  <div className="mx-3">
                    <h2 className="text-grreneryRoboto text-bold text-center">
                      {bagWise[item] && bagWise[item]?.totalMultiplier
                        ? bagWise[item]?.totalMultiplier.toFixed(2) + "x"
                        : "0.00x"}
                    </h2>
                    <h5 className="text-white text-bold">Multiplier</h5>
                    {row.length - 1 === value ? (
                      <button
                        className="staking_button"
                        onClick={() => {
                          setRow([...row, row.length]);
                        }}
                      >
                        Add Row
                      </button>
                    ) : (
                      <div className="boxz"></div>
                    )}
                  </div>
                </>
              ) : mainList[item * col.length + key] && key !== 3 ? (
                <Card
                  id={mainList[item * col.length + key].id}
                  type={mainList[item * col.length + key].type}
                  newItem={true}
                  row={mainList[item * col.length + key].row}
                  rarity={mainList[item * col.length + key].rarity}
                />
              ) : !mainList[item * col.length + key] && key === 3 ? (
                <>
                  <EmptyCard
                    type={key === 0 ? "genesis" : "gen 2"}
                    value={key}
                    rowPos={value}
                  />
                  <div className="mx-3">
                    <h2 className="text-grreneryRoboto text-bold text center">
                      {bagWise[item] && bagWise[item]?.totalMultiplier
                        ? bagWise[item]?.totalMultiplier.toFixed(2) + "x"
                        : "0.00x"}
                    </h2>
                    <h5 className="text-white text-bold">Multiplier</h5>
                    {row.length - 1 === value ? (
                      <button
                        className="staking_button"
                        onClick={() => {
                          setRow([...row, row.length]);
                        }}
                      >
                        Add Row
                      </button>
                    ) : (
                      <div className="boxz"></div>
                    )}
                  </div>
                </>
              ) : (
                <EmptyCard
                  type={key === 0 ? "genesis" : "gen 2"}
                  value={key}
                  rowPos={value}
                />
              )}
            </>
          ))}
        </div>
      ))}
    </>
  );
}

export default CardContainer;
