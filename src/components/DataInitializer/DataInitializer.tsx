import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthSelectors from "../../store/Auth/AuthSelector";
import { UiActions } from "../../store/Ui/UiSlice";
import { isLoaded, useFirestoreConnect } from "react-redux-firebase";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import { AuthActions } from "../../store/Auth/AuthSlice";

/**
 * 필수적인 데이터들을 로딩후에 하위 컴포넌트들을 렌더링
 */
export interface DataInitializerProps {
  children: React.ReactNode;
}

const DataInitializer: React.FC<DataInitializerProps> = ({ children }) => {
  const auth = useSelector(AuthSelectors.selectAuth);

  const [isDataInitialized, setIsDataInitialized] = useState(false);

  const firestoreQuery = useMemo(() => {
    if (!!auth.uid) {
      return [
        {
          collection: "projects",
          where: [[`members.${auth.uid}`, "==", true]],
        },
        {
          collection: "projects",
          doc: "hm9GA2J7sgF8bLKPF7fS",
          storeAs: "exampleProject",
        },
      ];
    } else {
      return [];
    }
  }, [auth.uid]);

  useFirestoreConnect(firestoreQuery as any);

  const projects = useSelector(FirebaseSelectors.selectMyProjects);

  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.isLoaded) {
      if (auth.isEmpty) {
        setIsDataInitialized(true);
        dispatch(UiActions.hideLoading("loadingProjects"));
      } else {
        dispatch(AuthActions.refreshProfile());
      }
    }
  }, [auth.isEmpty, auth.isLoaded, dispatch]);

  useEffect(() => {
    if (isLoaded(projects)) {
      setIsDataInitialized(true);
      dispatch(UiActions.hideLoading("loadingProjects"));
    }
  }, [dispatch, projects]);

  useEffect(() => {
    dispatch(UiActions.showLoading("loadingProjects"));
  }, [dispatch]);

  return <>{isDataInitialized ? children : null}</>;
};

export default DataInitializer;
