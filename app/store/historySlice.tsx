import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RouteQuery {
  query: string;
  route: string;
}

interface HistoryState {
  queries: RouteQuery[];
}

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
