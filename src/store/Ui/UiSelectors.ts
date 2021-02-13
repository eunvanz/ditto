import { RootState } from "..";

const selectTheme = (state: RootState) => state.ui.theme;

const selectProjectFormModal = (state: RootState) => state.ui.projectFormModal;

const selectQuickModelNameFormModal = (state: RootState) =>
  state.ui.quickModelNameFormModal;

const selectQuickEnumFormModal = (state: RootState) =>
  state.ui.quickEnumFormModal;

const selectGroupFormModal = (state: RootState) => state.ui.groupFormModal;

const selectModalLayers = (state: RootState) => state.ui.modalLayers;

const selectCriticalConfirmModal = (state: RootState) =>
  state.ui.criticalConfirmModal;

const UiSelectors = {
  selectTheme,
  selectProjectFormModal,
  selectQuickModelNameFormModal,
  selectQuickEnumFormModal,
  selectGroupFormModal,
  selectModalLayers,
  selectCriticalConfirmModal,
};

export default UiSelectors;
