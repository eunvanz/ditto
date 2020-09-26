import React, { useCallback } from "react";
import ProjectFormModal from "./ProjectFormModal";
import { useSelector, useDispatch } from "react-redux";
import UiSelectors from "../../store/Ui/UiSelectors";
import UiSlice from "../../store/Ui/UiSlice";

const ProjectFormModalContainer = () => {
  const dispatch = useDispatch();

  const projectFormModalState = useSelector(UiSelectors.selectProjectFormModal);

  const closeProjectFormModal = useCallback(() => {
    dispatch(UiSlice.actions.hideProjectFormModal());
  }, [dispatch]);

  return (
    <ProjectFormModal
      isVisible={projectFormModalState.isVisible}
      onClose={closeProjectFormModal}
    />
  );
};

export default ProjectFormModalContainer;
