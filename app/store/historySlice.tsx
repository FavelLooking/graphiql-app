import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: HistoryState = {
  queries: [
    {
      query: "",
      route: "",
    },
  ],
};

export const historySlice = createSlice({
  name: "historyState",
  initialState: initialState,
  reducers: {
    saveQuery: (state, action: PayloadAction<RouteQuery>) => {
      state.queries.push(action.payload);
    },
  },
});

export const { saveQuery } = historySlice.actions;
