import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthState = {};

export const initialAuthState: AuthState = {};

const AuthSlice = createSlice({
  name: "Auth",
  initialState: initialAuthState,
  reducers: {
    signInWithGoogle: (_, _action: PayloadAction<void>) => {},
    signOut: (_, _action: PayloadAction<void>) => {},
    refreshProfile: (_, _action: PayloadAction<void>) => {},
  },
});

export const AuthActions = AuthSlice.actions;

export default AuthSlice;
