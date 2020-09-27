import { fork, take, all, put, call, select } from "typed-redux-saga";
import orderBy from "lodash/orderBy";
import { ProjectActions } from "./ProjectSlice";
import { ProgressActions } from "../Progress/ProgressSlice";
import Firework from "../Firework";
import { UiActions } from "../Ui/UiSlice";
import AuthSelectors from "../Auth/AuthSelector";
import Alert from "../../components/Alert";
import { getTimestamp } from "../../firebase";
import { ErrorActions } from "../Error/ErrorSlice";
import { ProjectItem, ProjectDoc } from "../../types";
import { eventChannel } from "redux-saga";
import { DataActions, DATA_KEY } from "../Data/DataSlice";
import UiSelectors from "../Ui/UiSelectors";
import { RootState } from "..";

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

    const projectFormModalState = yield* select(
      UiSelectors.selectProjectFormModal
    );

    const isModification = !!projectFormModalState.project;

    yield* all([
      put(ProgressActions.startProgress(type)),
      put(UiActions.showLoading()),
    ]);
    const timestamp = yield* call(getTimestamp);
    const projectCount = yield* select(
      (state: RootState) => state.data[DATA_KEY.PROJECTS]?.length
    );
    try {
      if (isModification) {
        yield* call(Firework.updateProject, projectFormModalState.project!.id, {
          ...payload,
          updatedAt: timestamp,
          updatedBy: auth.uid,
          [`settingsByMember.${auth.uid}.updatedAt`]: timestamp,
        });
      } else {
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
          settingsByMember: {
            [auth.uid]: {
              updatedAt: timestamp,
              seq: projectCount ? projectCount + 1 : 1,
            },
          },
        });
      }
      yield* all([
        put(
          UiActions.showNotification({
            message: isModification
              ? "프로젝트 설정이 변경되었습니다."
              : "새 프로젝트가 생성됐습니다.",
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
      const unsubscribe = myProjectRef.onSnapshot((querySnapshot) => {
        const projects: ProjectItem[] = [];
        querySnapshot.forEach((doc) => {
          projects.push({ id: doc.id, ...doc.data() } as ProjectDoc);
        });
        emit(orderBy(projects, [`settingsByMember.${uid}.seq`], ["asc"]));
      });
      return unsubscribe;
    } else {
      return () => {};
    }
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

export function* deleteProjectFlow() {
  while (true) {
    const { payload: project } = yield* take(ProjectActions.deleteProject);
    const isConfirmed = yield* call(Alert.confirm, {
      title: "프로젝트 삭제",
      message:
        "프로젝트 하위의 작업들이 모두 삭제됩니다. 정말 프로젝트를 삭제하시겠습니까?",
    });
    if (isConfirmed) {
      try {
        yield* put(UiActions.showLoading());
        yield* call(Firework.deleteProject, project.id);
      } catch (error) {
        yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
      } finally {
        yield* put(UiActions.hideLoading());
        yield* put(
          UiActions.showNotification({
            message: "프로젝트가 삭제됐습니다.",
            type: "success",
          })
        );
      }
    }
  }
}

export function* watchProjectActions() {
  yield* all([
    fork(submitProjectFormFlow),
    fork(listenToMyProjectsFlow),
    fork(deleteProjectFlow),
  ]);
}
