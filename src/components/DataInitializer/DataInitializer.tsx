import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthSelectors from "../../store/Auth/AuthSelector";
import { ProjectActions } from "../../store/Project/ProjectSlice";

export interface DataInitializerProps {
  children: React.ReactNode;
}

const DataInitializer: React.FC<DataInitializerProps> = ({ children }) => {
  const auth = useSelector(AuthSelectors.selectAuth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.isLoaded) {
      dispatch(ProjectActions.listenToMyProjects());
    }
  }, [auth.isLoaded, dispatch]);

  return <>{children}</>;
};

export default DataInitializer;
