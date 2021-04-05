import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import UiSelectors from "../../store/Ui/UiSelectors";
import { UiActions } from "../../store/Ui/UiSlice";
import { ExampleFormValues } from "./ExampleFormModal";

const useExampleFormModalProps = () => {
  const dispatch = useDispatch();

  const { isVisible, modelField, type } = useSelector(UiSelectors.selectExampleFormModal);

  const onClose = useCallback(() => {
    dispatch(UiActions.hideExampleFormModal());
  }, [dispatch]);

  const onSubmit = useCallback(
    (values: ExampleFormValues) => {
      dispatch(ProjectActions.submitExamples(values));
    },
    [dispatch],
  );

  const isSubmitting = useSelector(
    ProgressSelectors.createInProgressSelector(ProjectActions.submitExamples.type),
  );

  return {
    isVisible,
    modelField,
    onClose,
    onSubmit,
    isSubmitting,
    type,
  };
};

export default useExampleFormModalProps;
