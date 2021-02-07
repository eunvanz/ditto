import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import useProjectByParam from "../../../hooks/useProjectByParam";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import { ProjectActions } from "../../../store/Project/ProjectSlice";
import { UiActions } from "../../../store/Ui/UiSlice";
import { ProjectUrlDoc } from "../../../types";
import { ProjectUrlFormProps, ProjectUrlFormValues } from "./ProjectUrlForm";

const useProjectUrlFormProps: () => ProjectUrlFormProps = () => {
  const { projectId } = useProjectByParam();

  useFirestoreConnect({
    storeAs: "projectUrls",
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

  const projectUrls = useSelector(FirebaseSelectors.selectProjectUrls);

  useEffect(() => {
    if (!projectUrls) {
      dispatch(UiActions.showLoading());
    } else {
      dispatch(UiActions.hideLoading());
    }
  }, [dispatch, projectUrls]);

  return {
    onSubmit,
    onDelete,
    projectUrls,
  };
};

export default useProjectUrlFormProps;
