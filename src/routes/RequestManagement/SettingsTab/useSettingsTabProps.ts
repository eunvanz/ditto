import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import useProjectByParam from "../../../hooks/useProjectByParam";
import useProjectRole from "../../../hooks/useProjectRole";
import useRequestByParam from "../../../hooks/useRequestByParam";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import ProgressSelectors from "../../../store/Progress/ProgressSelectors";
import { ProjectActions } from "../../../store/Project/ProjectSlice";
import { RequestSettingFormValues } from "./SettingsTab";

const useSettingsTabProps = () => {
  const dispatch = useDispatch();

  const { projectId, project } = useProjectByParam();
  const { request } = useRequestByParam();

  firestoreConnect([
    {
      collection: `projects/${projectId}/groups`,
      orderBy: ["createdAt", "asc"],
    },
    {
      collection: `projects/${projectId}/requests`,
      orderBy: ["createdAt", "asc"],
    },
  ]);

  const projectGroups = useSelector(
    FirebaseSelectors.createProjectGroupsSelector(projectId)
  );
  const requests = useSelector(
    FirebaseSelectors.createProjectRequestsSelector(projectId)
  );

  const onSubmit = useCallback(
    (values: RequestSettingFormValues) => {
      dispatch(ProjectActions.submitRequestSettingForm(values));
    },
    [dispatch]
  );

  const isSubmitting = useSelector(
    ProgressSelectors.createInProgressSelector(
      ProjectActions.submitRequestSettingForm.type
    )
  );

  const onDelete = useCallback(() => {
    request && dispatch(ProjectActions.deleteRequest(request));
  }, [dispatch, request]);

  const role = useProjectRole(project);

  return {
    request,
    projectGroups,
    requests,
    onSubmit,
    isSubmitting,
    onDelete,
    role,
  };
};

export default useSettingsTabProps;
