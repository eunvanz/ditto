import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assertNotEmpty } from "../../helpers/commonHelpers";
import useLoading from "../../hooks/useLoading";
import { EnumFormValues } from "../../routes/ProjectManagement/EnumForm/EnumForm";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";
import ProjectSelectors from "../../store/Project/ProjectSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import UiSelectors from "../../store/Ui/UiSelectors";
import { FIELD_TYPE } from "../../types";
import QuickEnumForm from "./QuickEnumForm";

const QuickEnumFormContainer = () => {
  const dispatch = useDispatch();

  const project = useSelector(ProjectSelectors.selectCurrentProject);
  assertNotEmpty(project);

  const { enumeration } = useSelector(UiSelectors.selectQuickEnumFormModal);

  const existingEnumerations = useSelector(
    FirebaseSelectors.createProjectEnumerationsSelector(project.id),
  );

  const fieldType = useSelector(ProjectSelectors.selectFieldTypeToCreate);

  const isSubmitting = useSelector(
    ProgressSelectors.createInProgressSelector(ProjectActions.submitEnumForm.type),
  );

  const submitForm = useCallback(
    (values: EnumFormValues) => {
      if (enumeration) {
        dispatch(ProjectActions.submitEnumForm({ ...values, target: enumeration }));
      } else {
        dispatch(ProjectActions.submitQuickEnumForm(values));
      }
    },
    [dispatch, enumeration],
  );

  useLoading(existingEnumerations, `loadingExistingEnumerations-${project.id}`);

  return (
    <QuickEnumForm
      existingEnumerations={existingEnumerations?.filter(
        (item) => item.id !== enumeration?.id,
      )}
      fieldType={
        (enumeration?.fieldType as FIELD_TYPE.STRING | FIELD_TYPE.INTEGER) ||
        (fieldType as FIELD_TYPE.STRING | FIELD_TYPE.INTEGER)
      }
      isSubmitting={isSubmitting}
      onSubmit={submitForm}
      enumeration={enumeration}
    />
  );
};

export default QuickEnumFormContainer;
