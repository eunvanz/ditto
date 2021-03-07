import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import useLoading from "../../hooks/useLoading";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";
import ProjectSelectors from "../../store/Project/ProjectSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import UiSelectors from "../../store/Ui/UiSelectors";
import { UiActions } from "../../store/Ui/UiSlice";
import { GroupFormValues } from "./GroupFormModal";

const useGroupFormModal = () => {
  const dispatch = useDispatch();

  const project = useSelector(ProjectSelectors.selectCurrentProject);

  const { isVisible, group } = useSelector(UiSelectors.selectGroupFormModal);

  const defaultValues = useMemo(() => {
    return group ? { name: group.name, target: group } : undefined;
  }, [group]);

  const onClose = useCallback(() => {
    dispatch(UiActions.hideGroupFormModal());
  }, [dispatch]);

  const firestoreQuery = useMemo(() => {
    if (project) {
      return [
        {
          collection: `projects/${project.id}/groups`,
          orderBy: ["createdAt", "asc"],
        },
      ];
    } else {
      return [];
    }
  }, [project]);

  useFirestoreConnect(firestoreQuery as any);

  const existingGroups = useSelector(
    FirebaseSelectors.createProjectGroupsSelector(project?.id || "")
  );

  const onSubmit = useCallback(
    (values: GroupFormValues) => {
      dispatch(ProjectActions.submitGroupForm(values));
    },
    [dispatch]
  );

  const onDelete = useCallback(() => {
    if (!group) {
      return;
    }
    dispatch(ProjectActions.deleteGroup(group));
  }, [dispatch, group]);

  const isSubmitting = useSelector(
    ProgressSelectors.createInProgressSelector([
      ProjectActions.submitGroupForm.type,
      ProjectActions.deleteGroup.type,
    ])
  );

  useLoading(project ? existingGroups : true, `loadingProject-${project?.id}`);

  return {
    defaultValues,
    isVisible,
    onClose,
    existingGroupNames: existingGroups?.map((group) => group.name),
    onSubmit,
    isSubmitting,
    onDelete,
  };
};

export default useGroupFormModal;
