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

  const onSubmit = useCallback(() => {
    dispatch(UiActions.confirmCriticalConfirmModal());
  }, [dispatch]);

  return {
    ...criticalConfirmModal,
    onClose,
    onSubmit,
  };
};

export default useCriticalConfirmModalProps;
