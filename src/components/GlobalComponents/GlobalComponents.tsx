import React from "react";
import ConfirmSnackbar from "../ConfirmSnackbar";
import CriticalConfirmModal from "../CriticalConfirmModal";
import ExampleFormModal from "../ExampleFormModal";
import GlobalLoading from "../GlobalLoading";
import GroupFormModal from "../GroupFormModal";
import Notifier from "../Notifier";
import ProjectFormModal from "../ProjectFormModal";
import QuickEnumFormModal from "../QuickEnumFormModal";
import QuickModelNameFormModal from "../QuickModelNameFormModal";
import RequestFormModal from "../RequestFormModal";
import SignInModal from "../SignInModal";

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
      <RequestFormModal />
      <ConfirmSnackbar />
      <ExampleFormModal />
    </>
  );
};

export default GlobalComponents;
