import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ProgressState = string[];

export const initialProgressState: ProgressState = [];

const ProgressSlice = createSlice({
  name: "Progress",
  initialState: initialProgressState,
  reducers: {
    startProgress: (state, action: PayloadAction<string>) => {
      return [...state, action.payload];
    },
    finishProgress: (state, action: PayloadAction<string>) => {
      return state.filter((progress) => progress !== action.payload);
    },
  },
});

export default ProgressSlice;
