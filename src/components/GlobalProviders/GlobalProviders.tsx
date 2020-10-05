import React from "react";
import StoreProvider from "../StoreProvider";
import GlobalThemeProvider from "../GlobalThemeProvider";
import { SnackbarProvider } from "notistack";

export interface GlobalProviderProps {
  children: React.ReactNode;
}

const GlobalProviders: React.FC<GlobalProviderProps> = ({ children }) => {
  return (
    <StoreProvider>
      <GlobalThemeProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {children}
        </SnackbarProvider>
      </GlobalThemeProvider>
    </StoreProvider>
  );
};

export default GlobalProviders;
