import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProjectSelectors from "../../../store/Project/ProjectSelectors";
import { ProjectActions } from "../../../store/Project/ProjectSlice";
import { EnumerationDoc } from "../../../types";
import EnumForm, { EnumFormValues } from "./EnumForm";

const EnumFormContainer = () => {
  const dispatch = useDispatch();

  const projectEnumerations = useSelector(
    ProjectSelectors.selectProjectEnumerations
  );

  const submitEnumForm = useCallback(
    (values: EnumFormValues) => {
      dispatch(ProjectActions.submitEnumForm(values));
    },
    [dispatch]
  );

  const deleteEnumeration = useCallback(
    (enumeration: EnumerationDoc) => {
      dispatch(ProjectActions.deleteEnumeration(enumeration));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(ProjectActions.listenToProjectEnumerations());
    return () => {
      dispatch(ProjectActions.unlistenToProjectEnumerations());
    };
  }, [dispatch]);

  return projectEnumerations ? (
    <EnumForm
      enumerations={projectEnumerations}
      onSubmit={submitEnumForm}
      onDelete={deleteEnumeration}
    />
  ) : null;
};

export default EnumFormContainer;
