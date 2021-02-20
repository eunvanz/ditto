import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { assertNotEmpty } from "../../../../helpers/commonHelpers";
import FirebaseSelectors from "../../../../store/Firebase/FirebaseSelectors";
import ProjectSelectors from "../../../../store/Project/ProjectSelectors";
import { ProjectActions } from "../../../../store/Project/ProjectSlice";
import { RequestUrlFormValues } from "./RequestUrlForm";

const useRequestUrlFormProps = () => {
  const dispatch = useDispatch();

  const request = useSelector(ProjectSelectors.selectCurrentRequest);
  const project = useSelector(ProjectSelectors.selectCurrentProject);
  assertNotEmpty(project);

  const firestoreQuery = useMemo(() => {
    return {
      collection: `projects/${project.id}/urls`,
    };
  }, [project]);

  useFirestoreConnect(firestoreQuery);

  const baseUrls = useSelector(
    FirebaseSelectors.createProjectUrlsSelector(project.id)
  );

  const onSubmit = useCallback(
    (values: RequestUrlFormValues) => {
      dispatch(ProjectActions.submitRequestUrlForm(values));
    },
    [dispatch]
  );

  return {
    onSubmit,
    request,
    baseUrls,
  };
};

export default useRequestUrlFormProps;
