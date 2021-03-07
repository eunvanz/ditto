import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { ResponseStatusFormValues } from "../../../components/ResponseStatusFormModal/ResponseStatusFormModal";
import useLoading from "../../../hooks/useLoading";
import useProjectByParam from "../../../hooks/useProjectByParam";
import useRequestByParam from "../../../hooks/useRequestByParam";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import ProgressSelectors from "../../../store/Progress/ProgressSelectors";
import { ProjectActions } from "../../../store/Project/ProjectSlice";

const useResponseTabProps = () => {
  const { projectId } = useProjectByParam();
  const { requestId } = useRequestByParam();

  useFirestoreConnect([
    {
      collection: `projects/${projectId}/requests/${requestId}/responseStatuses`,
      orderBy: ["statusCode", "asc"],
    },
  ]);

  const responseStatuses = useSelector(
    FirebaseSelectors.createResponseStatusesSelector(projectId, requestId)
  );

  const dispatch = useDispatch();

  const onSubmitResponseStatusForm = useCallback(
    (values: ResponseStatusFormValues) => {
      dispatch(
        ProjectActions.submitResponseStatus({ ...values, projectId, requestId })
      );
    },
    [dispatch, projectId, requestId]
  );

  const isSubmittingResponseStatusForm = useSelector(
    ProgressSelectors.createInProgressSelector(
      ProjectActions.submitResponseStatus.type
    )
  );

  useLoading(responseStatuses);

  return {
    responseStatuses,
    onSubmitResponseStatusForm,
    isSubmittingResponseStatusForm,
  };
};

export default useResponseTabProps;
