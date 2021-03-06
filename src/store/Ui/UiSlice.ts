import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OptionsObject } from "notistack";
import { CodeModalProps } from "../../components/CodeModal/CodeModal";
import {
  ExampleFormModalProps,
  EXAMPLE_TYPES,
} from "../../components/ExampleFormModal/ExampleFormModal";
import { MockDataModalProps } from "../../components/MockDataModal/MockDataModal";
import {
  THEMES,
  ProjectDoc,
  ModelDoc,
  GroupDoc,
  RequestDoc,
  MemberRole,
  EnumerationDoc,
  ModelFieldDocLike,
} from "../../types";

export interface Notification {
  key: React.ReactText;
  message: React.ReactNode;
  options?: OptionsObject;
  dismissed?: boolean;
}

export type UiState = {
  theme: THEMES;
  notifications: Notification[];
  loadingTasks: string[];
  isLoading: boolean;
  projectFormModal: ProjectFormModalState;
  signInModal: {
    isVisible: boolean;
  };
  quickModelNameFormModal: QuickModelNameFormModalState;
  quickEnumFormModal: QuickEnumFormModalState;
  groupFormModal: GroupFormModalState;
  modalLayers: string[];
  criticalConfirmModal: CriticalConfirmModalState;
  isModalEscapeDisabled: boolean;
  requestFormModal: RequestFormModalState;
  quickUrlFormModal: QuickUrlFormModalState;
  searchUserFormModal: SearchUserFormModalState;
  screenMode: SCREEN_MODE;
  confirmSnackbar: ConfirmSnackbarState;
  exampleFormModal: ExampleFormModalState;
  codeModal: CodeModalState;
  mockDataModal: MockDataModalState;
};

export interface ConfirmSnackbarState {
  isVisible: boolean;
  message: string;
  confirmAction?: PayloadAction<any>;
  confirmText: string;
}

export interface SearchUserFormModalState {
  isVisible: boolean;
  role: MemberRole;
}

export interface QuickUrlFormModalState {
  isVisible: boolean;
}

export interface RequestFormModalState {
  isVisible: boolean;
  projectId?: string;
  groupId?: string;
  requests: RequestDoc[];
}

export interface CriticalConfirmModalState {
  isVisible: boolean;
  title: string;
  message: string;
  keyword: string;
}

export interface GroupFormModalState {
  isVisible: boolean;
  group?: GroupDoc;
}

export interface QuickEnumFormModalState {
  isVisible: boolean;
  enumeration?: EnumerationDoc;
}

export interface QuickModelNameFormModalState {
  isVisible: boolean;
  model?: ModelDoc;
}

export interface ProjectFormModalState {
  isVisible: boolean;
  project?: ProjectDoc;
}

export type ExampleFormModalState = Pick<
  ExampleFormModalProps,
  "isVisible" | "modelField" | "type"
>;

export enum SCREEN_MODE {
  WIDE = "WIDE",
  DEFAULT = "DEFAULT",
}

export type CodeModalState = Pick<
  CodeModalProps,
  "isVisible" | "mode" | "value" | "title"
>;

export type MockDataModalState = Pick<
  MockDataModalProps,
  "isVisible" | "targetInterface" | "interfaces" | "enumerations"
>;

export const initialUiState: UiState = {
  theme: window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? THEMES.DARK
    : THEMES.LIGHT,
  notifications: [],
  loadingTasks: [],
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
  quickEnumFormModal: {
    isVisible: false,
  },
  groupFormModal: {
    isVisible: false,
    group: undefined,
  },
  modalLayers: [],
  criticalConfirmModal: {
    isVisible: false,
    title: "",
    message: "",
    keyword: "",
  },
  isModalEscapeDisabled: false,
  requestFormModal: {
    isVisible: false,
    projectId: undefined,
    groupId: undefined,
    requests: [],
  },
  quickUrlFormModal: {
    isVisible: false,
  },
  searchUserFormModal: {
    isVisible: false,
    role: "guest",
  },
  screenMode: SCREEN_MODE.DEFAULT,
  confirmSnackbar: {
    isVisible: false,
    message: "",
    confirmText: "",
  },
  exampleFormModal: {
    isVisible: false,
  },
  codeModal: {
    isVisible: false,
    mode: "javascript",
    value: "",
    title: "",
  },
  mockDataModal: {
    isVisible: false,
    interfaces: [],
    enumerations: [],
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
        (notification) => notification.key !== action.payload,
      );
    },
    showNotification: (
      _,
      _action: PayloadAction<{
        message: string;
        type?: "default" | "warning" | "success" | "error" | "info";
      }>,
    ) => {},
    showLoading: (state, action: PayloadAction<string>) => {
      state.loadingTasks.push(action.payload);
      state.isLoading = true;
    },
    hideLoading: (state, action: PayloadAction<string>) => {
      state.loadingTasks = state.loadingTasks.filter((task) => task !== action.payload);
      if (state.loadingTasks.length === 0) {
        state.isLoading = false;
      }
    },
    receiveProjectFormModal: (state, action: PayloadAction<ProjectFormModalState>) => {
      state.projectFormModal = action.payload;
    },
    showProjectFormModal: (_, _action: PayloadAction<ProjectDoc | undefined>) => {},
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
    showDelayedLoading: (
      _,
      _action: PayloadAction<{ taskName: string; delay?: number }>,
    ) => {},
    receiveQuickModelNameFormModal: (
      state,
      action: PayloadAction<QuickModelNameFormModalState>,
    ) => {
      state.quickModelNameFormModal = action.payload;
    },
    showQuickModelNameFormModal: (_, _action: PayloadAction<ModelDoc | undefined>) => {},
    hideQuickModelNameFormModal: (state, _: PayloadAction<void>) => {
      state.quickModelNameFormModal.isVisible = false;
    },
    clearQuickModelNameFormModal: (state, _action: PayloadAction<void>) => {
      state.quickModelNameFormModal.model = undefined;
    },
    showQuickEnumFormModal: (
      state,
      action: PayloadAction<EnumerationDoc | undefined>,
    ) => {
      state.quickEnumFormModal.isVisible = true;
      state.quickEnumFormModal.enumeration = action.payload;
    },
    hideQuickEnumFormModal: (state, _action: PayloadAction<void>) => {
      state.quickEnumFormModal.isVisible = false;
    },
    receiveGroupFormModal: (state, action: PayloadAction<GroupFormModalState>) => {
      state.groupFormModal = action.payload;
    },
    showGroupFormModal: (state, action: PayloadAction<GroupDoc | undefined>) => {
      state.groupFormModal.isVisible = true;
      state.groupFormModal.group = action.payload;
    },
    hideGroupFormModal: (state, _action: PayloadAction<void>) => {
      state.groupFormModal.isVisible = false;
    },
    pushModalLayer: (state, action: PayloadAction<string>) => {
      state.modalLayers.push(action.payload);
    },
    popModalLayer: (state, _action: PayloadAction<void>) => {
      state.modalLayers.pop();
    },
    receiveCriticalConfirmModal: (
      state,
      action: PayloadAction<CriticalConfirmModalState>,
    ) => {
      state.criticalConfirmModal = action.payload;
    },
    showCriticalConfirmModal: (
      state,
      action: PayloadAction<Omit<CriticalConfirmModalState, "isVisible">>,
    ) => {
      state.criticalConfirmModal = { isVisible: true, ...action.payload };
    },
    hideCriticalConfirmModal: (state, _action: PayloadAction<void>) => {
      state.criticalConfirmModal.isVisible = false;
    },
    confirmCriticalConfirmModal: (_, _action: PayloadAction<void>) => {},
    enableModalEscape: (state, _action: PayloadAction<void>) => {
      state.isModalEscapeDisabled = false;
    },
    disableModalEscape: (state, _action: PayloadAction<void>) => {
      state.isModalEscapeDisabled = true;
    },
    showRequestFormModal: (
      state,
      action: PayloadAction<Omit<RequestFormModalState, "isVisible">>,
    ) => {
      state.requestFormModal.isVisible = true;
      state.requestFormModal.projectId = action.payload.projectId;
      state.requestFormModal.groupId = action.payload.groupId;
      state.requestFormModal.requests = action.payload.requests;
    },
    hideRequestFormModal: (state, _action: PayloadAction<void>) => {
      state.requestFormModal.isVisible = false;
    },
    showQuickUrlFormModal: (state, _action: PayloadAction<void>) => {
      state.quickUrlFormModal.isVisible = true;
    },
    hideQuickUrlFormModal: (state, _action: PayloadAction<void>) => {
      state.quickUrlFormModal.isVisible = false;
    },
    showSearchUserFormModal: (state, action: PayloadAction<MemberRole>) => {
      state.searchUserFormModal.isVisible = true;
      state.searchUserFormModal.role = action.payload;
    },
    hideSearchUserFormModal: (state, _action: PayloadAction<void>) => {
      state.searchUserFormModal.isVisible = false;
    },
    showExampleFormModal: (
      state,
      action: PayloadAction<{ modelField: ModelFieldDocLike; type: EXAMPLE_TYPES }>,
    ) => {
      state.exampleFormModal.isVisible = true;
      state.exampleFormModal.modelField = action.payload.modelField;
      state.exampleFormModal.type = action.payload.type;
    },
    hideExampleFormModal: (state, _action: PayloadAction<void>) => {
      state.exampleFormModal.isVisible = false;
    },
    receiveScreenMode: (state, action: PayloadAction<SCREEN_MODE>) => {
      state.screenMode = action.payload;
    },
    toggleScreenMode: (state, _action: PayloadAction<void>) => {
      if (state.screenMode === SCREEN_MODE.DEFAULT) {
        state.screenMode = SCREEN_MODE.WIDE;
      } else {
        state.screenMode = SCREEN_MODE.DEFAULT;
      }
    },
    showConfirmSnackbar: (
      state,
      action: PayloadAction<Omit<ConfirmSnackbarState, "isVisible">>,
    ) => {
      state.confirmSnackbar = { isVisible: true, ...action.payload };
    },
    hideConfirmSnackbar: (state, _action: PayloadAction<void>) => {
      state.confirmSnackbar.isVisible = false;
    },
    reloadApp: (_, _action: PayloadAction<void>) => {},
    showCodeModal: (
      state,
      action: PayloadAction<Pick<CodeModalState, "mode" | "title" | "value">>,
    ) => {
      state.codeModal.isVisible = true;
      state.codeModal.mode = action.payload.mode;
      state.codeModal.title = action.payload.title;
      state.codeModal.value = action.payload.value;
    },
    hideCodeModal: (state, _action: PayloadAction<void>) => {
      state.codeModal.isVisible = false;
    },
    showMockDataModal: (
      state,
      action: PayloadAction<
        Pick<MockDataModalState, "interfaces" | "targetInterface" | "enumerations">
      >,
    ) => {
      state.mockDataModal.isVisible = true;
      state.mockDataModal.enumerations = action.payload.enumerations;
      state.mockDataModal.interfaces = action.payload.interfaces;
      state.mockDataModal.targetInterface = action.payload.targetInterface;
    },
    hideMockDataModal: (state, _action: PayloadAction<void>) => {
      state.mockDataModal.isVisible = false;
    },
  },
});

export const UiActions = UiSlice.actions;

export default UiSlice;
