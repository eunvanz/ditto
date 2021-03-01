import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import useProjectByParam from "../../hooks/useProjectByParam";
import useRequestByParam from "../../hooks/useRequestByParam";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";

const useRequestBodyForm = () => {
  const { projectId } = useProjectByParam();
  const { requestId } = useRequestByParam();

  useFirestoreConnect({
    collection: `projects/${projectId}/requests/${requestId}/bodies`,
    orderBy: ["createdAt", "asc"],
  });

  const requestBodies = useSelector(
    FirebaseSelectors.createRequestBodiesSelector(projectId, requestId)
  );

  return { requestBodies: requestBodies || [] };
};

export default useRequestBodyForm;
