import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import UiSelectors from "../../store/Ui/UiSelectors";
import { UiActions } from "../../store/Ui/UiSlice";
import { RequestFormValues } from "./RequestFormModal";

const useRequestFormModalProps = () => {
  const dispatch = useDispatch();

  const requestFormModalState = useSelector(UiSelectors.selectRequestFormModal);

  const onClose = useCallback(() => {
    dispatch(UiActions.hideRequestFormModal());
  }, [dispatch]);

  const onSubmit = useCallback(
    (values: RequestFormValues) => {
      dispatch(ProjectActions.submitRequestForm(values));
    },
    [dispatch],
  );

  const isSubmitting = useSelector(
    ProgressSelectors.createInProgressSelector(ProjectActions.submitRequestForm.type),
  );

  return {
    isVisible: requestFormModalState.isVisible,
    onClose,
    onSubmit,
    isSubmitting,
    requests: requestFormModalState.requests,
  };
};

export default useRequestFormModalProps;
