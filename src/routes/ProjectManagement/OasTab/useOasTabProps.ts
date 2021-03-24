import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import useProjectByParam from "../../../hooks/useProjectByParam";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import UiSelectors from "../../../store/Ui/UiSelectors";

const useOasTabProps = () => {
  const { project } = useProjectByParam();
  const requests = useSelector(
    FirebaseSelectors.createProjectRequestsSelector(project?.id || ""),
  );

  const responseStatuses = useSelector(
    FirebaseSelectors.createProjectResponseStatuses(project?.id || ""),
  );

  const models = useSelector(
    FirebaseSelectors.createProjectModelsSelector(project?.id || ""),
  );

  const oas = useSelector(
    FirebaseSelectors.createProjectOpenApiSpecSelector(project?.id || ""),
  );

  const theme = useSelector(UiSelectors.selectTheme);

  const firestoreQuery = useMemo(() => {
    if (project) {
      const result = [];
      result.push({
        collection: `projects/${project.id}/models`,
        orderBy: ["createdAt", "asc"],
      });
      result.push({
        collection: `projects/${project.id}/groups`,
        orderBy: ["createdAt", "asc"],
      });
      result.push({
        collection: `projects/${project.id}/requests`,
        orderBy: ["createdAt", "asc"],
      });
      result.push({
        collection: `projects/${project.id}/urls`,
        orderBy: ["createdAt", "asc"],
      });
      result.push({
        collection: `projects/${project.id}/enumerations`,
        orderBy: ["createdAt", "asc"],
      });
      if (requests) {
        requests.forEach((request) => {
          result.push({
            collection: `projects/${project.id}/requests/${request.id}/responseStatuses`,
            orderBy: ["createdAt", "asc"],
          });
          result.push({
            collection: `projects/${project.id}/requests/${request.id}/params`,
            orderBy: ["createdAt", "asc"],
          });
          result.push({
            collection: `projects/${project.id}/requests/${request.id}/bodies`,
            orderBy: ["createdAt", "asc"],
          });
        });
      }
      if (responseStatuses) {
        responseStatuses.forEach((responseStatus) => {
          result.push({
            collection: `projects/${project.id}/requests/${responseStatus.requestId}/responseStatuses/${responseStatus.id}/bodies`,
            orderBy: ["createdAt", "asc"],
          });
          result.push({
            collection: `projects/${project.id}/requests/${responseStatus.requestId}/responseStatuses/${responseStatus.id}/headers`,
            orderBy: ["createdAt", "asc"],
          });
        });
      }
      if (models) {
        models.forEach((model) => {
          result.push({
            collection: `projects/${project.id}/models/${model.id}/modelFields`,
            orderBy: ["createdAt", "asc"],
          });
        });
      }
      return result;
    } else {
      return {};
    }
  }, [models, project, requests, responseStatuses]);

  useFirestoreConnect(firestoreQuery);

  const progress = useSelector(FirebaseSelectors.selectProgress);

  return {
    data: oas,
    theme,
    progress,
  };
};

export default useOasTabProps;
