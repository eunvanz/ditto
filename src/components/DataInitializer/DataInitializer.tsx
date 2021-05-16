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
import { APP_VERSION, EXAMPLE_PROJECT_ID } from "../../constants";
import { ProjectActions } from "../../store/Project/ProjectSlice";

/**
 * 필수적인 데이터들을 로딩후에 하위 컴포넌트들을 렌더링
 */
export interface DataInitializerProps {
  children: React.ReactNode;
}

const DataInitializer: React.FC<DataInitializerProps> = ({ children }) => {
  const auth = useSelector(AuthSelectors.selectAuth);
  const userProfile = useSelector(FirebaseSelectors.selectUserProfile);

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
        doc: EXAMPLE_PROJECT_ID,
        storeAs: "exampleProject",
      });
    }
    return query;
  }, [auth.uid]);

  useFirestoreConnect(firestoreQuery);

  const projects = useSelector(FirebaseSelectors.selectOrderedMyProjects);
  const appInfo = useSelector(FirebaseSelectors.selectAppInfo);

  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.isLoaded) {
      if (auth.isEmpty) {
        setIsDataInitialized(true);
        dispatch(UiActions.hideLoading("loadingProjects"));
      } else {
        dispatch(AuthActions.refreshProfile());
        userProfile.theme && dispatch(UiActions.receiveTheme(userProfile.theme));
        userProfile.screenMode &&
          dispatch(UiActions.receiveScreenMode(userProfile.screenMode));
      }
    }
  }, [auth.isEmpty, auth.isLoaded, dispatch, userProfile.screenMode, userProfile.theme]);

  useEffect(() => {
    if (auth.isEmpty) {
      return;
    }
    if (isLoaded(projects)) {
      setIsDataInitialized(true);
      // 프로젝트들이 seq 기반의 정렬을 사용할 경우 linkedList 방식으로 리팩토링
      if (
        projects.some(
          (project) => project.settingsByMember[auth.uid]?.isFirstItem === undefined,
        )
      ) {
        dispatch(ProjectActions.refactorProjectsAsLinkedList());
      }
      dispatch(ProjectActions.receiveLatestMyProjects(projects));
      dispatch(UiActions.hideLoading("loadingProjects"));
    } else {
      dispatch(UiActions.showLoading("loadingProjects"));
    }
  }, [auth.isEmpty, auth.uid, dispatch, projects]);

  useEffect(() => {
    if (appInfo && cmp(appInfo.version, APP_VERSION) > 0) {
      dispatch(
        UiActions.showConfirmSnackbar({
          message: `New version ${appInfo.version} is available!`,
          confirmText: "Reload",
          confirmAction: UiActions.reloadApp(),
        }),
      );
    }
  }, [appInfo, dispatch]);

  return <>{isDataInitialized ? children : null}</>;
};

export default DataInitializer;
