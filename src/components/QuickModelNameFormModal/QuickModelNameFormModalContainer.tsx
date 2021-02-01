import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import UiSelectors from "../../store/Ui/UiSelectors";
import QuickModelNameFormModal from "./QuickModelNameFormModal";

const QuickModelNameFormModalContainer = () => {
  const dispatch = useDispatch();

  const { isVisible, model } = useSelector(
    UiSelectors.selectQuickModelNameFormModal
  );

  return (
    <QuickModelNameFormModal
      isVisible={isVisible}
      isModification={!!model}
      onClose={() => dispatch(ProjectActions.cancelQuickModelNameForm())}
    />
  );
};

export default QuickModelNameFormModalContainer;
