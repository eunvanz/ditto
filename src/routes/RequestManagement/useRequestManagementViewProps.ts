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
    doc: requestId,
  });

  const request = useSelector(
    FirebaseSelectors.createRequestSelectorByProjectIdAndRequestId(
      projectId,
      requestId
    )
  );

  useEffect(() => {
    if (isLoaded(request)) {
      dispatch(UiActions.hideLoading());
      dispatch(ProjectActions.receiveCurrentRequest(request));
    }
  }, [dispatch, request]);

  useEffect(() => {
    dispatch(UiActions.showDelayedLoading());
  }, [dispatch]);

  return { request, key: request?.id };
};

export default useRequestManagementViewProps;
