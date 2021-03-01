import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import useProjectByParam from "../../../hooks/useProjectByParam";
import useRequestByParam from "../../../hooks/useRequestByParam";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import ProgressSelectors from "../../../store/Progress/ProgressSelectors";
import { ProjectActions } from "../../../store/Project/ProjectSlice";
import { RequestBodyDoc } from "../../../types";
import {
  RequestBodyFormItemProps,
  RequestBodyItemFormValues,
} from "./RequestBodyFormItem";

export interface UseRequestBodyFormItemPropsParams {
  requestBody?: RequestBodyDoc;
  isNewForm?: boolean;
  onHideForm?: () => void;
}

const useRequestBodyFormItemProps: (
  params: UseRequestBodyFormItemPropsParams
) => RequestBodyFormItemProps = ({ requestBody, isNewForm, onHideForm }) => {
  const dispatch = useDispatch();

  const { projectId } = useProjectByParam();
  const { requestId } = useRequestByParam();

  useFirestoreConnect([
    {
      collection: `projects/${projectId}/models`,
      orderBy: ["createdAt", "asc"],
    },
    {
      collection: `projects/${projectId}/enumerations`,
      orderBy: ["createdAt", "asc"],
    },
    {
      collection: `projects/${projectId}/requests/${requestId}/bodies`,
      orderBy: ["createdAt", "asc"],
    },
  ]);

  const requestBodies = useSelector(
    FirebaseSelectors.createRequestBodiesSelector(projectId, requestId)
  );
  const projectModels = useSelector(
    FirebaseSelectors.createProjectModelsSelector(projectId)
  );
  const projectEnumerations = useSelector(
    FirebaseSelectors.createProjectEnumerationsSelector(projectId)
  );

  const onSubmit = useCallback(
    (values: RequestBodyItemFormValues) => {
      dispatch(ProjectActions.submitRequestBodyItemForm(values));
    },
    [dispatch]
  );

  const onDelete = useCallback(() => {
    requestBody && dispatch(ProjectActions.deleteRequestBody(requestBody));
  }, [dispatch, requestBody]);

  const isSubmitting = useSelector(
    ProgressSelectors.createInProgressSelector(
      ProjectActions.submitRequestBodyItemForm.type
    )
  );

  return {
    requestBody,
    requestBodies: requestBodies || [],
    projectModels: projectModels || [],
    projectEnumerations: projectEnumerations || [],
    isNewForm,
    onSubmit,
    onDelete,
    isSubmitting,
    onHideForm,
  };
};

export default useRequestBodyFormItemProps;
