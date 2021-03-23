import React, { useEffect, useCallback } from "react";
import addons from "@storybook/addons";
import { useDispatch } from "react-redux";
import UiSlice from "../../store/Ui/UiSlice";
import { THEMES } from "../../types";

const channel = addons.getChannel();

export interface ThemeWrapperProps {
  children: React.ReactNode;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  const dispatch = useDispatch();

  const handleOnDarkModeChange = useCallback(
    (isDarkMode: boolean) => {
      dispatch(UiSlice.actions.receiveTheme(isDarkMode ? THEMES.DARK : THEMES.LIGHT));
    },
    [dispatch],
  );

  useEffect(() => {
    channel.on("DARK_MODE", handleOnDarkModeChange);
    return () => channel.off("DARK_MODE", handleOnDarkModeChange);
  }, [handleOnDarkModeChange]);

  return <>{children}</>;
};

export default ThemeWrapper;
