import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { ProjectActions } from "../store/Project/ProjectSlice";
import { ModelDoc } from "../types";

const useModelCodes = (model?: ModelDoc) => {
  const dispatch = useDispatch();

  const onShowMockDataModal = useCallback(() => {
    if (model) {
      dispatch(ProjectActions.generateMockData(model));
    }
  }, [dispatch, model]);

  const onShowTypescriptInterfaceModal = useCallback(() => {
    if (model) {
      dispatch(ProjectActions.generateTypescriptInterface(model));
    }
  }, [dispatch, model]);

  return {
    onShowMockDataModal,
    onShowTypescriptInterfaceModal,
  };
};

export default useModelCodes;
