import { configureStore } from "@reduxjs/toolkit";
import { historySlice } from "./historySlice";

export const store = configureStore({
  reducer: historySlice.reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
