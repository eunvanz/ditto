import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import useLoading from "../../../hooks/useLoading";
import useProjectRole from "../../../hooks/useProjectRole";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import { ProjectActions } from "../../../store/Project/ProjectSlice";
import { EnumerationDoc, ProjectDoc } from "../../../types";
import { EnumFormValues } from "./EnumForm";

export interface UseEnumFormPropsParams {
  project: ProjectDoc;
}

const useEnumFormProps = ({ project }: UseEnumFormPropsParams) => {
  useFirestoreConnect({
    collection: `projects/${project.id}/enumerations`,
    orderBy: ["createdAt", "asc"],
  });

  const enumerations = useSelector(
    FirebaseSelectors.createProjectEnumerationsSelector(project.id)
  );

  const dispatch = useDispatch();

  const onSubmit = useCallback(
    (values: EnumFormValues) => {
      dispatch(ProjectActions.submitEnumForm(values));
    },
    [dispatch]
  );

  const onDelete = useCallback(
    (enumeration: EnumerationDoc) => {
      dispatch(ProjectActions.deleteEnumeration(enumeration));
    },
    [dispatch]
  );

  useLoading(enumerations, `loadingExistingEnumerations-${project.id}`);

  const role = useProjectRole(project);

  return {
    enumerations,
    onSubmit,
    onDelete,
    role,
  };
};

export default useEnumFormProps;
