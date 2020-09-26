import React, { useCallback } from "react";
import NavBar, { Section } from "./NavBar";
import { useDispatch } from "react-redux";
import { UiActions } from "../../../store/Ui/UiSlice";

export interface NavBarContainerProps {
  onMobileClose: () => void;
  isOpenMobile: boolean;
  sections: Section[];
}

const NavBarContainer: React.FC<NavBarContainerProps> = (props) => {
  const dispatch = useDispatch();

  const showProjectFormModal = useCallback(() => {
    dispatch(UiActions.showProjectFormModal());
  }, [dispatch]);

  return <NavBar onClickAddNewProject={showProjectFormModal} {...props} />;
};

export default NavBarContainer;
