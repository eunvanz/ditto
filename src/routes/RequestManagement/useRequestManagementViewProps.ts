import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isLoaded, useFirestoreConnect } from "react-redux-firebase";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import UiSelectors from "../../store/Ui/UiSelectors";
import { UiActions } from "../../store/Ui/UiSlice";

const useRequestManagementViewProps = () => {
  const { auth } = useAuth({ isUserRequired: true });

  const dispatch = useDispatch();

  const { requestId, projectId } = useParams<{
    requestId: string;
    projectId: string;
  }>();

  const firestoreQuery = useMemo(() => {
    return [
      {
        collection: `projects/${projectId}/requests/${requestId}/params`,
        orderBy: ["createdAt", "asc"],
      },
      {
        collection: `projects/${projectId}/requests`,
        orderBy: ["createdAt", "asc"],
      },
    ];
  }, [projectId, requestId]);

  useFirestoreConnect(firestoreQuery as any);

  const request = useSelector(
    FirebaseSelectors.createRequestSelectorByProjectIdAndRequestId(
      projectId,
      requestId
    )
  );
  const project = useSelector(
    FirebaseSelectors.createProjectSelectorByProjectId(projectId)
  );

  const requests = useSelector(
    FirebaseSelectors.createProjectRequestsSelector(projectId)
  );

  const [isNotExist, setIsNotExist] = useState(false);

  useEffect(() => {
    if (isLoaded(requests)) {
      dispatch(UiActions.hideLoading(`loadingRequests-${projectId}`));
      if (!request) {
        setIsNotExist(true);
      }
    } else if (auth.isEmpty) {
      dispatch(UiActions.hideLoading(`loadingRequests-${projectId}`));
      dispatch(UiActions.showSignInModal());
    } else {
      dispatch(
        UiActions.showDelayedLoading({
          taskName: `loadingRequests-${projectId}`,
        })
      );
    }
  }, [auth.isEmpty, dispatch, projectId, request, requests]);

  useEffect(() => {
    if (project) {
      dispatch(ProjectActions.receiveCurrentProject(project));
    }
  }, [dispatch, project]);

  const screenMode = useSelector(UiSelectors.selectScreenMode);

  return { request, key: request?.id, isNotExist, screenMode };
};

export default useRequestManagementViewProps;
