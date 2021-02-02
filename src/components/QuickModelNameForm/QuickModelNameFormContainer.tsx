import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";
import ProjectSelectors from "../../store/Project/ProjectSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import UiSelectors from "../../store/Ui/UiSelectors";
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
  const { model } = useSelector(UiSelectors.selectQuickModelNameFormModal);

  const submitModel = useCallback(
    (data: ModelNameFormValues) => {
      dispatch(
        ProjectActions.submitQuickModelNameForm({ ...data, target: model })
      );
    },
    [dispatch, model]
  );

  const existingModelNames = useMemo(() => {
    const allModelNames = projectModels?.map((item) => item.name) || [];
    if (model) {
      return allModelNames.filter((item) => item !== model.name);
    }
    return allModelNames;
  }, [model, projectModels]);

  const defaultValues = useMemo(() => {
    if (model) {
      return {
        name: model.name,
        description: model.description || "",
      };
    }
    return undefined;
  }, [model]);

  return (
    <QuickModelNameForm
      onSubmit={submitModel}
      isSubmitting={isSubmitting}
      existingModelNames={existingModelNames}
      defaultValues={defaultValues}
    />
  );
};

export default QuickModelNameFormContainer;
