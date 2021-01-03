import { fork, take, all, put, call, select, race } from "typed-redux-saga";
import orderBy from "lodash/orderBy";
import { ProjectActions } from "./ProjectSlice";
import { ProgressActions } from "../Progress/ProgressSlice";
import Firework from "../Firework";
import { UiActions } from "../Ui/UiSlice";
import AuthSelectors from "../Auth/AuthSelector";
import Alert from "../../components/Alert";
import { getTimestamp } from "../../firebase";
import { ErrorActions } from "../Error/ErrorSlice";
import {
  ProjectDoc,
  ProjectUrlDoc,
  ModelItem,
  ModelDoc,
  ModelFieldItem,
  ModelFieldDoc,
  ModifiableModelFieldItem,
} from "../../types";
import { eventChannel, EventChannel } from "redux-saga";
import { DataActions, DATA_KEY } from "../Data/DataSlice";
import { RootState } from "..";
import DataSelectors from "../Data/DataSelectors";
import { AuthActions } from "../Auth/AuthSlice";
import { requireSignIn } from "../Auth/AuthSaga";
import {
  assertNotEmpty,
  getPathFromLocation,
} from "../../helpers/commonHelpers";
import { PayloadAction, ActionCreator, Action } from "@reduxjs/toolkit";
import history from "../../helpers/history";
import ROUTE from "../../paths";

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
    const unsubscribe = myProjectRef.onSnapshot(
      (querySnapshot) => {
        const projects: ProjectDoc[] = [];
        querySnapshot.forEach((doc) => {
          projects.push({ id: doc.id, ...doc.data() } as ProjectDoc);
        });
        emit(orderBy(projects, [`settingsByMember.${uid}.seq`], ["asc"]));
      },
      (error) => {
        emit(error);
      }
    );
    return unsubscribe;
  });
  return listener;
}

export function* listenToMyProjectsFlow() {
  while (true) {
    yield* take(ProjectActions.listenToMyProjects);
    const auth = yield* select(AuthSelectors.selectAuth);
    if (auth.uid) {
      try {
        const myProjectEventChannel = createMyProjectsEventChannel(auth.uid);

        yield* fork(listenToEventChannel, {
          eventChannel: myProjectEventChannel,
          dataReceiverCreator: (data: ProjectDoc[]) =>
            DataActions.receiveData({
              key: DATA_KEY.PROJECTS,
              data,
            }),
          unlistenWaiter: waitForUnlistenToMyProject,
        });
      } catch (error) {
        yield* put(
          ErrorActions.catchError({
            error,
            retryPath: getPathFromLocation(window.location),
          })
        );
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
    yield* put(DataActions.clearData(DATA_KEY.PROJECTS));
    break;
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
    const { payload: data } = yield* take(ProjectActions.submitProjectUrlForm);
    const auth = yield* select(AuthSelectors.selectAuth);

    const isLogOn = yield* call(requireSignIn);
    if (!isLogOn) {
      continue;
    }

    const isModification = !!data.target;

    const project = yield* select(
      DataSelectors.createDataKeySelector(DATA_KEY.PROJECT)
    );
    assertNotEmpty(project);
    const { id: projectId } = project as ProjectDoc;
    const timestamp = yield* call(getTimestamp);

    try {
      if (isModification) {
        assertNotEmpty(data.target);
        const targetId = data.target?.id;
        delete data.target;
        const newProjectUrl = {
          ...data,
          projectId,
          updatedAt: timestamp,
          updatedBy: auth.uid,
          settingsByMember: {
            [auth.uid]: {
              updatedAt: timestamp,
            },
          },
        };
        yield* call(Firework.updateProjectUrl, targetId, newProjectUrl);
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "URL 정보를 수정했습니다.",
          })
        );
      } else {
        const newProjectUrl = {
          ...data,
          projectId,
          createdAt: timestamp,
          updatedAt: timestamp,
          createdBy: auth.uid,
          updatedBy: auth.uid,
          settingsByMember: {
            [auth.uid]: {
              updatedAt: timestamp,
            },
          },
        };
        delete newProjectUrl.target;
        yield* call(Firework.addProjectUrl, newProjectUrl);
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "URL을 추가했습니다.",
          })
        );
      }
    } catch (error) {
      yield* put(
        ErrorActions.catchError({
          error: new Error(
            "데이터 처리 도중에 오류가 발생했습니다. 반복될 경우 고객센터에 문의해주세요."
          ),
          isAlertOnly: true,
        })
      );
    }
  }
}

export function createProjectUrlEventChannel(projectId: string) {
  const listener = eventChannel((emit) => {
    const projectUrlRef = Firework.getProjectUrlRef(projectId);
    const unsubscribe = projectUrlRef.onSnapshot((querySnapshot) => {
      const projectUrls: ProjectUrlDoc[] = [];
      querySnapshot.forEach((doc) => {
        projectUrls.push({ id: doc.id, ...doc.data() } as ProjectUrlDoc);
      });
      emit(projectUrls);
    });
    return unsubscribe;
  });
  return listener;
}

export function* waitForUnlistenProjectUrl(
  projectUrlEventChannel: EventChannel<any>
) {
  while (true) {
    const [isSignedOut] = yield* race([
      take(AuthActions.signOut),
      take(ProjectActions.unlistenToProjectUrls),
    ]);
    yield* call(projectUrlEventChannel.close);
    // 데이터를 클리어 하지 않는게 나을까?
    if (isSignedOut) {
      yield* put(DataActions.clearData(DATA_KEY.PROJECT_URLS));
    }
    break;
  }
}

export function* listenToEventChannel({
  eventChannel,
  unlistenWaiter,
  dataReceiverCreator,
}: {
  eventChannel: EventChannel<any>;
  unlistenWaiter: (eventChannel: EventChannel<any>) => Generator<any>;
  dataReceiverCreator: (data: any) => PayloadAction<any>;
}) {
  while (true) {
    try {
      const data = yield* take(eventChannel);
      yield* put(dataReceiverCreator(data));
      yield* fork(unlistenWaiter, eventChannel);
    } catch (error) {
      put(
        ErrorActions.catchError({
          error,
          isAlertOnly: true,
        })
      );
    }
  }
}

export function* listenToProjectUrlsFlow() {
  while (true) {
    yield* take(ProjectActions.listenToProjectUrls);
    const project = yield* select(
      DataSelectors.createDataKeySelector(DATA_KEY.PROJECT)
    );
    if (!project) {
      yield* put(
        ErrorActions.catchError({
          error: new Error("선택되어있는 프로젝트가 없습니다."),
          isAlertOnly: true,
        })
      );
      continue;
    }
    const projectId = (project as ProjectDoc).id;
    const projectUrlEventChannel = createProjectUrlEventChannel(projectId);

    yield* fork(listenToEventChannel, {
      eventChannel: projectUrlEventChannel,
      unlistenWaiter: waitForUnlistenProjectUrl,
      dataReceiverCreator: (data) =>
        DataActions.receiveRecordData({
          key: DATA_KEY.PROJECT_URLS,
          recordKey: projectId,
          data,
        }),
    });
  }
}

export function* deleteProjectUrlFlow() {
  while (true) {
    const { payload: projectUrl } = yield* take(
      ProjectActions.deleteProjectUrl
    );
    const usingRequests = Object.keys(projectUrl.usedByRequest || {});
    const isUsedBySome =
      projectUrl.usedByRequest &&
      usingRequests.some((item) => projectUrl.usedByRequest?.[item]);

    if (isUsedBySome) {
      yield* call(Alert.message, {
        title: "삭제 불가",
        message: "사용하고 있는 리퀘스트가 있어서 삭제가 불가합니다.",
      });
      continue;
    }
    try {
      yield* put(UiActions.showDelayedLoading());
      yield* call(Firework.deleteProjectUrl, projectUrl);
      yield* put(
        UiActions.showNotification({
          type: "success",
          message: "URL이 삭제되었습니다.",
        })
      );
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    } finally {
      yield* put(UiActions.hideLoading());
    }
  }
}

export function* deleteModelFieldFlow() {
  while (true) {
    const { payload: modelField } = yield* take(
      ProjectActions.deleteModelField
    );
    try {
      yield* put(UiActions.showDelayedLoading());
      yield* call(Firework.deleteModelField, modelField);
      yield* put(
        UiActions.showNotification({
          type: "success",
          message: "필드가 삭제되었습니다.",
        })
      );
    } catch (error) {
      yield* put(
        ErrorActions.catchError({
          error,
          isAlertOnly: true,
        })
      );
    } finally {
      yield* put(UiActions.hideLoading());
    }
  }
}

export function* getRecordableDocProps<T>(additionalSettings?: T) {
  const auth = yield* select(AuthSelectors.selectAuth);
  const timestamp = yield* call(getTimestamp);
  return {
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: auth.uid,
    updatedBy: auth.uid,
    settingsByMember: {
      [auth.uid]: {
        updatedAt: timestamp,
        ...additionalSettings,
      },
    },
  };
}

export function createUnlistenWaiter({
  unlistenAction,
  cleanUpAction,
  hasToCleanUpOnUnlisten,
}: {
  unlistenAction: ActionCreator<any>;
  cleanUpAction: Action<any>;
  hasToCleanUpOnUnlisten?: boolean;
}) {
  return function* (eventChannel: EventChannel<any>) {
    while (true) {
      const [isSignedOut] = yield* race([
        take(AuthActions.signOut),
        take(unlistenAction),
      ]);
      yield* call(eventChannel.close);
      if (isSignedOut || hasToCleanUpOnUnlisten) {
        yield* put(cleanUpAction);
      }
      break;
    }
  };
}

export function* submitModelNameFormFlow() {
  while (true) {
    const { payload } = yield* take(ProjectActions.submitModelNameForm);

    const currentProject = yield* call(selectAndCheckProject);
    if (!currentProject) {
      continue;
    }

    const { target } = payload;

    try {
      if (!!target) {
        // 수정인 경우
        yield* put(UiActions.showDelayedLoading());
        delete payload.target;
        delete payload.modelFormId;
        const updatedRecordProps = yield* call(getUpdatedRecordProps);
        const newModel: Partial<ModelItem> = {
          projectId: currentProject.id,
          ...payload,
          ...updatedRecordProps,
        };
        yield* call(Firework.updateModel, target.id, newModel);
      } else {
        assertNotEmpty(payload.modelFormId);
        // 생성인 경우
        // 모델을 생성하지 않고 필드를 수정할 수 없으므로 loading을 보여줌
        yield* put(UiActions.showLoading());
        const recordableDocProps = yield* call(getRecordableDocProps);
        const newModel: ModelItem = {
          projectId: currentProject.id,
          name: payload.name,
          ...recordableDocProps,
        };
        // model document 생성
        const newModelRef = yield* call(Firework.addModel, newModel);
        yield* put(
          DataActions.receiveRecordData({
            key: DATA_KEY.MODEL_FORMS,
            recordKey: payload.modelFormId,
            data: newModelRef.id,
          })
        );
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "모델이 생성됐습니다.",
          })
        );
      }
    } catch (error) {
      yield* put(
        ErrorActions.catchError({
          error,
          isAlertOnly: true,
        })
      );
    } finally {
      yield* put(UiActions.hideLoading());
    }
  }
}

export function createProjectModelsEventChannel(projectId: string) {
  const listener = eventChannel((emit) => {
    const projectModelsRef = Firework.getProjectModelsRef(projectId);
    const unsubscribe = projectModelsRef.onSnapshot(
      (querySnapshot) => {
        const record: Record<string, ModelDoc> = {};
        querySnapshot.forEach((model) => {
          record[model.id] = { id: model.id, ...model.data() } as ModelDoc;
        });
        emit(record);
      },
      (error) => {
        emit(error);
      }
    );
    return unsubscribe;
  });
  return listener;
}

export function* listenToProjectModelsFlow() {
  while (true) {
    yield* take(ProjectActions.listenToProjectModels);
    const project = yield* call(selectAndCheckProject);
    if (!project) {
      continue;
    }

    yield* fork(listenToEventChannel, {
      eventChannel: createProjectModelsEventChannel(project.id),
      dataReceiverCreator: (data) =>
        DataActions.receiveRecordData({
          key: DATA_KEY.MODELS,
          recordKey: project.id,
          data,
        }),
      unlistenWaiter: createUnlistenWaiter({
        cleanUpAction: DataActions.clearData(DATA_KEY.MODELS),
        unlistenAction: ProjectActions.unlistenToProjectModels,
      }),
    });
  }
}

export function createModelFieldsEventChannel(model: ModelDoc) {
  const listener = eventChannel((emit) => {
    const modelFieldsRef = Firework.getModelFieldsRef(model);
    const unsubscribe = modelFieldsRef.onSnapshot(
      (querySnapshot) => {
        const result: ModelFieldDoc[] = [];
        querySnapshot.forEach((modelField) => {
          result.push({
            id: modelField.id,
            ...modelField.data(),
          } as ModelFieldDoc);
        });
        emit(orderBy(result, ["createdAt.seconds", "asc"]));
      },
      (error) => {
        emit(error);
      }
    );
    return unsubscribe;
  });
  return listener;
}

export function* listenToModelFieldsFlow() {
  while (true) {
    const { payload: model } = yield* take(ProjectActions.listenToModelFields);
    const project = yield* call(selectAndCheckProject);
    if (!project) {
      continue;
    }

    yield* fork(listenToEventChannel, {
      eventChannel: createModelFieldsEventChannel(model),
      dataReceiverCreator: (data) =>
        DataActions.receiveRecordData({
          key: DATA_KEY.MODEL_FIELDS,
          recordKey: model.id,
          data,
        }),
      unlistenWaiter: createUnlistenWaiter({
        cleanUpAction: DataActions.clearRecordData({
          key: DATA_KEY.MODEL_FIELDS,
          recordKey: model.id,
        }),
        unlistenAction: ProjectActions.unlistenToModelFields,
        hasToCleanUpOnUnlisten: true,
      }),
    });
  }
}

export function* deleteModelFlow() {
  while (true) {
    const { payload } = yield* take(ProjectActions.deleteModel);
    // TODO: 다른곳에서 참조하고 있을 경우 삭제를 막는 로직 필요
    const isConfirmed = yield* call(Alert.confirm, {
      title: "모델 삭제",
      message: `정말 ${payload.name} 모델을 삭제하시겠습니까?`,
    });
    if (isConfirmed) {
      try {
        yield* put(UiActions.showDelayedLoading());
        yield* call(Firework.deleteModel, payload);
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "모델이 삭제되었습니다.",
          })
        );
      } catch (error) {
        yield* put(
          ErrorActions.catchError({
            error,
            isAlertOnly: true,
          })
        );
      } finally {
        yield* put(UiActions.hideLoading());
      }
    }
  }
}

export function* selectAndCheckProject() {
  const { currentProject } = yield* select((state: RootState) => ({
    currentProject: state.data[DATA_KEY.PROJECT],
  }));

  // currentProject가 없을경우 오류
  if (!currentProject) {
    yield* put(
      ErrorActions.catchError({
        error: new Error("선택되어있는 프로젝트가 없습니다."),
        isAlertOnly: true,
      })
    );
    yield* call(history.push, ROUTE.ROOT);
    return undefined;
  }
  return currentProject;
}

export function* getUpdatedRecordProps() {
  const auth = yield* select(AuthSelectors.selectAuth);
  const timestamp = yield* call(getTimestamp);
  return {
    updatedAt: timestamp,
    updatedBy: auth.uid,
    settingsByMember: {
      [auth.uid]: {
        updatedAt: timestamp,
      },
    },
  };
}

export function* submitModelFieldFormFlow() {
  while (true) {
    const { payload } = yield* take(ProjectActions.submitModelFieldForm);

    const modelId = yield* select(
      (state: RootState) => state.data.modelForms?.[payload.modelFormId!]
    );

    if (!modelId) {
      yield* put(
        ErrorActions.catchError({
          error: new Error("선택되어 있는 모델이 없습니다."),
          isAlertOnly: true,
        })
      );
      continue;
    }

    const currentProject = yield* call(selectAndCheckProject);
    if (!currentProject) {
      continue;
    }

    const { target } = payload;

    try {
      yield* put(UiActions.showDelayedLoading(500));
      if (!!target) {
        delete payload.target;
        delete payload.modelFormId;
        const updatedRecordProps = yield* call(getUpdatedRecordProps);
        const newModelField: ModifiableModelFieldItem = {
          projectId: currentProject.id,
          modelId,
          fieldName: {
            value: payload.fieldName,
            ...updatedRecordProps,
          },
          isRequired: {
            value: payload.isRequired,
            ...updatedRecordProps,
          },
          isArray: {
            value: payload.isArray,
            ...updatedRecordProps,
          },
          fieldType: {
            value: payload.fieldType,
            ...updatedRecordProps,
          },
          format: {
            value: payload.format,
            ...updatedRecordProps,
          },
          enum: {
            value: payload.enum,
            ...updatedRecordProps,
          },
          description: {
            value: payload.description,
            ...updatedRecordProps,
          },
          ...updatedRecordProps,
        };
        yield* call(Firework.updateModelField, target.id, newModelField);
      } else {
        const recordableDocProps = yield* call(getRecordableDocProps);
        const newModelField: ModelFieldItem = {
          projectId: currentProject.id,
          modelId,
          fieldName: {
            value: payload.fieldName,
            ...recordableDocProps,
          },
          isRequired: {
            value: payload.isRequired,
            ...recordableDocProps,
          },
          isArray: {
            value: payload.isArray,
            ...recordableDocProps,
          },
          fieldType: {
            value: payload.fieldType,
            ...recordableDocProps,
          },
          format: {
            value: payload.format,
            ...recordableDocProps,
          },
          enum: {
            value: payload.enum,
            ...recordableDocProps,
          },
          description: {
            value: payload.description,
            ...recordableDocProps,
          },
          ...recordableDocProps,
        };
        // modelField 생성
        yield* call(Firework.addModelField, newModelField);
      }
    } catch (error) {
      yield* put(
        ErrorActions.catchError({
          error,
          isAlertOnly: true,
        })
      );
    } finally {
      yield* put(UiActions.hideLoading());
    }
  }
}

export function* watchProjectActions() {
  yield* all([
    fork(submitProjectFormFlow),
    fork(listenToMyProjectsFlow),
    fork(deleteProjectFlow),
    fork(submitProjectUrlFormFlow),
    fork(listenToProjectUrlsFlow),
    fork(deleteProjectUrlFlow),
    fork(submitModelNameFormFlow),
    fork(listenToProjectModelsFlow),
    fork(deleteModelFlow),
    fork(submitModelFieldFormFlow),
    fork(listenToModelFieldsFlow),
    fork(deleteModelFieldFlow),
  ]);
}
