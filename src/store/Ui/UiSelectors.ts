import { RootState } from "..";

const selectTheme = (state: RootState) => state.ui.theme;

const UiSelectors = {
  selectTheme,
};

export default UiSelectors;
