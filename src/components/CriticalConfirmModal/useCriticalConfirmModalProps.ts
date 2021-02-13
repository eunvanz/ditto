import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import UiSelectors from "../../store/Ui/UiSelectors";
import { UiActions } from "../../store/Ui/UiSlice";

const useCriticalConfirmModalProps = () => {
  const dispatch = useDispatch();

  const criticalConfirmModal = useSelector(
    UiSelectors.selectCriticalConfirmModal
  );

  const onClose = useCallback(() => {
    dispatch(UiActions.hideCriticalConfirmModal());
  }, [dispatch]);

  return {
    ...criticalConfirmModal,
    onClose,
  };
};

export default useCriticalConfirmModalProps;
