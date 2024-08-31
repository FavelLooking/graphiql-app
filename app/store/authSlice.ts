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
    },
    clearToken: (state) => {
      state.token = null;
      state.email = null;
      state.expiresIn = null;
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
