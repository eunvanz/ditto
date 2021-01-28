import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OptionsObject } from "notistack";
import { THEMES, ProjectDoc, ModelDoc } from "../../types";

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
  projectFormModal: ProjectFormModalState;
  signInModal: {
    isVisible: boolean;
  };
  quickModelNameFormModal: QuickModelNameFormModalState;
};

export interface QuickModelNameFormModalState {
  isVisible: boolean;
  model?: ModelDoc;
}

export interface ProjectFormModalState {
  isVisible: boolean;
  project?: ProjectDoc;
}

export const initialUiState: UiState = {
  theme: window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? THEMES.DARK
    : THEMES.LIGHT,
  notifications: [],
  isLoading: false,
  projectFormModal: {
    isVisible: false,
    project: undefined,
  },
  signInModal: {
    isVisible: false,
  },
  quickModelNameFormModal: {
    isVisible: false,
    model: undefined,
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
    receiveProjectFormModal: (
      state,
      action: PayloadAction<ProjectFormModalState>
    ) => {
      state.projectFormModal = action.payload;
    },
    showProjectFormModal: (
      _,
      _action: PayloadAction<ProjectDoc | undefined>
    ) => {},
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
    showDelayedLoading: (_, _action: PayloadAction<number | undefined>) => {},
    receiveQuickModelNameFormModal: (
      state,
      action: PayloadAction<QuickModelNameFormModalState>
    ) => {
      state.quickModelNameFormModal = action.payload;
    },
    showQuickModelNameFormModal: (
      _,
      _action: PayloadAction<ModelDoc | undefined>
    ) => {},
    hideQuickModelNameFormModal: (state, _: PayloadAction<void>) => {
      state.quickModelNameFormModal.isVisible = false;
    },
    clearQuickModelNameFormModal: (state, _action: PayloadAction<void>) => {
      state.quickModelNameFormModal.model = undefined;
    },
  },
});

export const UiActions = UiSlice.actions;

export default UiSlice;
