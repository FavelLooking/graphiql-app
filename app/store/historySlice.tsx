import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HistoryState, RouteQuery } from "./historySlice.interface";

const initialState: HistoryState = {
  queries: [
    {
      query: "",
      route: "",
    },
  ],
};

const historySlice = createSlice({
  name: "history",
  initialState: initialState,
  reducers: {
    addQuery: (state, action: PayloadAction<RouteQuery>) => {
      state.queries.push(action.payload);
    },
  },
});

export const { addQuery } = historySlice.actions;
export default historySlice.reducer;
