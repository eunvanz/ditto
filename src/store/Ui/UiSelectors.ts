import { RootState } from "..";

const selectTheme = (state: RootState) => state.ui.theme;

const selectProjectFormModal = (state: RootState) => state.ui.projectFormModal;

const UiSelectors = {
  selectTheme,
  selectProjectFormModal,
};

export default UiSelectors;
