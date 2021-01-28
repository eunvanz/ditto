import { RootState } from "..";

const selectTheme = (state: RootState) => state.ui.theme;

const selectProjectFormModal = (state: RootState) => state.ui.projectFormModal;

const selectQuickModelNameFormModal = (state: RootState) =>
  state.ui.quickModelNameFormModal;

const UiSelectors = {
  selectTheme,
  selectProjectFormModal,
  selectQuickModelNameFormModal,
};

export default UiSelectors;
