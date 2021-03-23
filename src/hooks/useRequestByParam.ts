import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FirebaseSelectors from "../store/Firebase/FirebaseSelectors";

const useRequestByParam = () => {
  const { projectId, requestId } = useParams<{
    projectId: string;
    requestId: string;
  }>();

  const request = useSelector(
    FirebaseSelectors.createRequestSelectorByProjectIdAndRequestId(projectId, requestId),
  );

  return { request, requestId };
};

export default useRequestByParam;
