import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { THEMES } from "../../types";

export type UiState = {
  theme: THEMES;
};

export const initialUiState: UiState = {
  theme: THEMES.LIGHT,
};

const UiSlice = createSlice({
  name: "Ui",
  initialState: initialUiState,
  reducers: {
    receiveTheme: (state, action: PayloadAction<THEMES>) => {
      state.theme = action.payload;
    },
  },
});

export default UiSlice;
