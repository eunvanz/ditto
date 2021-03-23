import React, { useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import UiSelectors from "../../store/Ui/UiSelectors";
import UiSlice from "../../store/Ui/UiSlice";
import ProjectFormModal from "./ProjectFormModal";

const ProjectFormModalContainer = () => {
  const dispatch = useDispatch();

  const projectFormModalState = useSelector(UiSelectors.selectProjectFormModal);

  const closeProjectFormModal = useCallback(() => {
    dispatch(UiSlice.actions.hideProjectFormModal());
  }, [dispatch]);

  const isModification = useMemo(() => {
    return !!projectFormModalState?.project;
  }, [projectFormModalState]);

  return (
    <ProjectFormModal
      isVisible={projectFormModalState.isVisible}
      onClose={closeProjectFormModal}
      isModification={isModification}
    />
  );
};

export default ProjectFormModalContainer;
