import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { assertNotEmpty } from "../../../helpers/commonHelpers";
import useLoading from "../../../hooks/useLoading";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import ProjectSelectors from "../../../store/Project/ProjectSelectors";
import { ProjectActions } from "../../../store/Project/ProjectSlice";
import { EnumerationDoc } from "../../../types";
import { EnumFormValues } from "./EnumForm";

const useEnumFormProps = () => {
  const project = useSelector(ProjectSelectors.selectCurrentProject);
  assertNotEmpty(project);

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

  return {
    enumerations,
    onSubmit,
    onDelete,
  };
};

export default useEnumFormProps;
