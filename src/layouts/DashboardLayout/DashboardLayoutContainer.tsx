import React from "react";
import DashboardLayout from "./DashboardLayout";
import useDashboardLayoutProps from "./useDashboardLayoutProps";

export interface DashboardLayoutContainerProps {
  children: React.ReactNode;
}

const DashboardLayoutContainer = ({
  children,
}: DashboardLayoutContainerProps) => {
  const props = useDashboardLayoutProps();

  return <DashboardLayout {...props}>{children}</DashboardLayout>;
};

export default DashboardLayoutContainer;
