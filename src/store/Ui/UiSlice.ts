import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OptionsObject } from "notistack";
import { THEMES, ProjectDoc } from "../../types";

export interface Notification {
  key: React.ReactText;
  message: React.ReactNode;
  options?: OptionsObject;
  dismissed?: boolean;
}

export type UiState = {
  theme: THEMES;
  notifications: Notification[];
  isLoading: boolean;
  projectFormModal: {
    isVisible: boolean;
    project?: ProjectDoc;
  };
  signInModal: {
    isVisible: boolean;
  };
};

export const initialUiState: UiState = {
  theme: THEMES.LIGHT,
  notifications: [],
  isLoading: false,
  projectFormModal: {
    isVisible: false,
    project: undefined,
  },
  signInModal: {
    isVisible: false,
  },
};

const UiSlice = createSlice({
  name: "Ui",
  initialState: initialUiState,
  reducers: {
    receiveTheme: (state, action: PayloadAction<THEMES>) => {
      state.theme = action.payload;
    },
    receiveNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload as any);
    },
    removeNotification: (state, action: PayloadAction<React.ReactText>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.key !== action.payload
      );
    },
    showNotification: (
      _,
      _action: PayloadAction<{
        message: string;
        type?: "default" | "warning" | "success" | "error" | "info";
      }>
    ) => {},
    showLoading: (state, _: PayloadAction<void>) => {
      state.isLoading = true;
    },
    hideLoading: (state, _: PayloadAction<void>) => {
      state.isLoading = false;
    },
    showProjectFormModal: (
      state,
      action: PayloadAction<ProjectDoc | undefined>
    ) => {
      if (action.payload) {
        state.projectFormModal.project = action.payload;
      }
      state.projectFormModal.isVisible = true;
    },
    hideProjectFormModal: (state, _: PayloadAction<void>) => {
      state.projectFormModal.isVisible = false;
    },
    clearProjectFormModal: (state, _action: PayloadAction<void>) => {
      state.projectFormModal.project = undefined;
    },
    showSignInModal: (state, _: PayloadAction<void>) => {
      state.signInModal.isVisible = true;
    },
    hideSignInModal: (state, _: PayloadAction<void>) => {
      state.signInModal.isVisible = false;
    },
  },
});

export const UiActions = UiSlice.actions;

export default UiSlice;
