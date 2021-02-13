import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import UiSelectors from "../../store/Ui/UiSelectors";
import { UiActions } from "../../store/Ui/UiSlice";
import { CriticalConfirmModalFormValues } from "./CriticalConfirmModal";

export interface UseCriticalConfirmModalPropsParams {
  onSubmit: (values: CriticalConfirmModalFormValues) => void;
}

const useCriticalConfirmModalProps = ({
  onSubmit,
}: UseCriticalConfirmModalPropsParams) => {
  const dispatch = useDispatch();

  const criticalConfirmModal = useSelector(
    UiSelectors.selectCriticalConfirmModal
  );

  const onClose = useCallback(() => {
    dispatch(UiActions.hideCriticalConfirmModal());
  }, [dispatch]);

  return {
    ...criticalConfirmModal,
    onSubmit,
    onClose,
  };
};

export default useCriticalConfirmModalProps;
