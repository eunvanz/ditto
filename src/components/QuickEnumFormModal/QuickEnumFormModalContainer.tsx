import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useModalKeyControl from "../../hooks/useModalKeyControl";
import UiSelectors from "../../store/Ui/UiSelectors";
import { UiActions } from "../../store/Ui/UiSlice";
import QuickEnumFormModal from "./QuickEnumFormModal";

const QuickEnumFormModalContainer = () => {
  const dispatch = useDispatch();

  const { isVisible, enumeration } = useSelector(
    UiSelectors.selectQuickEnumFormModal
  );

  const closeEnumFormModal = useCallback(() => {
    dispatch(UiActions.hideQuickEnumFormModal());
  }, [dispatch]);

  useModalKeyControl({
    isVisible,
    onClose: closeEnumFormModal,
    name: "QuickEumFormModal",
  });

  return (
    <QuickEnumFormModal
      isVisible={isVisible}
      enumeration={enumeration}
      onClose={closeEnumFormModal}
    />
  );
};

export default QuickEnumFormModalContainer;
