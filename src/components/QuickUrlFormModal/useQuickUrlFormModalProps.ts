import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { assertNotEmpty } from "../../helpers/commonHelpers";
import { ProjectUrlFormValues } from "../../routes/ProjectManagement/ProjectUrlForm/ProjectUrlForm";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";
import ProjectSelectors from "../../store/Project/ProjectSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import UiSelectors from "../../store/Ui/UiSelectors";
import { UiActions } from "../../store/Ui/UiSlice";

const useQuickUrlFormModalProps = () => {
  const dispatch = useDispatch();

  const { isVisible } = useSelector(UiSelectors.selectQuickUrlFormModal);

  const onClose = useCallback(() => {
    dispatch(UiActions.hideQuickUrlFormModal());
  }, [dispatch]);

  const onSubmit = useCallback(
    (values: ProjectUrlFormValues) => {
      dispatch(ProjectActions.submitProjectUrlForm(values));
    },
    [dispatch]
  );

  const isSubmitting = useSelector(
    ProgressSelectors.createInProgressSelector(
      ProjectActions.submitProjectUrlForm.type
    )
  );

  const project = useSelector(ProjectSelectors.selectCurrentProject);
  assertNotEmpty(project);

  useFirestoreConnect({
    collection: `projects/${project.id}/urls`,
  });

  const existingUrls = useSelector(
    FirebaseSelectors.createProjectUrlsSelector(project.id)
  );

  return {
    isVisible,
    onClose,
    onSubmit,
    isSubmitting,
    existingUrls: existingUrls || [],
  };
};

export default useQuickUrlFormModalProps;
