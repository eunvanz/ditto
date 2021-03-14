import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import useProjectByParam from "../../hooks/useProjectByParam";
import useProjectRole from "../../hooks/useProjectRole";
import useRequestByParam from "../../hooks/useRequestByParam";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import { ModelFieldDoc, RequestBodyDoc } from "../../types";
import { ModelFieldFormValues } from "../ModelForm/ModelForm";

const useRequestBodyForm = () => {
  const dispatch = useDispatch();

  const { projectId, project } = useProjectByParam();
  const { requestId } = useRequestByParam();

  useFirestoreConnect({
    collection: `projects/${projectId}/requests/${requestId}/bodies`,
    orderBy: ["createdAt", "asc"],
  });

  const requestBodies = useSelector(
    FirebaseSelectors.createRequestBodiesSelector(projectId, requestId)
  );

  const onSubmit = useCallback(
    (values: ModelFieldFormValues) => {
      dispatch(ProjectActions.submitRequestBodyForm({ ...values, requestId }));
    },
    [dispatch, requestId]
  );

  const onDelete = useCallback(
    (requestBody: ModelFieldDoc) => {
      dispatch(ProjectActions.deleteRequestBody(requestBody as RequestBodyDoc));
    },
    [dispatch]
  );

  const submittingRequestBodyActionsInProgress = useSelector(
    ProgressSelectors.selectSubmitRequestBodyFormActions
  );

  const checkIsSubmittingRequestBody = useCallback(
    (id?: string) => {
      return submittingRequestBodyActionsInProgress.includes(
        `${ProjectActions.submitRequestBodyForm}-${id}`
      );
    },
    [submittingRequestBodyActionsInProgress]
  );

  const role = useProjectRole(project);

  return {
    requestBodies,
    onSubmit,
    onDelete,
    checkIsSubmittingRequestBody,
    role,
  };
};

export default useRequestBodyForm;
