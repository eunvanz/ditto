import { RootState } from "..";

const selectTheme = (state: RootState) => state.ui.theme;

const selectProjectFormModal = (state: RootState) => state.ui.projectFormModal;

const selectQuickModelNameFormModal = (state: RootState) =>
  state.ui.quickModelNameFormModal;

const selectQuickEnumFormModal = (state: RootState) =>
  state.ui.quickEnumFormModal;

const selectGroupFormModal = (state: RootState) => state.ui.groupFormModal;

const UiSelectors = {
  selectTheme,
  selectProjectFormModal,
  selectQuickModelNameFormModal,
  selectQuickEnumFormModal,
  selectGroupFormModal,
};

export default UiSelectors;
