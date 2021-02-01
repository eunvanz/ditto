import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";
import ProjectSelectors from "../../store/Project/ProjectSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import { ModelNameFormValues } from "../ModelForm/ModelNameForm";
import QuickModelNameForm from "./QuickModelNameForm";

const QuickModelNameFormContainer = () => {
  const dispatch = useDispatch();

  const projectModels = useSelector(ProjectSelectors.selectProjectModels);
  const isSubmitting = useSelector(
    ProgressSelectors.createInProgressSelector(
      ProjectActions.submitModelNameForm.type
    )
  );

  const submitModel = useCallback(
    (data: ModelNameFormValues) => {
      dispatch(ProjectActions.submitQuickModelNameForm(data));
    },
    [dispatch]
  );

  const existingModelNames = useMemo(() => {
    // TODO: defaultValue가 존재할 경우 자기자신은 빼는 로직 필요
    return projectModels?.map((item) => item.name) || [];
  }, [projectModels]);

  return (
    <QuickModelNameForm
      onSubmit={submitModel}
      isSubmitting={isSubmitting}
      existingModelNames={existingModelNames}
    />
  );
};

export default QuickModelNameFormContainer;
