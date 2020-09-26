import { fork, take, all, put, call, select } from "typed-redux-saga";
import { ProjectActions } from "./ProjectSlice";
import { ProgressActions } from "../Progress/ProgressSlice";
import Firework from "../Firework";
import { UiActions } from "../Ui/UiSlice";
import AuthSelectors from "../Auth/AuthSelector";
import Alert from "../../components/Alert";
import { getTimestamp } from "../../firebase";
import { ErrorActions } from "../Error/ErrorSlice";
import { ProjectItem } from "../../types";
import { eventChannel } from "redux-saga";
import { DataActions, DATA_KEY } from "../Data/DataSlice";

export function* submitProjectFormFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.submitProjectForm);
    const auth = yield* select(AuthSelectors.selectAuth);

    // 로그인이 돼있지 않은 경우 로그인 유도
    if (auth.isEmpty) {
      yield* call(Alert.message, {
        title: "로그인 필요",
        message: "로그인이 필요한 기능입니다.",
      });
      yield* put(UiActions.hideProjectFormModal());
      yield* put(UiActions.showSignInModal());
      continue;
    }

    yield* all([
      put(ProgressActions.startProgress(type)),
      put(UiActions.showLoading()),
    ]);
    const timestamp = yield* call(getTimestamp);
    try {
      yield* call(Firework.addProject, {
        ...payload,
        members: {
          [auth.uid]: true,
        },
        owners: {
          [auth.uid]: true,
        },
        managers: {},
        guests: {},
        createdAt: timestamp,
        updatedAt: timestamp,
        createdBy: auth.uid,
        updatedBy: auth.uid,
      });
      yield* all([
        put(
          UiActions.showNotification({
            message: "새 프로젝트가 생성됐습니다.",
          })
        ),
        put(UiActions.hideProjectFormModal()),
      ]);
    } catch (error) {
      yield* put(ErrorActions.catchError({ error }));
    } finally {
      yield* all([
        put(ProgressActions.finishProgress(type)),
        put(UiActions.hideLoading()),
      ]);
    }
  }
}

export function createMyProjectsEventChannel(uid?: string) {
  const listener = eventChannel((emit) => {
    if (uid) {
      const myProjectRef = Firework.getMyProjectsRef(uid);
      myProjectRef.onSnapshot((querySnapshot) => {
        const projects: ProjectItem[] = [];
        querySnapshot.forEach((doc) => {
          projects.push(doc.data() as ProjectItem);
        });
        emit(projects);
      });
    }
    return () => {
      if (!uid) {
        listener.close();
      }
    };
  });
  return listener;
}

export function* watchOnMyProjectsEvent() {
  const auth = yield* select(AuthSelectors.selectAuth);
  const myProjectEventChannel = createMyProjectsEventChannel(auth.uid);
  while (true) {
    const myProjects = yield* take(myProjectEventChannel);

    yield* put(
      DataActions.receiveData({
        key: DATA_KEY.PROJECTS,
        data: myProjects as ProjectItem[],
      })
    );
  }
}

export function* listenToMyProjectsFlow() {
  while (true) {
    yield* take(ProjectActions.listenToMyProjects);
    yield* fork(watchOnMyProjectsEvent);
  }
}

export function* watchProjectActions() {
  yield* all([fork(submitProjectFormFlow), fork(listenToMyProjectsFlow)]);
}
