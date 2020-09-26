import React, { useMemo } from "react";
import DashboardLayout from "./DashboardLayout";

export interface DashboardLayoutContainerProps {
  children: React.ReactNode;
}

const DashboardLayoutContainer = ({
  children,
}: DashboardLayoutContainerProps) => {
  const sections = useMemo(() => {
    return [
      {
        subheader: "내 프로젝트",
        items: [],
      },
    ];
  }, []);

  return <DashboardLayout sections={sections}>{children}</DashboardLayout>;
};

export default DashboardLayoutContainer;
