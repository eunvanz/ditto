import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthSelectors from "../../store/Auth/AuthSelector";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import { UiActions } from "../../store/Ui/UiSlice";
import DataSelectors from "../../store/Data/DataSelectors";
import { DATA_KEY } from "../../store/Data/DataSlice";

/**
 * 필수적인 데이터들을 로딩후에 하위 컴포넌트들을 렌더링
 */
export interface DataInitializerProps {
  children: React.ReactNode;
}

const DataInitializer: React.FC<DataInitializerProps> = ({ children }) => {
  const auth = useSelector(AuthSelectors.selectAuth);
  const projects = useSelector(
    DataSelectors.createDataKeySelector(DATA_KEY.PROJECTS)
  );

  const dispatch = useDispatch();

  const [isDataInitialized, setIsDataInitialized] = useState(false);

  useEffect(() => {
    if (auth.isLoaded) {
      if (!auth.isEmpty) {
        dispatch(ProjectActions.listenToMyProjects());
      } else {
        setIsDataInitialized(true);
        dispatch(UiActions.hideLoading());
      }
    }
  }, [auth.isEmpty, auth.isLoaded, dispatch]);

  useEffect(() => {
    if (!!projects) {
      setIsDataInitialized(true);
      dispatch(UiActions.hideLoading());
    }
  }, [dispatch, projects]);

  useEffect(() => {
    dispatch(UiActions.showLoading());
  }, [dispatch]);

  return <>{isDataInitialized ? children : null}</>;
};

export default DataInitializer;
