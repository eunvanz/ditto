import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isLoaded, useFirestoreConnect } from "react-redux-firebase";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import { UiActions } from "../../store/Ui/UiSlice";

const useRequestManagementViewProps = () => {
  useAuth({ isUserRequired: true });

  const dispatch = useDispatch();

  const { requestId, projectId } = useParams<{
    requestId: string;
    projectId: string;
  }>();

  useFirestoreConnect({
    collection: `projects/${projectId}/requests`,
  });

  const request = useSelector(
    FirebaseSelectors.createRequestSelectorByProjectIdAndRequestId(
      projectId,
      requestId
    )
  );
  const project = useSelector(
    FirebaseSelectors.createProjectSelectorByProjectId(projectId)
  );

  useEffect(() => {
    if (isLoaded(request)) {
      dispatch(UiActions.hideLoading());
    }
  }, [dispatch, request]);

  useEffect(() => {
    dispatch(UiActions.showDelayedLoading());
    if (project) {
      dispatch(ProjectActions.receiveCurrentProject(project));
    } else {
      // TODO: NOT FOUND 페이지로 이동
    }
  }, [dispatch, project]);

  return { request, key: request?.id };
};

export default useRequestManagementViewProps;
