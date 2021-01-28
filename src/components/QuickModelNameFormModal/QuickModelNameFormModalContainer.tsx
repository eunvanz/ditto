import React from "react";
import { useDispatch, useSelector } from "react-redux";
import UiSelectors from "../../store/Ui/UiSelectors";
import { UiActions } from "../../store/Ui/UiSlice";
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
      onClose={() => dispatch(UiActions.hideQuickModelNameFormModal())}
    />
  );
};

export default QuickModelNameFormModalContainer;
