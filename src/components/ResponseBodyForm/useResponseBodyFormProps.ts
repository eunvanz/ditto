import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import useProjectByParam from "../../hooks/useProjectByParam";
import useProjectRole from "../../hooks/useProjectRole";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import { UiActions } from "../../store/Ui/UiSlice";
import {
  ModelFieldDoc,
  ResponseBodyDoc,
  ResponseHeaderDoc,
  ResponseStatusDoc,
} from "../../types";
import { EXAMPLE_TYPES } from "../ExampleFormModal/ExampleFormModal";
import { ModelFieldFormValues } from "../ModelForm/ModelForm";

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
    {
      collection: `projects/${responseStatus.projectId}/requests/${responseStatus.requestId}/responseStatuses/${responseStatus.id}/headers`,
      orderBy: ["createdAt", "asc"],
    },
  ]);

  const responseBodies = useSelector(
    FirebaseSelectors.createResponseBodiesSelector(
      responseStatus.projectId,
      responseStatus.requestId,
      responseStatus.id,
    ),
  );

  const responseHeaders = useSelector(
    FirebaseSelectors.createResponseHeadersSelector(
      responseStatus.projectId,
      responseStatus.requestId,
      responseStatus.id,
    ),
  );

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
        }),
      );
    },
    [dispatch, responseStatus.id, responseStatus.projectId, responseStatus.requestId],
  );

  const onDeleteResponseBody = useCallback(
    (responseBody: ModelFieldDoc) => {
      dispatch(ProjectActions.deleteResponseBody(responseBody as ResponseBodyDoc));
    },
    [dispatch],
  );

  const submittingRequestBodyActionsInProgress = useSelector(
    ProgressSelectors.selectSubmitResponseBodyFormActions,
  );

  const checkIsSubmittingResponseBody = (id?: string) => {
    return submittingRequestBodyActionsInProgress.includes(
      `${ProjectActions.submitResponseBodyForm}-${id}`,
    );
  };

  const onSubmitResponseHeader = useCallback(
    (values: ModelFieldFormValues) => {
      dispatch(
        ProjectActions.submitResponseHeaderForm({
          ...values,
          requestId: responseStatus.requestId,
          projectId: responseStatus.projectId,
          responseStatusId: responseStatus.id,
        }),
      );
    },
    [dispatch, responseStatus.id, responseStatus.projectId, responseStatus.requestId],
  );

  const onDeleteResponseHeader = useCallback(
    (responseHeader: ModelFieldDoc) => {
      dispatch(ProjectActions.deleteResponseHeader(responseHeader as ResponseHeaderDoc));
    },
    [dispatch],
  );

  const submittingRequestHeaderActionsInProgress = useSelector(
    ProgressSelectors.selectSubmitResponseHeaderFormActions,
  );

  const checkIsSubmittingResponseHeader = (id?: string) => {
    return submittingRequestHeaderActionsInProgress.includes(
      `${ProjectActions.submitResponseHeaderForm}-${id}`,
    );
  };

  const { project } = useProjectByParam();

  const role = useProjectRole(project);

  const onClickExample = useCallback(
    (modelField: ModelFieldDoc) => {
      dispatch(
        UiActions.showExampleFormModal({
          modelField,
          type: EXAMPLE_TYPES.RESPONSE_BODY,
        }),
      );
    },
    [dispatch],
  );

  return {
    responseStatus,
    responseBodies,
    onDeleteResponseStatus,
    onSubmitResponseBody,
    onDeleteResponseBody,
    checkIsSubmittingResponseBody,
    onSubmitResponseHeader,
    onDeleteResponseHeader,
    checkIsSubmittingResponseHeader,
    onEditResponseStatus,
    responseHeaders,
    role,
    onClickExample,
  };
};

export default useResponseBodyFormProps;
