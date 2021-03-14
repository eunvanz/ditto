import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import cmp from "semver-compare";
import AuthSelectors from "../../store/Auth/AuthSelector";
import { UiActions } from "../../store/Ui/UiSlice";
import {
  isLoaded,
  ReduxFirestoreQuerySetting,
  useFirestoreConnect,
} from "react-redux-firebase";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import { AuthActions } from "../../store/Auth/AuthSlice";
import { APP_VERSION } from "../../constants";

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
    const query: ReduxFirestoreQuerySetting[] = [
      {
        collection: "app",
        doc: "info",
      },
    ];
    if (!!auth.uid) {
      query.push({
        collection: "projects",
        where: [[`members.${auth.uid}`, "==", true]],
      });
      query.push({
        collection: "projects",
        doc: "hm9GA2J7sgF8bLKPF7fS",
        storeAs: "exampleProject",
      });
    }
    return query;
  }, [auth.uid]);

  useFirestoreConnect(firestoreQuery);

  const projects = useSelector(FirebaseSelectors.selectMyProjects);
  const appInfo = useSelector(FirebaseSelectors.selectAppInfo);

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

  useEffect(() => {
    if (appInfo && cmp(appInfo.version, APP_VERSION) > 0) {
      dispatch(
        UiActions.showConfirmSnackbar({
          message: "New version is available!",
          confirmText: "Reload",
          confirmAction: UiActions.reloadApp(),
        })
      );
    }
  }, [appInfo, dispatch]);

  return <>{isDataInitialized ? children : null}</>;
};

export default DataInitializer;
