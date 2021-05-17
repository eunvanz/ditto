import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import cmp from "semver-compare";
import isEqual from "lodash/isEqual";
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
import ProjectSelectors from "../../store/Project/ProjectSelectors";

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

  const projects = useSelector(FirebaseSelectors.selectOrderedMyProjects);
  const appInfo = useSelector(FirebaseSelectors.selectAppInfo);
  const groups = useSelector(ProjectSelectors.selectGroups);
  const requests = useSelector(ProjectSelectors.selectRequests);

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
    projects.forEach((project) => {
      if (project) {
        query.push({
          collection: `projects/${project.id}/groups`,
          orderBy: ["createdAt", "asc"],
        });
        query.push({
          collection: `projects/${project.id}/requests`,
          orderBy: ["createdAt", "asc"],
        });
      }
    });
    return query;
  }, [auth.uid, projects]);

  useFirestoreConnect(firestoreQuery);

  const dispatch = useDispatch();

  const groupedProjectGroups = useSelector(
    FirebaseSelectors.createGroupedProjectGroupsSelector(
      projects.map((project) => project.id),
    ),
  );

  useEffect(() => {
    if (!isEqual(groupedProjectGroups, groups)) {
      dispatch(ProjectActions.receiveLatestGroups(groupedProjectGroups));
    }
  }, [dispatch, groupedProjectGroups, groups]);

  useEffect(() => {
    if (groups) {
      const keys = Object.keys(groups);
      if (
        keys.some((key) => groups[key].some((group) => group.isFirstItem === undefined))
      ) {
        dispatch(ProjectActions.refactorGroupsAsLinkedList());
      }
    }
  }, [dispatch, groups]);

  const groupedProjectRequests = useSelector(
    FirebaseSelectors.createGroupedProjectRequestsSelector(
      projects.map((project) => project.id),
    ),
  );

  useEffect(() => {
    if (!isEqual(groupedProjectRequests, requests)) {
      dispatch(ProjectActions.receiveLatestRequests(groupedProjectRequests));
    }
  }, [dispatch, groupedProjectRequests, requests]);

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
