import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { useSelector } from "react-redux";
import UiSelectors from "../../store/Ui/UiSelectors";
import { createTheme } from "../../theme";

const GlobalThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const themeName = useSelector(UiSelectors.selectTheme);

  const theme = createTheme({ theme: themeName });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default GlobalThemeProvider;
