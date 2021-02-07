import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import UiSelectors from "../../store/Ui/UiSelectors";
import { UiActions } from "../../store/Ui/UiSlice";
import QuickEnumFormModal from "./QuickEnumFormModal";

const QuickEnumFormModalContainer = () => {
  const dispatch = useDispatch();

  const { isVisible } = useSelector(UiSelectors.selectQuickEnumFormModal);

  const closeEnumFormModal = useCallback(() => {
    dispatch(UiActions.hideQuickEnumFormModal());
  }, [dispatch]);

  return (
    <QuickEnumFormModal isVisible={isVisible} onClose={closeEnumFormModal} />
  );
};

export default QuickEnumFormModalContainer;
