import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EnumFormValues } from "../../routes/ProjectManagement/EnumForm/EnumForm";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";
import ProjectSelectors from "../../store/Project/ProjectSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import { FIELD_TYPE } from "../../types";
import QuickEnumForm from "./QuickEnumForm";

const QuickEnumFormContainer = () => {
  const dispatch = useDispatch();

  const existingEnumerations = useSelector(
    ProjectSelectors.selectProjectEnumerations
  );
  const fieldType = useSelector(ProjectSelectors.selectFieldTypeToCreate);
  const isSubmitting = useSelector(
    ProgressSelectors.createInProgressSelector(
      ProjectActions.submitEnumForm.type
    )
  );

  const submitForm = useCallback(
    (values: EnumFormValues) => {
      dispatch(ProjectActions.submitQuickEnumForm(values));
    },
    [dispatch]
  );

  return (
    <QuickEnumForm
      existingEnumerations={existingEnumerations!}
      fieldType={fieldType as FIELD_TYPE.STRING | FIELD_TYPE.INTEGER}
      isSubmitting={isSubmitting}
      onSubmit={submitForm}
    />
  );
};

export default QuickEnumFormContainer;
