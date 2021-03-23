import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import UiSelectors from "../../../store/Ui/UiSelectors";
import { UiActions } from "../../../store/Ui/UiSlice";
import { THEMES } from "../../../types";
import TopBar from "./TopBar";

export interface TopBarContainerProps {
  onMobileNavOpen: () => void;
}

const TopBarContainer: React.FC<TopBarContainerProps> = ({ onMobileNavOpen }) => {
  const dispatch = useDispatch();

  const isDarkMode = useSelector((state: RootState) => state.ui.theme === THEMES.DARK);

  const screenMode = useSelector(UiSelectors.selectScreenMode);

  const toggleDarkMode = useCallback(() => {
    dispatch(UiActions.receiveTheme(isDarkMode ? THEMES.LIGHT : THEMES.DARK));
  }, [dispatch, isDarkMode]);

  const userProfile = useSelector(FirebaseSelectors.selectUserProfile);

  return (
    <TopBar
      onToggleDarkMode={toggleDarkMode}
      isDarkMode={isDarkMode}
      onMobileNavOpen={onMobileNavOpen}
      screenMode={screenMode}
      userProfile={userProfile}
    />
  );
};

export default TopBarContainer;
