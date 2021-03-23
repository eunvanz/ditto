import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ROUTE from "../../paths";

export type ErrorState = {
  retryPath?: string;
};

export const initialErrorState: ErrorState = {
  retryPath: undefined,
};

export interface ErrorPayload {
  error: Error;
  retryPath?: string;
  isAlertOnly?: boolean;
}

const ErrorSlice = createSlice({
  name: "Error",
  initialState: initialErrorState,
  reducers: {
    catchError: (state, action: PayloadAction<ErrorPayload>) => {
      const { retryPath } = action.payload;
      if (retryPath && ![ROUTE.ERROR, ROUTE.NETWORK_ERROR].includes(retryPath)) {
        // 이미 오류페이지에 진입한 상태에서의 retryPath는 무시
        state.retryPath = action.payload.retryPath;
      }
    },
    clearRetryPath: (state) => {
      state.retryPath = undefined;
    },
  },
});

export const ErrorActions = ErrorSlice.actions;

export default ErrorSlice;
