import React from "react";
import Notifier from "../Notifier";
import GlobalLoading from "../GlobalLoading";
import SignInModal from "../SignInModal";
import ProjectFormModal from "../ProjectFormModal";
import QuickModelNameFormModal from "../QuickModelNameFormModal";

const GlobalComponents: React.FC = () => {
  return (
    <>
      <Notifier />
      <GlobalLoading />
      <ProjectFormModal />
      <SignInModal />
      <QuickModelNameFormModal />
    </>
  );
};

export default GlobalComponents;
