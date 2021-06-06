import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { ResponseStatusFormValues } from "../../../components/ResponseStatusFormModal/ResponseStatusFormModal";
import useLoading from "../../../hooks/useLoading";
import useProjectByParam from "../../../hooks/useProjectByParam";
import useProjectRole from "../../../hooks/useProjectRole";
import useRequestByParam from "../../../hooks/useRequestByParam";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import ProgressSelectors from "../../../store/Progress/ProgressSelectors";
import { ProjectActions } from "../../../store/Project/ProjectSlice";

const useResponseTabProps = () => {
  const { projectId, project } = useProjectByParam();
  const { requestId } = useRequestByParam();

  useFirestoreConnect([
    {
      collection: `projects/${projectId}/requests/${requestId}/responseStatuses`,
      orderBy: ["statusCode", "asc"],
    },
  ]);

  const responseStatuses = useSelector(
    FirebaseSelectors.createResponseStatusesSelector(projectId, requestId),
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (responseStatuses) {
      dispatch(
        ProjectActions.receiveResponseStatuses({
          requestId,
          responseStatuses,
        }),
      );
    }
  }, [dispatch, projectId, requestId, responseStatuses]);

  const onSubmitResponseStatusForm = useCallback(
    (values: ResponseStatusFormValues) => {
      dispatch(ProjectActions.submitResponseStatus({ ...values, projectId, requestId }));
    },
    [dispatch, projectId, requestId],
  );

  const isSubmittingResponseStatusForm = useSelector(
    ProgressSelectors.createInProgressSelector(ProjectActions.submitResponseStatus.type),
  );

  useLoading(responseStatuses, `loadingResponseStatuses-${projectId}-${requestId}`);

  const role = useProjectRole(project);

  return {
    responseStatuses,
    onSubmitResponseStatusForm,
    isSubmittingResponseStatusForm,
    role,
  };
};

export default useResponseTabProps;
