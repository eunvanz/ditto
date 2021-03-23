import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import UiSelectors from "../../../store/Ui/UiSelectors";
import { UiActions } from "../../../store/Ui/UiSlice";
import NavBar, { Section } from "./NavBar";

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

  const screenMode = useSelector(UiSelectors.selectScreenMode);

  return (
    <NavBar
      onClickAddNewProject={showProjectFormModal}
      screenMode={screenMode}
      {...props}
    />
  );
};

export default NavBarContainer;
