import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useProjectByParam from "../../hooks/useProjectByParam";
import useProjectRole from "../../hooks/useProjectRole";
import useRequestByParam from "../../hooks/useRequestByParam";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import { UiActions } from "../../store/Ui/UiSlice";
import { ModelFieldDoc, RequestParamDoc, REQUEST_PARAM_LOCATION } from "../../types";
import { EXAMPLE_TYPES } from "../ExampleFormModal/ExampleFormModal";
import { ModelFieldFormValues } from "../ModelForm/ModelForm";
import { RequestParamFormProps } from "./RequestParamForm";

export interface UseRequestParamFormPropsParams {
  location: REQUEST_PARAM_LOCATION;
}

const useRequestParamFormProps: (
  params: UseRequestParamFormPropsParams,
) => RequestParamFormProps = ({ location }: UseRequestParamFormPropsParams) => {
  const { projectId, project } = useProjectByParam();
  const { requestId } = useRequestByParam();

  const requestParams = useSelector(
    FirebaseSelectors.createRequestParamsSelector(projectId, requestId, location),
  );

  const dispatch = useDispatch();

  const onSubmitRequestParamForm = useCallback(
    (values: ModelFieldFormValues) => {
      dispatch(
        ProjectActions.submitRequestParamForm({
          ...values,
          requestId,
          location,
        }),
      );
    },
    [dispatch, location, requestId],
  );

  const onDeleteRequestParam = useCallback(
    (requestParam: ModelFieldDoc) => {
      dispatch(ProjectActions.deleteRequestParam(requestParam as RequestParamDoc));
    },
    [dispatch],
  );

  const submittingRequestParamActionsInProgress = useSelector(
    ProgressSelectors.selectSubmitRequestParamFormActions,
  );

  const checkIsSubmittingRequestParam = useCallback(
    (id?: string) => {
      return submittingRequestParamActionsInProgress.includes(
        `${ProjectActions.submitRequestParamForm}-${id}`,
      );
    },
    [submittingRequestParamActionsInProgress],
  );

  const role = useProjectRole(project);

  const userProfile = useSelector(FirebaseSelectors.selectUserProfile);

  const onClickExample = useCallback(
    (modelField: ModelFieldDoc) => {
      dispatch(
        UiActions.showExampleFormModal({
          modelField,
          type: EXAMPLE_TYPES.REQUEST_PARAM,
        }),
      );
    },
    [dispatch],
  );

  return {
    location,
    requestParams,
    onSubmitRequestParamForm,
    onDeleteRequestParam,
    checkIsSubmittingRequestParam,
    role,
    userProfile,
    onClickExample,
  };
};

export default useRequestParamFormProps;
