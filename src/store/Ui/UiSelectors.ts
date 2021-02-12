import { RootState } from "..";

const selectTheme = (state: RootState) => state.ui.theme;

const selectProjectFormModal = (state: RootState) => state.ui.projectFormModal;

const selectQuickModelNameFormModal = (state: RootState) =>
  state.ui.quickModelNameFormModal;

const selectQuickEnumFormModal = (state: RootState) =>
  state.ui.quickEnumFormModal;

const selectGroupFormModal = (state: RootState) => state.ui.groupFormModal;

const selectModalLayers = (state: RootState) => state.ui.modalLayers;

const UiSelectors = {
  selectTheme,
  selectProjectFormModal,
  selectQuickModelNameFormModal,
  selectQuickEnumFormModal,
  selectGroupFormModal,
  selectModalLayers,
};

export default UiSelectors;
