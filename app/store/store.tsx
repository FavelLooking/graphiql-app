import { configureStore } from "@reduxjs/toolkit";
import { historySlice } from "./historySlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    history: historySlice.reducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
