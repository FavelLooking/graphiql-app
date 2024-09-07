import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HistoryState, RouteQuery } from "./historySlice.interface";

const initialState: HistoryState = {
  queries: [],
};

const historySlice = createSlice({
  name: "history",
  initialState: initialState,
  reducers: {
    saveQuery: (state, action: PayloadAction<RouteQuery>) => {
      state.queries.push(action.payload);
    },
  },
});

export const { saveQuery } = historySlice.actions;
export default historySlice.reducer;
