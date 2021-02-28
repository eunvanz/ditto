import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import useProjectByParam from "../../hooks/useProjectByParam";
import useRequestByParam from "../../hooks/useRequestByParam";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import { ModelFieldDoc, REQUEST_PARAM_LOCATION } from "../../types";
import { ModelFieldFormValues } from "../ModelForm/ModelForm";
import { RequestParamFormProps } from "./RequestParamForm";

export interface UseRequestParamFormPropsParams {
  location: REQUEST_PARAM_LOCATION;
}

const useRequestParamFormProps: (
  params: UseRequestParamFormPropsParams
) => RequestParamFormProps = ({ location }: UseRequestParamFormPropsParams) => {
  const title = useMemo(() => {
    switch (location) {
      case REQUEST_PARAM_LOCATION.COOKIE:
        return "Cookies";
      case REQUEST_PARAM_LOCATION.HEADER:
        return "Headers";
      case REQUEST_PARAM_LOCATION.PATH:
        return "Path Params";
      case REQUEST_PARAM_LOCATION.QUERY:
        return "Query Params";
    }
  }, [location]);

  const { projectId } = useProjectByParam();
  const { requestId } = useRequestByParam();

  const firestoreQuery = useMemo(() => {
    if (projectId) {
      return {
        collection: `projects/${projectId}/requests/${requestId}/params`,
        orderBy: ["createdAt", "asc"],
      };
    } else {
      return [];
    }
  }, [projectId, requestId]);

  useFirestoreConnect(firestoreQuery as any);

  const requestParams = useSelector(
    FirebaseSelectors.createRequestParamsSelector(
      projectId,
      requestId,
      location
    )
  );

  const dispatch = useDispatch();

  const onSubmitRequestParamForm = useCallback(
    (values: ModelFieldFormValues) => {
      dispatch(
        ProjectActions.submitRequestParamForm({
          ...values,
          requestId,
          location,
        })
      );
    },
    [dispatch, location, requestId]
  );

  const onDeleteRequestParam = useCallback(
    (requestParam: ModelFieldDoc) => {
      dispatch(ProjectActions.deleteRequestParam(requestParam));
    },
    [dispatch]
  );

  const submittingRequestParamActionsInProgress = useSelector(
    ProgressSelectors.selectSubmitRequestParamFormActions
  );

  const checkIsSubmittingRequestParam = useCallback(
    (id?: string) => {
      return submittingRequestParamActionsInProgress.includes(
        `${ProjectActions.submitRequestParamForm}-${id}`
      );
    },
    [submittingRequestParamActionsInProgress]
  );

  return {
    title,
    requestParams: requestParams || [],
    onSubmitRequestParamForm,
    onDeleteRequestParam,
    checkIsSubmittingRequestParam,
  };
};

export default useRequestParamFormProps;
