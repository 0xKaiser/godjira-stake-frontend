import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "./uservalue";

const store = configureStore({
  reducer: {
    UI: uiSlice.reducer,
  },
});

export default store;
