import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "UI",
  initialState: {
    isLogin: false,
    arrayList: [],
    mainList: [],
    inventoryList: [],
    isOpen: false,
    row: [0],
    searchArray: [],
    searchList: [],
    totalUnstake: [],
    totalUnstake2: [],
    totalStakedBags: 0,
    bagitems: [],
    newStaking: [],
    filterList: [],
    genisisRarity: [],
    gen2Rarity: [],
    stakedGenisisRarity: [],
    stakedGen2Rarity: [],
    bagwise:[]
  },
  reducers: {
    toggle(state = true) {
      state.isLogin = true;
    },
    setBagItems(state, action) {
      state.bagitems = action.payload;
    },
    setGenisisRarity(state, action) {
      state.genisisRarity = action.payload;
    },
    setGen2Rarity(state, action) {
      state.gen2Rarity = action.payload;
    },
    setStakedGenisisRarity(state, action) {
      state.stakedGenisisRarity = action.payload;
    },
    setStakedGen2Rarity(state, action) {
      state.stakedGen2Rarity = action.payload;
    },
    setTotalStakedBags(state, action) {
      state.totalStakedBags = action.payload;
    },
    setTotalunstake(state, action) {
      let n = action.payload;
      let m = n.map((n, index) => ({
        id: n,
        type: "genesis",
        draggable: true,
        rarity: state.genisisRarity[index] !== 1 ? "1/1" : "",
      }));
      state.totalUnstake = m;
      state.inventoryList = [...state.inventoryList, ...m];
    },
    setRow(state) {
      state.row = [...state.row, state.row.length];
    },
    setTotalunstake2(state, action) {
      let n = action.payload;
      let m = n.map((n, index) => ({
        id: n,
        type: "gen 2",
        draggable: true,
        rarity:
          state.gen2Rarity[index] === 1
            ? "common"
            : state.gen2Rarity[index] === 2
            ? "rare"
            : state.gen2Rarity[index] === 3
            ? "legendary"
            : "common",
      }));
      state.totalUnstake2 = m;
      state.inventoryList = [...state.inventoryList, ...m];
    },

    setArrayList(state, action) {
      state.arrayList = [...state.arrayList, action.payload];
    },
    setInventoryList(state, action) {
      state.inventoryList.push(action.payload);
    },
    setMainList(state, action) {
      state.mainList[action.payload.row] = action.payload;
      if (4 * state.totalStakedBags.length > action.payload.row) {
        state.newStaking[action.payload.row] = {
          ...action.payload,
          bagId: state.totalStakedBags[parseInt(action.payload.row / 4)],
        };
      } else {
        state.newStaking[action.payload.row] = {
          ...action.payload,
          bagId: 0,
        };
      }
      state.row = [];
      for (let i = 0; i <= state.mainList.length; i++) {
        state.row.push(i);
      }
    },
    setSearchList(state, action) {
      state.searchList = action.payload;
    },
    setAgainSearchList(state, action) {
      state.searchList = action.payload;
    },
    setFilterhList(state, action) {
      state.filterList = [...state.filterList, action.payload];
    },
    setAgainfilterList(state, action) {
      state.filterList = action.payload;
    },
    setSearchArray(state, action) {
      state.searchArray = action.payload;
    },
    setInitial(state = false) {
      state.isLogin = false;
      state.newStaking = [];
      state.row = [0];
      state.mainList = [];
      state.userData = null;
      let list = [];
      for (let i = 0; i < state.bagitems.length; i++) {
        let count = 0;
        if (state.bagitems[i].gen) {
          count += 1;
          list.push({
            id: state.bagitems[i].gen,
            type: "genesis",
            draggable: true,
            bagid: state.bagitems[i].bagId,
            rarity: state.bagitems[i].genisisBagRarity !== 1 ? "1/1" : "",
          });
        } else {
          count += 1;
          list.push(null);
        }
        if (state.bagitems[i].gen2.length) {
          state.bagitems[i].gen2.forEach((item, index) => {
            count += 1;
            list.push({
              id: item,
              type: "gen 2",
              draggable: true, 
              bagid: state.bagitems[i].bagId,
              rarity:
                state.bagitems[i].gen2Rarity[index] === 1
                  ? "common"
                  : state.bagitems[i].gen2Rarity[index] === 2
                  ? "rare"
                  : state.bagitems[i].gen2Rarity[index] === 3
                  ? "legendary"
                  : "",
            });
          });
        }
        while (count < 4) {
          list.push(null);
          count += 1;
        }
      }
      state.mainList = [];
      state.mainList = [...state.mainList, ...list];
      state.inventoryList = [];
      state.inventoryList = [
        ...state.inventoryList,
        ...state.totalUnstake,
        ...state.totalUnstake2,
      ];
    },
    setIsOpen(state, action) {
      state.isOpen = action.payload;
    },
    setNullValue(state, action) {
      state.mainList = state.mainList.filter(
        (item) => item.id !== action.payload
      );
    },
    setInventoryNull(state, action) {
      state.inventoryList = state.inventoryList.filter(
        (item) => item.id !== action.payload
      );
    },
    setBagwise(state, action) {
      state.bagwise = action.payload
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
