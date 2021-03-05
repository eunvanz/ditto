import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import { ModelFieldDoc, ResponseStatusDoc } from "../../types";
import { ModelFieldFormValues } from "../ModelForm/ModelForm";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";

export interface UseResponseBodyFormPropsParams {
  responseStatus: ResponseStatusDoc;
  onEditResponseStatus: () => void;
}

const useResponseBodyFormProps = ({
  responseStatus,
  onEditResponseStatus,
}: UseResponseBodyFormPropsParams) => {
  const dispatch = useDispatch();

  useFirestoreConnect([
    {
      collection: `projects/${responseStatus.projectId}/requests/${responseStatus.requestId}/responseStatuses/${responseStatus.id}/bodies`,
      orderBy: ["createdAt", "asc"],
    },
  ]);

  const responseBodies = useSelector(
    FirebaseSelectors.createResponseBodiesSelector(
      responseStatus.projectId,
      responseStatus.requestId,
      responseStatus.id
    )
  );
  console.log("===== responseBodies", responseBodies);

  const onDeleteResponseStatus = useCallback(() => {
    dispatch(ProjectActions.deleteResponseStatus(responseStatus));
  }, [dispatch, responseStatus]);

  const onSubmitResponseBody = useCallback(
    (values: ModelFieldFormValues) => {
      dispatch(
        ProjectActions.submitResponseBodyForm({
          ...values,
          requestId: responseStatus.requestId,
          projectId: responseStatus.projectId,
          responseStatusId: responseStatus.id,
        })
      );
    },
    [
      dispatch,
      responseStatus.id,
      responseStatus.projectId,
      responseStatus.requestId,
    ]
  );

  const onDeleteResponseBody = useCallback(
    (responseBody: ModelFieldDoc) => {
      dispatch(ProjectActions.deleteResponseBody(responseBody));
    },
    [dispatch]
  );

  const submittingRequestBodyActionsInProgress = useSelector(
    ProgressSelectors.selectSubmitResponseBodyFormActions
  );

  const checkIsSubmittingResponseBody = (id?: string) => {
    return submittingRequestBodyActionsInProgress.includes(
      `${ProjectActions.submitResponseBodyForm}-${id}`
    );
  };

  return {
    responseStatus,
    responseBodies,
    onDeleteResponseStatus,
    onSubmitResponseBody,
    onDeleteResponseBody,
    checkIsSubmittingResponseBody,
    onEditResponseStatus,
  };
};

export default useResponseBodyFormProps;
