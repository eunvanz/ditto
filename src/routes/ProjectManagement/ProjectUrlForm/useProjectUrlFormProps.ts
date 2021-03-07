import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import useLoading from "../../../hooks/useLoading";
import useProjectByParam from "../../../hooks/useProjectByParam";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import { ProjectActions } from "../../../store/Project/ProjectSlice";
import { ProjectUrlDoc } from "../../../types";
import { ProjectUrlFormValues } from "./ProjectUrlForm";

const useProjectUrlFormProps = () => {
  const { projectId } = useProjectByParam();

  useFirestoreConnect({
    collection: `projects/${projectId}/urls`,
    orderBy: ["createdAt", "asc"],
  });

  const dispatch = useDispatch();

  const onSubmit = useCallback(
    (values: ProjectUrlFormValues) => {
      dispatch(ProjectActions.submitProjectUrlForm(values));
    },
    [dispatch]
  );

  const onDelete = useCallback(
    (projectUrl: ProjectUrlDoc) => {
      dispatch(ProjectActions.deleteProjectUrl(projectUrl));
    },
    [dispatch]
  );

  const projectUrls = useSelector(
    FirebaseSelectors.createProjectUrlsSelector(projectId)
  );

  useLoading(projectUrls, `loadingProjectUrls-${projectId}`);

  return {
    onSubmit,
    onDelete,
    projectUrls,
  };
};

export default useProjectUrlFormProps;
