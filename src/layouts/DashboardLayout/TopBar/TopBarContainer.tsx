import React, { useCallback } from "react";
import TopBar from "./TopBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { THEMES } from "../../../types";
import { UiActions } from "../../../store/Ui/UiSlice";
import UiSelectors from "../../../store/Ui/UiSelectors";

export interface TopBarContainerProps {
  onMobileNavOpen: () => void;
}

const TopBarContainer: React.FC<TopBarContainerProps> = ({
  onMobileNavOpen,
}) => {
  const dispatch = useDispatch();

  const isDarkMode = useSelector(
    (state: RootState) => state.ui.theme === THEMES.DARK
  );

  const screenMode = useSelector(UiSelectors.selectScreenMode);

  const toggleDarkMode = useCallback(() => {
    dispatch(UiActions.receiveTheme(isDarkMode ? THEMES.LIGHT : THEMES.DARK));
  }, [dispatch, isDarkMode]);

  const toggleScreenMode = useCallback(() => {
    dispatch(UiActions.toggleScreenMode());
  }, [dispatch]);

  return (
    <TopBar
      onToggleDarkMode={toggleDarkMode}
      isDarkMode={isDarkMode}
      onMobileNavOpen={onMobileNavOpen}
      onToggleScreenMode={toggleScreenMode}
      screenMode={screenMode}
    />
  );
};

export default TopBarContainer;
