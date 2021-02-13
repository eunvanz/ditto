import React from "react";
import Notifier from "../Notifier";
import GlobalLoading from "../GlobalLoading";
import SignInModal from "../SignInModal";
import ProjectFormModal from "../ProjectFormModal";
import GroupFormModal from "../GroupFormModal";
import QuickModelNameFormModal from "../QuickModelNameFormModal";
import QuickEnumFormModal from "../QuickEnumFormModal";
import CriticalConfirmModal from "../CriticalConfirmModal";

const GlobalComponents: React.FC = () => {
  return (
    <>
      <Notifier />
      <GlobalLoading />
      <ProjectFormModal />
      <SignInModal />
      <QuickModelNameFormModal />
      <QuickEnumFormModal />
      <GroupFormModal />
      <CriticalConfirmModal />
    </>
  );
};

export default GlobalComponents;
