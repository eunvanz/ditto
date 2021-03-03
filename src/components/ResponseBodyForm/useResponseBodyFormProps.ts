import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import { ModelFieldDoc, ResponseStatusDoc } from "../../types";
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

  firestoreConnect([
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

  const onDeleteResponseStatus = useCallback(() => {
    dispatch(ProjectActions.deleteResponseStatus(responseStatus));
  }, [dispatch, responseStatus]);

  const onSubmitResponseBody = useCallback((values: ModelFieldFormValues) => {},
  []);

  const onDeleteResponseBody = useCallback((responseBody: ModelFieldDoc) => {},
  []);

  const checkIsSubmittingResponseBody = (id?: string) => false;

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
