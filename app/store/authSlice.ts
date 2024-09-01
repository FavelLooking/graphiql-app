import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  email: string | null;
  expiresIn: number | null;
}

const initialState: AuthState = {
  token: null,
  email: null,
  expiresIn: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (
      state,
      action: PayloadAction<{ token: string; email: string; expiresIn: number }>
    ) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.expiresIn = action.payload.expiresIn;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("email", action.payload.email);
        localStorage.setItem("expiresIn", action.payload.expiresIn.toString());
        console.log("Token set in localStorage:", action.payload.token);
      }
    },
    clearToken: (state) => {
      state.token = null;
      state.email = null;
      state.expiresIn = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("expiresIn");
        console.log("Token cleared from localStorage");
      }
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
