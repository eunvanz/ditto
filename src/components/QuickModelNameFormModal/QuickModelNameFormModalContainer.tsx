import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useModalKeyControl from "../../hooks/useModalKeyControl";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import UiSelectors from "../../store/Ui/UiSelectors";
import { UiActions } from "../../store/Ui/UiSlice";
import QuickModelNameFormModal from "./QuickModelNameFormModal";

const QuickModelNameFormModalContainer = () => {
  const dispatch = useDispatch();

  const { isVisible, model } = useSelector(UiSelectors.selectQuickModelNameFormModal);

  const handleOnClose = useCallback(() => {
    dispatch(UiActions.hideQuickModelNameFormModal());
    dispatch(ProjectActions.cancelQuickModelNameForm());
  }, [dispatch]);

  useModalKeyControl({
    isVisible,
    onClose: handleOnClose,
    name: "QuickModelNameFormModal",
  });

  return (
    <QuickModelNameFormModal
      isVisible={isVisible}
      isModification={!!model}
      onClose={handleOnClose}
    />
  );
};

export default QuickModelNameFormModalContainer;
