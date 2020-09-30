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
import { eventChannel, EventChannel } from "redux-saga";
import { DataActions, DATA_KEY } from "../Data/DataSlice";
import { RootState } from "..";
import DataSelectors from "../Data/DataSelectors";
import { AuthActions } from "../Auth/AuthSlice";
import { requireSignIn } from "../Auth/AuthSaga";

export function* submitProjectFormFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.submitProjectForm);
    const auth = yield* select(AuthSelectors.selectAuth);

    const isLogOn = yield* call(requireSignIn);
    if (!isLogOn) {
      continue;
    }

    const project = yield* select(
      DataSelectors.createDataKeySelector(DATA_KEY.PROJECT)
    );

    const isModification = payload.type === "modify";

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
        yield* call(Firework.updateProject, (project as ProjectDoc).id, {
          ...payload.data,
        });
      } else {
        yield* call(Firework.addProject, {
          ...payload.data,
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

export function createMyProjectsEventChannel(uid: string) {
  const listener = eventChannel((emit) => {
    const myProjectRef = Firework.getMyProjectsRef(uid);
    const unsubscribe = myProjectRef.onSnapshot((querySnapshot) => {
      const projects: ProjectDoc[] = [];
      querySnapshot.forEach((doc) => {
        projects.push({ id: doc.id, ...doc.data() } as ProjectDoc);
      });
      emit(orderBy(projects, [`settingsByMember.${uid}.seq`], ["asc"]));
    });
    return unsubscribe;
  });
  return listener;
}

export function* listenToMyProjectsFlow() {
  while (true) {
    yield* take(ProjectActions.listenToMyProjects);
    const auth = yield* select(AuthSelectors.selectAuth);
    if (auth.uid) {
      const myProjectEventChannel = createMyProjectsEventChannel(auth.uid);
      while (true) {
        const myProjects = yield* take(myProjectEventChannel);

        yield* put(
          DataActions.receiveData({
            key: DATA_KEY.PROJECTS,
            data: myProjects as ProjectItem[],
          })
        );

        yield* fork(waitForUnlistenToMyProject, myProjectEventChannel);
      }
    } else {
      yield* put(
        DataActions.receiveData({
          key: DATA_KEY.PROJECTS,
          data: [],
        })
      );
    }
  }
}

export function* waitForUnlistenToMyProject(
  myProjectEventChannel: EventChannel<any>
) {
  while (true) {
    yield* take(AuthActions.signOut);
    yield* call(myProjectEventChannel.close);
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

export function* submitProjectUrlFormFlow() {
  while (true) {
    const {
      payload: { data, targetId },
    } = yield* take(ProjectActions.submitProjectUrlForm);
    const auth = yield* select(AuthSelectors.selectAuth);

    const isLogOn = yield* call(requireSignIn);
    if (!isLogOn) {
      continue;
    }

    const isModification = !!targetId;

    // @ts-ignore
    const { id: projectId }: ProjectDoc = yield* select(
      DataSelectors.createDataKeySelector(DATA_KEY.PROJECT)
    );
    const timestamp = yield* call(getTimestamp);

    if (isModification) {
    } else {
      yield* call(
        Firework.addProjectUrl,
        {
          ...data,
          createdAt: timestamp,
          updatedAt: timestamp,
          createdBy: auth.uid,
          updatedBy: auth.uid,
          settingsByMember: {
            [auth.uid]: {
              updatedAt: timestamp,
            },
          },
        },
        projectId
      );
    }
  }
}

export function* watchProjectActions() {
  yield* all([
    fork(submitProjectFormFlow),
    fork(listenToMyProjectsFlow),
    fork(deleteProjectFlow),
    fork(submitProjectUrlFormFlow),
  ]);
}
