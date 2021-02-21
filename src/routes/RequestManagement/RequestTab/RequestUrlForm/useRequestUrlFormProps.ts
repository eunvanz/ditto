import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import useProjectByParam from "../../../../hooks/useProjectByParam";
import useRequestByParam from "../../../../hooks/useRequestByParam";
import FirebaseSelectors from "../../../../store/Firebase/FirebaseSelectors";
import { ProjectActions } from "../../../../store/Project/ProjectSlice";
import UiSelectors from "../../../../store/Ui/UiSelectors";
import { RequestUrlFormValues } from "./RequestUrlForm";

const useRequestUrlFormProps = () => {
  const dispatch = useDispatch();

  const { project, projectId } = useProjectByParam();
  const { request } = useRequestByParam();

  const firestoreQuery = useMemo(() => {
    if (projectId) {
      return {
        collection: `projects/${projectId}/urls`,
        orderBy: ["createdAt", "asc"],
      };
    } else {
      return [];
    }
  }, [projectId]);

  useFirestoreConnect(firestoreQuery as any);

  const baseUrls = useSelector(
    FirebaseSelectors.createProjectUrlsSelector(project?.id || "")
  );

  const onSubmit = useCallback(
    (values: RequestUrlFormValues) => {
      dispatch(ProjectActions.submitRequestUrlForm(values));
    },
    [dispatch]
  );

  const { isVisible } = useSelector(UiSelectors.selectQuickUrlFormModal);

  const [key, setKey] = useState(0);

  useEffect(() => {
    if (isVisible) {
      return () => setKey((key) => key + 1);
    }
  }, [isVisible]);

  return {
    onSubmit,
    request,
    baseUrls,
    key,
  };
};

export default useRequestUrlFormProps;
