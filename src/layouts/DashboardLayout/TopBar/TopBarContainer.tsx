import React, { useCallback } from "react";
import TopBar from "./TopBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { THEMES } from "../../../types";
import { UiActions } from "../../../store/Ui/UiSlice";

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

  const toggleDarkMode = useCallback(() => {
    dispatch(UiActions.receiveTheme(isDarkMode ? THEMES.LIGHT : THEMES.DARK));
  }, [dispatch, isDarkMode]);

  return (
    <TopBar
      onToggleDarkMode={toggleDarkMode}
      isDarkMode={isDarkMode}
      onMobileNavOpen={onMobileNavOpen}
    />
  );
};

export default TopBarContainer;
