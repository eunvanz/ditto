import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import useProjectByParam from "../../hooks/useProjectByParam";
import useRequestByParam from "../../hooks/useRequestByParam";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import { ModelFieldDoc } from "../../types";
import { ModelFieldFormValues } from "../ModelForm/ModelForm";

const useRequestBodyForm = () => {
  const dispatch = useDispatch();

  const { projectId } = useProjectByParam();
  const { requestId } = useRequestByParam();

  useFirestoreConnect({
    collection: `projects/${projectId}/requests/${requestId}/bodies`,
    orderBy: ["createdAt", "asc"],
  });

  const requestBodies = useSelector(
    FirebaseSelectors.createRequestBodiesSelector(projectId, requestId)
  );

  const onSubmit = useCallback((values: ModelFieldFormValues) => {}, []);

  const onDelete = useCallback((requestBody: ModelFieldDoc) => {}, []);

  const checkIsSubmittingRequestBody = useCallback(() => {
    return false;
  }, []);

  return {
    requestBodies: requestBodies || [],
    onSubmit,
    onDelete,
    checkIsSubmittingRequestBody,
  };
};

export default useRequestBodyForm;
