import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import historyReducer from "./historySlice";

const createStore = () => {
  const preloadedState = {
    auth: {
      token:
        typeof window !== "undefined" ? localStorage.getItem("token") : null,
      email:
        typeof window !== "undefined" ? localStorage.getItem("email") : null,
      expiresIn:
        typeof window !== "undefined"
          ? Number(localStorage.getItem("expiresIn"))
          : null,
    },
  };

  return configureStore({
    reducer: {
      auth: authReducer,
      history: historyReducer,
    },
    preloadedState,
  });
};

const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
