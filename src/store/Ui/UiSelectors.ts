import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

const selectTheme = createSelector(
  (state: RootState) => state.ui.theme,
  (theme) => theme,
);

const selectProjectFormModal = createSelector(
  (state: RootState) => state.ui.projectFormModal,
  (projectFormModal) => projectFormModal,
);

const selectQuickModelNameFormModal = createSelector(
  (state: RootState) => state.ui.quickModelNameFormModal,
  (quickModelNameFormModal) => quickModelNameFormModal,
);

const selectQuickEnumFormModal = createSelector(
  (state: RootState) => state.ui.quickEnumFormModal,
  (quickEnumFormModal) => quickEnumFormModal,
);

const selectGroupFormModal = createSelector(
  (state: RootState) => state.ui.groupFormModal,
  (groupFormModal) => groupFormModal,
);

const selectModalLayers = createSelector(
  (state: RootState) => state.ui.modalLayers,
  (modalLayers) => modalLayers,
);

const selectCriticalConfirmModal = createSelector(
  (state: RootState) => state.ui.criticalConfirmModal,
  (criticalConfirmModal) => criticalConfirmModal,
);

const selectIsModalEscapeDisabled = createSelector(
  (state: RootState) => state.ui.isModalEscapeDisabled,
  (isModalEscapeDisabled) => isModalEscapeDisabled,
);

const selectRequestFormModal = createSelector(
  (state: RootState) => state.ui.requestFormModal,
  (requestFormModal) => requestFormModal,
);

const selectQuickUrlFormModal = createSelector(
  (state: RootState) => state.ui.quickUrlFormModal,
  (quickUrlFormModal) => quickUrlFormModal,
);

const selectSearchUserFormModal = createSelector(
  (state: RootState) => state.ui.searchUserFormModal,
  (searchUserFormModal) => searchUserFormModal,
);

const selectLoadingTasks = (state: RootState) => state.ui.loadingTasks;

const selectScreenMode = (state: RootState) => state.ui.screenMode;

const selectConfirmSnackbar = (state: RootState) => state.ui.confirmSnackbar;

const selectExampleFormModal = (state: RootState) => state.ui.exampleFormModal;

const selectCodeModal = (state: RootState) => state.ui.codeModal;

const selectMockDataModal = (state: RootState) => state.ui.mockDataModal;

const UiSelectors = {
  selectTheme,
  selectProjectFormModal,
  selectQuickModelNameFormModal,
  selectQuickEnumFormModal,
  selectGroupFormModal,
  selectModalLayers,
  selectCriticalConfirmModal,
  selectIsModalEscapeDisabled,
  selectRequestFormModal,
  selectQuickUrlFormModal,
  selectSearchUserFormModal,
  selectLoadingTasks,
  selectScreenMode,
  selectConfirmSnackbar,
  selectExampleFormModal,
  selectCodeModal,
  selectMockDataModal,
};

export default UiSelectors;
