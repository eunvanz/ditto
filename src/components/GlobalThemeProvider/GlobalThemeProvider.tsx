import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { purple, pink } from "@material-ui/core/colors";
import { useSelector } from "react-redux";
import { createTheme } from "../../theme";
import UiSelectors from "../../store/Ui/UiSelectors";

export const primaryColor = purple[500];
export const secondaryColor = pink.A400;

const GlobalThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const themeName = useSelector(UiSelectors.selectTheme);

  const theme = createTheme({ theme: themeName });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default GlobalThemeProvider;
