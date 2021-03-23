import React from "react";
import { SnackbarProvider } from "notistack";
import GlobalThemeProvider from "../GlobalThemeProvider";
import StoreProvider from "../StoreProvider";

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
