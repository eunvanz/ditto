import {
  fork,
  take,
  all,
  put,
  call,
  select,
  race,
  putResolve,
  takeEvery,
  takeLatest,
  delay,
} from "typed-redux-saga";
import produce from "immer";
import { ProjectActions } from "./ProjectSlice";
import { ProgressActions } from "../Progress/ProgressSlice";
import Firework, { RunBatchItem } from "../Firework";
import { UiActions } from "../Ui/UiSlice";
import AuthSelectors from "../Auth/AuthSelector";
import Alert from "../../components/Alert";
import firebase, { getTimestamp } from "../../firebase";
import { ErrorActions } from "../Error/ErrorSlice";
import {
  ProjectDoc,
  ModelItem,
  ModelDoc,
  ModelFieldItem,
  FORMAT,
  EnumerationItem,
  EnumerationDoc,
  FIELD_TYPE,
  ENUMERATION,
  GroupItem,
  BaseSettings,
  Doc,
  Recordable,
  RequestItem,
  BASE_URL,
  RequestParamItem,
  RequestBodyItem,
  ResponseStatusItem,
  ResponseBodyItem,
  Modifiable,
  CustomizedModelFieldPart,
  CommonModelFieldItem,
  ResponseBodyDoc,
  REQUEST_PARAM_LOCATION,
  ResponseHeaderItem,
  ResponseHeaderDoc,
  NotificationItem,
  UserProfileDoc,
  RequestDoc,
  FieldTypeHasExamples,
  RequestParamDoc,
  RequestBodyDoc,
  ModelFieldDoc,
  InterfaceField,
  Interface,
  fieldTypes,
  GroupDoc,
  Orderable,
  ModelFieldDocLike,
} from "../../types";
import { RootState } from "..";
import { requireSignIn } from "../Auth/AuthSaga";
import { assertNotEmpty, removeEmpty } from "../../helpers/commonHelpers";
import history from "../../helpers/history";
import ROUTE from "../../paths";
import ProjectSelectors from "./ProjectSelectors";
import FirebaseSelectors from "../Firebase/FirebaseSelectors";
import UiSelectors from "../Ui/UiSelectors";
import { Action, ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { ModelFieldFormValues } from "../../components/ModelForm/ModelForm";
import {
  convertInterfacesToCode,
  convertModelFieldItemToModelFieldDoc,
  getProjectKeyByRole,
  getRequestParamLocationName,
  getTrueKeys,
  getTypescriptFieldType,
} from "../../helpers/projectHelpers";
import { EXAMPLE_TYPES } from "../../components/ExampleFormModal/ExampleFormModal";

function* getProperDoc<T extends Recordable>(
  values: any & { target?: Doc<T, BaseSettings> },
) {
  const project = yield* select(ProjectSelectors.selectCurrentProject);

  if (!project) {
    throw new Error("There's no selected project.");
  }

  const { target } = values;
  delete values.target;
  if (!!target) {
    const updatedRecordProps = yield* call(getUpdatedRecordProps);
    const newDoc: Partial<T> = {
      projectId: project.id,
      ...values,
      ...updatedRecordProps,
    };
    return newDoc;
  } else {
    const recordableDocProps = yield* call(getRecordableDocProps);
    const newDoc: T = {
      projectId: project.id,
      ...values,
      ...recordableDocProps,
    };
    return newDoc;
  }
}

export function* submitProjectFormFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.submitProjectForm);
    const auth = yield* select(AuthSelectors.selectAuth);
    const userProfile = yield* select(FirebaseSelectors.selectUserProfile);

    const isLogOn = yield* call(requireSignIn);
    if (!isLogOn) {
      continue;
    }

    const project = yield* select(ProjectSelectors.selectCurrentProject);
    const projects = yield* select(ProjectSelectors.selectMyProjects);

    const isModification = payload.type === "modify";

    yield* all([
      put(ProgressActions.startProgress(type)),
      put(UiActions.showLoading("submitProject")),
    ]);
    const timestamp = yield* call(getTimestamp);
    try {
      if (isModification) {
        assertNotEmpty(project);
        yield* call(Firework.updateProject, (project as ProjectDoc).id, {
          ...payload.data,
          updatedAt: timestamp,
          updatedBy: auth.uid,
          [`settingsByMember.${auth.uid}.updatedAt`]: timestamp,
        });
        const recordableDocProps = yield* call(getRecordableDocProps);
        const members = getTrueKeys(project.members);
        yield* all(
          members
            .filter((memberId) => memberId !== userProfile.uid)
            .map((userId) => {
              const notification: NotificationItem = {
                title: project.title,
                content: `Project basic info has been modified by {${auth.displayName}}`,
                userId,
                isRead: false,
                link: `/projects/${project.id}`,
                ...recordableDocProps,
              };
              return call(Firework.addNotification, notification);
            }),
        );
      } else {
        const batchItems: RunBatchItem[] = [];

        const newProjectRef = yield* call(Firework.getProjectRef);
        batchItems.push({
          operation: "set",
          ref: newProjectRef,
          data: {
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
                isLastItem: true,
                isFirstItem: projects.length === 0,
              },
            },
          },
        });
        const lastProject = projects.find(
          (project) => project.settingsByMember[auth.uid].isLastItem,
        );
        if (lastProject) {
          const lastProjectRef = yield* call(Firework.getProjectRef, lastProject.id);
          batchItems.push({
            operation: "update",
            ref: lastProjectRef,
            data: {
              [`settingsByMember.${auth.uid}.isLastItem`]: false,
              [`settingsByMember.${auth.uid}.nextItemId`]: newProjectRef.id,
            },
          });
        }
        const userRef = yield* call(Firework.getUserRef, auth.uid);
        batchItems.push({
          operation: "update",
          ref: userRef,
          data: {
            ...userProfile.projects,
            [newProjectRef.id]: true,
          },
        });
        yield* call(Firework.runBatch, batchItems);
      }
      yield* all([
        put(
          UiActions.showNotification({
            message: isModification
              ? "Project settings have been modified."
              : "New project is created.",
          }),
        ),
        put(UiActions.hideProjectFormModal()),
      ]);
    } catch (error) {
      yield* put(ErrorActions.catchError({ error }));
    } finally {
      yield* all([
        put(ProgressActions.finishProgress(type)),
        put(UiActions.hideLoading("submitProject")),
      ]);
    }
  }
}

export function* deleteProjectFlow() {
  while (true) {
    const { payload: project } = yield* take(ProjectActions.deleteProject);
    yield* put(
      UiActions.showCriticalConfirmModal({
        title: "Delete project",
        message: `This will permanently delete the project, included operations and groups. Please type {${project.title}} to confirm.`,
        keyword: project.title,
      }),
    );
    const { isConfirmed } = yield* race({
      isConfirmed: take(UiActions.confirmCriticalConfirmModal),
      isCanceled: take(UiActions.hideCriticalConfirmModal),
    });
    const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
    if (isConfirmed) {
      try {
        yield* put(UiActions.showLoading("deleteProject"));
        const projects = yield* select(ProjectSelectors.selectMyProjects);
        const projectRef = yield* call(Firework.getProjectRef, project.id);
        const prevProject = projects.find(
          (item) => item.settingsByMember[userProfile.uid].nextItemId === project.id,
        );
        const nextProject = projects.find(
          (item) => item.id === project.settingsByMember[userProfile.uid].nextItemId,
        );
        const userRef = yield* call(Firework.getUserRef, userProfile.uid);
        const batchItems: RunBatchItem[] = [
          {
            operation: "delete",
            ref: projectRef,
          },
          {
            operation: "update",
            ref: userRef,
            data: {
              [`projects.${project.id}`]: false,
            },
          },
        ];
        if (prevProject) {
          const prevProjectRef = yield* call(Firework.getProjectRef, prevProject.id);
          batchItems.push({
            ref: prevProjectRef,
            operation: "update",
            data: nextProject
              ? {
                  [`settingsByMember.${userProfile.uid}.nextItemId`]: nextProject.id,
                  [`settingsByMember.${userProfile.uid}.isLastItem`]: false,
                }
              : {
                  [`settingsByMember.${userProfile.uid}.isLastItem`]: true,
                  [`settingsByMember.${userProfile.uid}.nextItemId`]: false,
                },
          });
        } else if (nextProject) {
          const nextProjectRef = yield* call(Firework.getProjectRef, nextProject.id);
          batchItems.push({
            ref: nextProjectRef,
            operation: "update",
            data: {
              [`settingsByMember.${userProfile.uid}.isFirstItem`]: true,
              [`settingsByMember.${userProfile.uid}.isLastItem`]:
                !nextProject.settingsByMember[userProfile.uid].nextItemId,
            },
          });
        }
        yield* call(Firework.runBatch, batchItems);
        const recordableDocProps = yield* call(getRecordableDocProps);
        const members = getTrueKeys(project.members);
        yield* all(
          members
            .filter((memberId) => memberId !== userProfile.uid)
            .map((userId) => {
              const notification: NotificationItem = {
                title: project.title,
                content: `Project has been deleted by {${userProfile.name}}`,
                userId,
                isRead: false,
                link: `/projects/${project.id}`,
                ...recordableDocProps,
              };
              return call(Firework.addNotification, notification);
            }),
        );
        yield* put(
          UiActions.showNotification({
            message: "The project has been deleted.",
            type: "success",
          }),
        );
        yield* put(UiActions.hideCriticalConfirmModal());
      } catch (error) {
        yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
      } finally {
        yield* put(UiActions.hideLoading("deleteProject"));
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

    const project = yield* select(ProjectSelectors.selectCurrentProject);
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
            message: "URL settings have been modified.",
          }),
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
        const projectUrlRef = yield* call(Firework.addProjectUrl, newProjectUrl);
        yield* put(
          ProjectActions.notifySubmissionQuickUrlFormComplete({
            createdUrlId: projectUrlRef.id,
          }),
        );
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "New base URL has been created.",
          }),
        );
      }
    } catch (error) {
      yield* put(
        ErrorActions.catchError({
          error,
          isAlertOnly: true,
        }),
      );
    }
  }
}

export function* deleteProjectUrlFlow() {
  while (true) {
    const { payload: projectUrl } = yield* take(ProjectActions.deleteProjectUrl);
    const requests = yield* select(
      FirebaseSelectors.createProjectRequestsSelector(projectUrl.projectId),
    );
    const isUsedBySome = requests.some((item) => item.baseUrl === projectUrl.id);

    if (isUsedBySome) {
      yield* call(Alert.message, {
        title: "Deletion failure",
        message: "The base URL is used by an operation.",
      });
      continue;
    }
    try {
      yield* put(UiActions.showDelayedLoading({ taskName: "deleteProjectUrl" }));
      yield* call(Firework.deleteProjectUrl, projectUrl);
      yield* put(
        UiActions.showNotification({
          type: "success",
          message: "The base URL has been deleted.",
        }),
      );
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    } finally {
      yield* put(UiActions.hideLoading("deleteProjectUrl"));
    }
  }
}

export function* deleteModelFieldFlow() {
  while (true) {
    const { payload: modelField } = yield* take(ProjectActions.deleteModelField);
    const isConfirmed = yield* call(Alert.confirm, {
      title: "Delete field",
      message: `Are you sure to delete field {${modelField.fieldName.value}}?`,
    });
    if (isConfirmed) {
      try {
        yield* put(UiActions.showDelayedLoading({ taskName: "deleteModelField" }));
        yield* call(Firework.deleteModelField, modelField);
        const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
        yield* call(
          sendNotificationsToProjectMembers,
          `The model field {${modelField.fieldName.value}} has been deleted by {${userProfile.name}}.`,
          `./projects/${modelField.projectId}?tab=models&model=${modelField.modelId}`,
        );
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The field has been deleted.",
          }),
        );
      } catch (error) {
        yield* put(
          ErrorActions.catchError({
            error,
            isAlertOnly: true,
          }),
        );
      } finally {
        yield* put(UiActions.hideLoading("deleteModelField"));
      }
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

export function* submitModelNameFormFlow() {
  while (true) {
    const { payload } = yield* take(ProjectActions.submitModelNameForm);

    const currentProject = yield* call(selectAndCheckProject);
    if (!currentProject) {
      continue;
    }

    const { target, hasToSetResult } = payload;

    delete payload.target;
    delete payload.hasToSetResult;
    try {
      const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
      let newModelId = "";
      if (!!target) {
        // 수정인 경우
        yield* put(UiActions.showDelayedLoading({ taskName: "submitModelName" }));
        const updatedRecordProps = yield* call(getUpdatedRecordProps);
        const newModel: Partial<ModelItem> = {
          projectId: currentProject.id,
          ...payload,
          ...updatedRecordProps,
        };
        yield* call(Firework.updateModel, target.id, newModel);

        yield* call(
          sendNotificationsToProjectMembers,
          `The model {${newModel.name}} has been modified by {${userProfile.name}}.`,
          `/projects/${newModel.projectId}?tab=models&model=${target.id}`,
        );

        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The model has been modified.",
          }),
        );
      } else {
        // 생성인 경우
        // 모델을 생성하지 않고 필드를 수정할 수 없으므로 loading을 보여줌
        yield* put(UiActions.showLoading("submitModelName"));
        const recordableDocProps = yield* call(getRecordableDocProps);
        const newModel: ModelItem = {
          projectId: currentProject.id,
          name: payload.name, // name 필드 blur시 수행되므로 이 값만 필요
          ...recordableDocProps,
        };
        // model document 생성
        const newModelRef = yield* call(Firework.addModel, newModel);
        newModelId = newModelRef.id;
        yield* putResolve(ProjectActions.receiveCreatedModelId(newModelId));

        if (hasToSetResult) {
          const projectModels = yield* select(
            FirebaseSelectors.createProjectModelsSelector(currentProject.id),
          );
          const currentModel = projectModels?.find((model) => model.id === newModelId);
          yield* putResolve(ProjectActions.receiveCurrentModel(currentModel!));
        }

        yield* call(
          sendNotificationsToProjectMembers,
          `New model {${newModel.name}} has been created by {${userProfile.name}}.`,
          `/projects/${newModel.projectId}?tab=models&model=${newModelId}`,
        );

        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "New model has been created.",
          }),
        );
      }
    } catch (error) {
      yield* put(
        ErrorActions.catchError({
          error,
          isAlertOnly: true,
        }),
      );
    } finally {
      yield* put(ProjectActions.notifySubmissionQuickModelNameFormComplete());
      yield* put(UiActions.hideLoading("submitModelName"));
    }
  }
}

export async function getReferringModels(
  type: "model" | "enum",
  referred: ModelDoc | EnumerationDoc,
) {
  const projectModelsRef = Firework.getProjectModelsRef(referred.projectId);
  const projectModelsSnapshot = await projectModelsRef.get();

  // 프로젝트의 모델을 가져옴
  let projectModels: ModelDoc[] = [];
  projectModelsSnapshot.forEach((doc) =>
    projectModels.push({ id: doc.id, ...doc.data() } as ModelDoc),
  );

  // 프로젝트의 모델 중 삭제하려는 모델을 참조하고 있는 모델이 있는지 확인
  let referringModels: ModelDoc[] = [];
  const isTypeModel = type === "model";
  const getReferringModelFieldsRef = isTypeModel
    ? Firework.getModelFieldsReferringModelRef
    : Firework.getModelFieldsReferringEnumerationRef;
  await Promise.all(
    projectModels
      .filter((model) => (isTypeModel ? model.id !== referred.id : true))
      .map(async (model) => {
        const modelFieldsSnapshot = await getReferringModelFieldsRef(
          model,
          referred as any,
        ).get();
        if (modelFieldsSnapshot.size > 0) {
          referringModels.push(model);
        }
      }),
  );
  return referringModels;
}

export function* deleteModelFlow() {
  while (true) {
    const { payload } = yield* take(ProjectActions.deleteModel);
    const isConfirmed = yield* call(Alert.confirm, {
      title: "Delete model",
      message: `Are you sure to delete model {${payload.name}}?`,
    });
    if (isConfirmed) {
      try {
        yield* put(UiActions.showDelayedLoading({ taskName: "deleteModel" }));
        const referringModels = yield* call(getReferringModels, "model", payload);
        if (referringModels.length > 0) {
          yield* put(UiActions.hideLoading("deleteModel"));
          yield* call(Alert.message, {
            title: "Deletion failure",
            message: `${referringModels
              .map((model) => model.name)
              .join(
                ", ",
              )} is(are) referring to the model. It's impossible to delete a model referred by another models.`,
          });
          continue;
        } else {
          yield* call(Firework.deleteModel, payload);
          const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
          yield* call(
            sendNotificationsToProjectMembers,
            `The model {${payload.name}} has been deleted by {${userProfile.uid}}.`,
          );
          yield* put(
            UiActions.showNotification({
              type: "success",
              message: "The model has been deleted.",
            }),
          );
        }
      } catch (error) {
        yield* put(
          ErrorActions.catchError({
            error,
            isAlertOnly: true,
          }),
        );
      } finally {
        yield* put(UiActions.hideLoading("deleteModel"));
      }
    }
  }
}

export function* selectAndCheckProject() {
  const currentProject = yield* select(
    (state: RootState) => state.project.currentProject,
  );

  // currentProject가 없을경우 오류
  if (!currentProject) {
    yield* put(
      ErrorActions.catchError({
        error: new Error("There's no selected project."),
        isAlertOnly: true,
      }),
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
    [`settingsByMember.${auth.uid}.updatedAt`]: timestamp,
  };
}

// 실제 업데이트 된 필드에만 updatedAt 갱신
export function* getUpdatedModelField({
  payload,
  timestamp,
}: {
  payload: ModelFieldFormValues;
  timestamp: firebase.firestore.FieldValue;
}) {
  const { target } = payload;
  assertNotEmpty(target);
  const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
  const getKeyProps = (
    key:
      | "fieldName"
      | "isRequired"
      | "isArray"
      | "fieldType"
      | "format"
      | "enum"
      | "description",
  ) => {
    const isKeyUpdated = target[key].value !== payload[key];
    const result = {
      createdAt: target[key].createdAt,
      createdBy: target[key].createdBy,
      value: payload[key],
      updatedAt: isKeyUpdated ? timestamp : target[key].updatedAt,
      updatedBy: isKeyUpdated ? userProfile.uid : target[key].updatedBy,
      settingsByMember: {
        ...target[key].settingsByMember,
        [userProfile.uid]: {
          updatedAt: isKeyUpdated ? timestamp : target[key].updatedAt,
          value: payload[key],
        },
      },
    };
    return removeEmpty(result);
  };
  return {
    fieldName: getKeyProps("fieldName"),
    isRequired: getKeyProps("isRequired"),
    isArray: getKeyProps("isArray"),
    fieldType: getKeyProps("fieldType"),
    format: getKeyProps("format"),
    enum: getKeyProps("enum"),
    description: getKeyProps("description"),
  };
}

export interface CommonModelFieldFormFlowParams<
  T extends CommonModelFieldItem,
  FormValues extends ModelFieldFormValues,
> {
  actionToTrigger: ActionCreatorWithPayload<FormValues>;
  checkIsNotEmpty?: (payload: FormValues) => boolean;
  buildNewModelField: (payload: FormValues) => CustomizedModelFieldPart<T>;
  addModelField: (modelFieldItem: T) => void;
  updateModelField: (id: string, modelFieldItem: Modifiable<T>) => void;
  hasToBlurFormAlways?: boolean;
  sendNotifications?: (params: {
    payload: FormValues;
    userProfile: UserProfileDoc;
    project: ProjectDoc;
    request?: RequestDoc;
  }) => void;
  pushOptimistically?: (doc: ModelFieldDocLike) => Action<any>;
  replaceOptimistically?: (doc: ModelFieldDocLike) => Action<any>;
}

export type CommonModelFieldFormFlow<
  CustomModelFieldItem extends CommonModelFieldItem,
  FormValues extends ModelFieldFormValues,
> = (args: CommonModelFieldFormFlowParams<CustomModelFieldItem, FormValues>) => Generator;

export function* commonModelFieldFormFlow<
  CustomModelFieldItem extends CommonModelFieldItem,
  FormValues extends ModelFieldFormValues,
>({
  actionToTrigger,
  checkIsNotEmpty,
  buildNewModelField,
  addModelField,
  updateModelField,
  hasToBlurFormAlways,
  sendNotifications,
  pushOptimistically,
  replaceOptimistically,
}: CommonModelFieldFormFlowParams<CustomModelFieldItem, FormValues>) {
  while (true) {
    const { type, payload } = yield* take(actionToTrigger);
    const submitModelFieldFormActionType = `${type}-${payload.target?.id}`;
    yield* put(ProgressActions.startProgress(submitModelFieldFormActionType));
    const userProfile = yield* select(FirebaseSelectors.selectUserProfile);

    const editingModelField = yield* select(ProjectSelectors.selectEditingModelField);

    if (!!checkIsNotEmpty && !checkIsNotEmpty(payload)) {
      yield* put(
        ErrorActions.catchError({
          error: new Error("There's no required value."),
          isAlertOnly: true,
        }),
      );
      continue;
    }

    const currentProject = yield* call(selectAndCheckProject);
    if (!currentProject) {
      continue;
    }

    let currentRequest = undefined;
    if ((payload as any).requestId) {
      currentRequest = yield* select(
        FirebaseSelectors.createRequestSelectorByProjectIdAndRequestId(
          currentProject.id,
          (payload as any).requestId,
        ),
      );
    }

    const { target } = payload;

    const isNewModel =
      payload.fieldType === FIELD_TYPE.OBJECT && payload.format === FORMAT.NEW_MODEL;

    const isNewEnum = payload.enum === ENUMERATION.NEW;

    let hasToBlurForm = true;

    try {
      if (!!target) {
        const updatedRecordProps = yield* call(getUpdatedRecordProps);
        const updatedModelField = yield* call(getUpdatedModelField, {
          payload,
          timestamp: updatedRecordProps.updatedAt,
        });
        // @ts-ignore
        const newModelField: Modifiable<CustomModelFieldItem> = {
          ...buildNewModelField(payload),
          projectId: currentProject.id,
          ...updatedModelField,
          ...updatedRecordProps,
        };

        if (isNewModel) {
          yield* put(UiActions.showQuickModelNameFormModal());
          const { submit, cancel } = yield* race({
            submit: take(ProjectActions.submitQuickModelNameForm), // 모델 생성 액션
            cancel: take(ProjectActions.cancelQuickModelNameForm), // 모델 생성 취소 액션
          });
          if (cancel) {
            hasToBlurForm = false;
            continue;
          } else {
            yield* put(ProjectActions.submitModelNameForm(submit!.payload));
            yield* take(ProjectActions.notifySubmissionQuickModelNameFormComplete);
            const createdModelId = yield* select(
              (state: RootState) => state.project.createdModelId,
            );
            yield* put(
              UiActions.showDelayedLoading({
                taskName: "submitCommonModelField",
                delay: 500,
              }),
            );
            yield* put(UiActions.hideQuickModelNameFormModal());
            yield* put(ProjectActions.receiveEditingModelField(undefined));
            if (replaceOptimistically) {
              yield* put(replaceOptimistically({ ...target, ...newModelField }));
            }
            yield* call(updateModelField, target.id, {
              ...newModelField,
              "format.value": createdModelId,
              [`format.settingsByMember.${userProfile.uid}.value`]: createdModelId,
            });
          }
        } else if (isNewEnum) {
          yield* putResolve(ProjectActions.receiveFieldTypeToCreate(payload.fieldType));
          yield* put(UiActions.showQuickEnumFormModal());
          const { submit, cancel } = yield* race({
            submit: take(ProjectActions.submitQuickEnumForm),
            cancel: take(UiActions.hideQuickEnumFormModal),
          });
          if (cancel) {
            hasToBlurForm = false;
            continue;
          } else {
            yield* put(ProjectActions.submitEnumForm(submit!.payload));
            yield* take(ProjectActions.notifySubmissionQuickEnumFormComplete);
            const createdEnumId = yield* select(
              (state: RootState) => state.project.createdEnumId,
            );
            yield* put(
              UiActions.showDelayedLoading({
                taskName: "submitCommonModelField",
                delay: 500,
              }),
            );
            yield* put(UiActions.hideQuickEnumFormModal());
            if (replaceOptimistically) {
              yield* put(replaceOptimistically({ ...target, ...newModelField }));
            }
            yield* call(updateModelField, target.id, {
              ...newModelField,
              "enum.value": createdEnumId,
              [`enum.settingsByMember.${userProfile.uid}.value`]: createdEnumId,
            });
          }
        } else {
          yield* put(
            UiActions.showDelayedLoading({
              taskName: "submitCommonModelField",
              delay: 500,
            }),
          );
          yield* put(ProjectActions.receiveEditingModelField(undefined));
          hasToBlurForm = true;
          if (replaceOptimistically) {
            yield* put(replaceOptimistically({ ...target, ...newModelField }));
          }
          yield* call(updateModelField, target.id, newModelField);
        }
      } else {
        if (!hasToBlurFormAlways) {
          hasToBlurForm = false;
        }
        const recordableDocProps = yield* call(getRecordableDocProps);
        const auth = yield* select(AuthSelectors.selectAuth);
        // @ts-ignore
        const newModelField: CustomModelFieldItem = {
          ...buildNewModelField(payload),
          projectId: currentProject.id,
          fieldName: {
            value: payload.fieldName,
            ...recordableDocProps,
            settingsByMember: {
              [auth.uid]: {
                updatedAt: recordableDocProps.updatedAt,
                value: payload.fieldName,
              },
            },
          },
          isRequired: {
            value: payload.isRequired,
            ...recordableDocProps,
            settingsByMember: {
              [auth.uid]: {
                updatedAt: recordableDocProps.updatedAt,
                value: payload.isRequired,
              },
            },
          },
          isArray: {
            value: payload.isArray,
            ...recordableDocProps,
            settingsByMember: {
              [auth.uid]: {
                updatedAt: recordableDocProps.updatedAt,
                value: payload.isArray,
              },
            },
          },
          fieldType: {
            value: payload.fieldType,
            ...recordableDocProps,
            settingsByMember: {
              [auth.uid]: {
                updatedAt: recordableDocProps.updatedAt,
                value: payload.fieldType,
              },
            },
          },
          format: {
            value: payload.format,
            ...recordableDocProps,
            settingsByMember: {
              [auth.uid]: {
                updatedAt: recordableDocProps.updatedAt,
                value: payload.format,
              },
            },
          },
          enum: {
            value: payload.enum,
            ...recordableDocProps,
            settingsByMember: {
              [auth.uid]: {
                updatedAt: recordableDocProps.updatedAt,
                value: payload.enum,
              },
            },
          },
          description: {
            value: payload.description,
            ...recordableDocProps,
            settingsByMember: {
              [auth.uid]: {
                updatedAt: recordableDocProps.updatedAt,
                value: payload.description,
              },
            },
          },
          ...recordableDocProps,
        };

        if (isNewModel) {
          hasToBlurForm = false;
          yield* put(UiActions.showQuickModelNameFormModal());
          const { submit, cancel } = yield* race({
            submit: take(ProjectActions.submitQuickModelNameForm), // 모델 생성 액션
            cancel: take(ProjectActions.cancelQuickModelNameForm), // 모델 생성 취소 액션
          });
          if (cancel) {
            continue;
          } else {
            yield* put(ProjectActions.submitModelNameForm(submit!.payload));
            yield* take(ProjectActions.notifySubmissionQuickModelNameFormComplete);
            const createdModelId = yield* select(
              (state: RootState) => state.project.createdModelId,
            );
            yield* put(
              UiActions.showDelayedLoading({
                taskName: "submitCommonModelField",
                delay: 500,
              }),
            );
            yield* put(UiActions.hideQuickModelNameFormModal());
            if (hasToBlurFormAlways) {
              yield* put(ProjectActions.receiveEditingModelField(undefined));
            }

            if (pushOptimistically) {
              yield* put(
                pushOptimistically(convertModelFieldItemToModelFieldDoc(newModelField)),
              );
            }

            yield* call(addModelField, {
              ...newModelField,
              format: {
                ...newModelField.format,
                value: createdModelId,
                settingsByMember: {
                  [auth.uid]: {
                    ...newModelField.format.settingsByMember[auth.uid],
                    value: createdModelId,
                  },
                },
              },
            });
          }
        } else if (isNewEnum) {
          hasToBlurForm = false;
          yield* putResolve(ProjectActions.receiveFieldTypeToCreate(payload.fieldType));
          yield* put(UiActions.showQuickEnumFormModal());
          const { submit, cancel } = yield* race({
            submit: take(ProjectActions.submitQuickEnumForm),
            cancel: take(UiActions.hideQuickEnumFormModal),
          });
          if (cancel) {
            continue;
          } else {
            yield* put(ProjectActions.submitEnumForm(submit!.payload));
            yield* take(ProjectActions.notifySubmissionQuickEnumFormComplete);
            const createdEnumId = yield* select(
              (state: RootState) => state.project.createdEnumId,
            );
            yield* put(
              UiActions.showDelayedLoading({
                taskName: "submitCommonModelField",
                delay: 500,
              }),
            );
            yield* put(UiActions.hideQuickEnumFormModal());

            if (pushOptimistically) {
              yield* put(
                pushOptimistically(convertModelFieldItemToModelFieldDoc(newModelField)),
              );
            }

            yield* call(addModelField, {
              ...newModelField,
              enum: {
                ...newModelField.enum,
                value: createdEnumId,
                settingsByMember: {
                  [auth.uid]: {
                    ...newModelField.enum.settingsByMember[auth.uid],
                    value: createdEnumId,
                  },
                },
              },
            });
            if (hasToBlurFormAlways) {
              hasToBlurForm = true;
            }
          }
        } else {
          yield* put(
            UiActions.showDelayedLoading({
              taskName: "submitCommonModelField",
              delay: 500,
            }),
          );
          yield* put(ProjectActions.receiveEditingModelField(undefined));
          hasToBlurForm = Boolean(hasToBlurFormAlways);

          if (pushOptimistically) {
            yield* put(
              pushOptimistically(convertModelFieldItemToModelFieldDoc(newModelField)),
            );
          }

          yield* call(addModelField, newModelField);
        }
      }
      if (sendNotifications) {
        yield* call(sendNotifications, {
          payload,
          userProfile,
          project: currentProject,
          request: currentRequest,
        });
      }
    } catch (error) {
      yield* put(
        ErrorActions.catchError({
          error,
          isAlertOnly: true,
        }),
      );
    } finally {
      if (!hasToBlurForm) {
        yield* put(ProjectActions.receiveEditingModelField(editingModelField));
      }
      yield* putResolve(ProgressActions.finishProgress(submitModelFieldFormActionType));
      yield* put(UiActions.hideLoading("submitCommonModelField"));
    }
  }
}

export function* submitModelFieldFormFlow() {
  yield* fork<
    CommonModelFieldFormFlow<ModelFieldItem, ModelFieldFormValues & { modelId?: string }>
  >(commonModelFieldFormFlow, {
    actionToTrigger: ProjectActions.submitModelFieldForm,
    checkIsNotEmpty: (payload) => {
      return !!payload.modelId;
    },
    buildNewModelField: (payload) => ({ modelId: payload.modelId! }),
    addModelField: Firework.addModelField,
    updateModelField: Firework.updateModelField,
    sendNotifications: function* ({ payload, userProfile, project }) {
      if (payload.target) {
        yield* call(
          sendNotificationsToProjectMembers,
          `The model field {${payload.fieldName}} has been modified by {${userProfile.name}}.`,
          `/projects/${project.id}?tab=models&model=${payload.modelId}`,
        );
      }
    },
    pushOptimistically: ProjectActions.pushModelField,
    replaceOptimistically: ProjectActions.replaceModelField,
  });
}

export function* proceedQuickModelNameFormFlow() {
  while (true) {
    const { payload: originModel } = yield* take(
      ProjectActions.proceedQuickModelNameForm,
    );
    yield* put(UiActions.showQuickModelNameFormModal(originModel));
    const { submit, cancel } = yield* race({
      submit: take(ProjectActions.submitQuickModelNameForm),
      cancel: take(ProjectActions.cancelQuickModelNameForm),
    });
    if (cancel) {
      continue;
    } else {
      yield* putResolve(ProjectActions.submitModelNameForm(submit!.payload));
      yield* put(UiActions.hideQuickModelNameFormModal());
    }
  }
}

export function* submitEnumFormFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.submitEnumForm);

    const currentProject = yield* call(selectAndCheckProject);
    if (!currentProject) {
      continue;
    }

    const { target } = payload;
    delete payload.target;

    try {
      yield* put(ProgressActions.startProgress(type));
      const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
      const items =
        payload.fieldType === FIELD_TYPE.INTEGER
          ? payload.items.map((item) => Number(item))
          : payload.items;
      if (!!target) {
        yield* put(UiActions.showDelayedLoading({ taskName: "submitEnumForm" }));
        const updatedRecordProps = yield* call(getUpdatedRecordProps);
        const newEnumeration: Partial<EnumerationItem> = {
          projectId: currentProject.id,
          ...payload,
          items,
          ...updatedRecordProps,
        };
        yield* call(Firework.updateEnumeration, target.id, newEnumeration);
        yield* call(
          sendNotificationsToProjectMembers,
          `The enumeration {${payload.name}} has been modified by {${userProfile.name}}.`,
          `/projects/${currentProject.id}?tab=enums`,
        );
      } else {
        yield* put(UiActions.showDelayedLoading({ taskName: "submitEnumForm" }));
        const recordableDocProps = yield* call(getRecordableDocProps);
        const newEnumeration: EnumerationItem = {
          projectId: currentProject.id,
          ...payload,
          items,
          ...recordableDocProps,
        };
        const createdEnumerationRef = yield* call(
          Firework.addEnumeration,
          newEnumeration,
        );
        yield* call(
          sendNotificationsToProjectMembers,
          `The enumeration {${payload.name}} has been created by {${userProfile.name}}.`,
          `/projects/${currentProject.id}?tab=enums`,
        );
        yield* putResolve(ProjectActions.receiveCreatedEnumId(createdEnumerationRef.id));
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "New enumeration has been created.",
          }),
        );
      }
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    } finally {
      yield* put(UiActions.hideLoading("submitEnumForm"));
      yield* put(UiActions.hideQuickEnumFormModal());
      yield* put(ProgressActions.finishProgress(type));
      yield* put(ProjectActions.notifySubmissionQuickEnumFormComplete());
    }
  }
}

export function* deleteEnumerationFlow() {
  while (true) {
    const { payload } = yield* take(ProjectActions.deleteEnumeration);
    const isConfirmed = yield* call(Alert.confirm, {
      title: "Delete enumeration",
      message: `Are you sure to delete enumeration {${payload.name}}?`,
    });
    if (isConfirmed) {
      try {
        const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
        const currentProject = yield* select(ProjectSelectors.selectCurrentProject);
        assertNotEmpty(currentProject);
        yield* put(UiActions.showDelayedLoading({ taskName: "deleteEnumeration" }));
        const referringModels = yield* call(getReferringModels, "enum", payload);
        if (referringModels.length > 0) {
          yield* put(UiActions.hideLoading("deleteEnumeration"));
          yield* call(Alert.message, {
            title: "Deletion failure",
            message: `${referringModels
              .map((model) => model.name)
              .join(
                ", ",
              )} is(are) referring to the model. It's impossible to delete a model referred by another models.`,
          });
          continue;
        } else {
          yield* call(Firework.deleteEnumeration, payload);
          yield* call(
            sendNotificationsToProjectMembers,
            `The enumeration {${payload.name}} has been deleted by {${userProfile.name}}.`,
            `/projects/${currentProject.id}?tab=enums`,
          );
          yield* put(
            UiActions.showNotification({
              type: "success",
              message: "The enumeration has been deleted.",
            }),
          );
        }
      } catch (error) {
        yield* put(
          ErrorActions.catchError({
            error,
            isAlertOnly: true,
          }),
        );
      } finally {
        yield* put(UiActions.hideLoading("deleteEnumeration"));
      }
    }
  }
}

export function* submitGroupFormFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.submitGroupForm);
    yield* put(ProgressActions.startProgress(type));

    const { target } = payload;
    const newGroup = yield* call(getProperDoc, payload);
    const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
    const groups = yield* select(ProjectSelectors.selectGroups);
    const projects = yield* select(ProjectSelectors.selectMyProjects);

    const { projectId } = newGroup as GroupItem;
    const project = projects.find((project) => projectId === project.id);
    assertNotEmpty(project);
    yield* put(ProjectActions.receiveCurrentProject(project));
    const targetGroups: GroupDoc[] | undefined = groups[projectId];

    try {
      yield* put(UiActions.showLoading("submitGroupForm"));
      if (!!target) {
        yield* call(Firework.updateGroup, target.id, newGroup);
        yield* call(
          sendNotificationsToProjectMembers,
          `Group name has been changed from {${target.name}} to {${payload.name}} by {${userProfile.name}}.`,
        );
      } else {
        const newGroupRef = yield* call(Firework.getGroupRef, projectId);
        const batchItems = yield* call<GetNewOrderableItemBatch<GroupItem>>(
          getNewOrderableItemBatch,
          {
            newItemRef: newGroupRef,
            getLastItemRef: (item) => Firework.getGroupRef(item.projectId, item.id),
            newItemData: newGroup,
            items: targetGroups,
          },
        );
        yield* call(Firework.runBatch, batchItems);
        yield* call(
          sendNotificationsToProjectMembers,
          `New group {${payload.name}} has been added by {${userProfile.name}}.`,
        );
      }
      yield* put(
        UiActions.showNotification({
          type: "success",
          message: target
            ? "The group has been modified."
            : "New group has been created.",
        }),
      );
      yield* put(UiActions.hideGroupFormModal());
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    } finally {
      yield* put(ProgressActions.finishProgress(type));
      yield* put(UiActions.hideLoading("submitGroupForm"));
    }
  }
}

export function* deleteGroupFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.deleteGroup);
    const userProfile = yield* select(FirebaseSelectors.selectUserProfile);

    yield* put(
      UiActions.showCriticalConfirmModal({
        title: "Delete group",
        message: `This will permanently delete the group and included operations. Please type {${payload.name}} to confirm.`,
        keyword: payload.name,
      }),
    );
    const { isConfirmed } = yield* race({
      isConfirmed: take(UiActions.confirmCriticalConfirmModal),
      isCanceled: take(UiActions.hideCriticalConfirmModal),
    });
    if (isConfirmed) {
      yield* put(UiActions.showLoading("deleteGroup"));
      try {
        yield* put(ProgressActions.startProgress(type));
        const groups = yield* select(ProjectSelectors.selectGroups);
        const targetGroups = groups[payload.projectId];
        const batchItems = yield* call<GetDeleteOrderableItemBatch<GroupDoc>>(
          getDeleteOrderableItemBatch,
          {
            targetItem: payload,
            items: targetGroups,
            getItemRef: (item) => Firework.getGroupRef(item.projectId, item.id),
          },
        );
        yield* call(Firework.runBatch, batchItems);
        yield* call(
          sendNotificationsToProjectMembers,
          `The group {${payload.name}} has been deleted by {${userProfile.name}}.`,
        );
        yield* put(UiActions.hideGroupFormModal());
        yield* put(UiActions.hideCriticalConfirmModal());
        yield* put(
          UiActions.showNotification({
            message: "The group has been deleted.",
            type: "success",
          }),
        );
      } catch (error) {
        yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
      } finally {
        yield* put(UiActions.hideLoading("deleteGroup"));
        yield* put(ProgressActions.finishProgress(type));
      }
    }
  }
}

export function* submitRequestFormFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.submitRequestForm);
    yield* put(ProgressActions.startProgress(type));
    yield* put(UiActions.showLoading("submitRequestForm"));

    const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
    const { groupId, projectId } = yield* select(UiSelectors.selectRequestFormModal);
    if (!projectId || !groupId) {
      continue;
    }
    const projects = yield* select(ProjectSelectors.selectMyProjects);
    const project = projects.find((project) => project.id === projectId);
    assertNotEmpty(project);
    yield* put(ProjectActions.receiveCurrentProject(project));

    const requests = yield* select(ProjectSelectors.selectRequests);
    const targetRequests = requests?.[projectId]?.[groupId]?.filter(
      (request) => request.groupId === groupId,
    );

    const recordableDocProps = yield* call(getRecordableDocProps);

    try {
      const newRequestRef = yield* call(Firework.getRequestRef, projectId);
      const batchItems = yield* call<GetNewOrderableItemBatch<RequestItem>>(
        getNewOrderableItemBatch,
        {
          newItemRef: newRequestRef,
          getLastItemRef: (item) => Firework.getRequestRef(item.projectId, item.id),
          newItemData: {
            projectId,
            groupId,
            ...payload,
            ...recordableDocProps,
          },
          items: targetRequests,
        },
      );

      const newResponseStatus = {
        projectId,
        requestId: newRequestRef.id,
        statusCode: 200,
        description: "OK",
        ...recordableDocProps,
      };

      const newResponseStatusRef = yield* call(
        Firework.getResponseStatusRef,
        projectId,
        newRequestRef.id,
      );
      batchItems.push({
        operation: "set",
        ref: newResponseStatusRef,
        data: newResponseStatus,
      });
      yield* call(Firework.runBatch, batchItems);
      yield* call(
        sendNotificationsToProjectMembers,
        `New operation {${payload.name}} has been added by {${userProfile.name}}`,
        `/projects/${projectId}/requests/${newRequestRef.id}`,
      );
      yield* put(
        UiActions.showNotification({
          message: "New operation has been created.",
          type: "success",
        }),
      );
      yield* put(UiActions.hideRequestFormModal());
      yield* call(
        history.push,
        `${ROUTE.PROJECTS}/${projectId}${ROUTE.REQUESTS}/${newRequestRef.id}`,
      );
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    } finally {
      yield* put(ProgressActions.finishProgress(type));
      yield* put(UiActions.hideLoading("submitRequestForm"));
    }
  }
}

export function* submitRequestUrlFormFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.submitRequestUrlForm);
    const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
    yield* put(ProgressActions.startProgress(type));

    const project = yield* call(selectAndCheckProject);

    if (!project) {
      continue;
    }

    const updatedRecordProps = yield* call(getUpdatedRecordProps);

    const target = payload.target;
    delete payload.target;
    const newRequest: Partial<RequestItem> = {
      projectId: project.id,
      ...payload,
      ...updatedRecordProps,
    };

    try {
      if (payload.baseUrl === BASE_URL.NEW) {
        yield* put(UiActions.showQuickUrlFormModal());
        const { createdUrl } = yield* race({
          createdUrl: take(ProjectActions.notifySubmissionQuickUrlFormComplete),
          isUrlCanceled: take(UiActions.hideQuickUrlFormModal),
        });
        if (createdUrl) {
          const { createdUrlId } = createdUrl.payload;
          newRequest.baseUrl = createdUrlId;
          yield* put(UiActions.hideQuickUrlFormModal());
        } else {
          continue;
        }
      }

      yield* put(UiActions.showDelayedLoading({ taskName: "submitRequestUrlForm" }));
      yield* call(Firework.updateRequest, target!.id, newRequest);
      yield* call(
        sendNotificationsToProjectMembers,
        `{${target!.name}}'s url info has been modified by {${userProfile.name}}`,
        `/projects/${project.id}/requests/${target!.id}`,
      );
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    } finally {
      yield* put(ProgressActions.finishProgress(type));
      yield* put(UiActions.hideLoading("submitRequestUrlForm"));
    }
  }
}

export function* submitRequestParamFormFlow() {
  yield* fork<
    CommonModelFieldFormFlow<
      RequestParamItem,
      ModelFieldFormValues & {
        requestId: string;
        location: REQUEST_PARAM_LOCATION;
      }
    >
  >(commonModelFieldFormFlow, {
    actionToTrigger: ProjectActions.submitRequestParamForm,
    buildNewModelField: (payload) => ({
      requestId: payload.requestId,
      location: payload.location,
    }),
    addModelField: Firework.addRequestParam,
    updateModelField: Firework.updateRequestParam,
    hasToBlurFormAlways: true,
    sendNotifications: function* ({ payload, userProfile, project, request }) {
      yield* call(
        sendNotificationsToProjectMembers,
        payload.target
          ? `The ${getRequestParamLocationName(payload.location)} {${
              payload.fieldName
            }} in the operation {${request!.name}} has been modified by {${
              userProfile.name
            }}.`
          : `New ${getRequestParamLocationName(payload.location)} {${
              payload.fieldName
            }} in the operation {${request!.name}} has been added by {${
              userProfile.name
            }}.`,
        `/projects/${project.id}/requests/${payload.requestId}?tab=request`,
      );
    },
  });
}

export function* deleteRequestParamFlow() {
  while (true) {
    const { payload: requestParam } = yield* take(ProjectActions.deleteRequestParam);
    const isConfirmed = yield* call(Alert.confirm, {
      title: "Delete parameter",
      message: `Are you sure to delete key {${requestParam.fieldName.value}}?`,
    });
    if (isConfirmed) {
      const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
      const request = yield* select(
        FirebaseSelectors.createRequestSelectorByProjectIdAndRequestId(
          requestParam.projectId,
          requestParam.requestId,
        ),
      );
      try {
        yield* put(UiActions.showDelayedLoading({ taskName: "deleteRequestParam" }));
        yield* call(Firework.deleteRequestParam, requestParam);
        yield* call(
          sendNotificationsToProjectMembers,
          `The ${getRequestParamLocationName(requestParam.location)} {${
            requestParam.fieldName.value
          }} in the operation {${request!.name}} has been deleted by {${
            userProfile.name
          }}.`,
          `/projects/${requestParam.projectId}/requests/${requestParam.requestId}?tab=request`,
        );
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The parameter has been deleted.",
          }),
        );
      } catch (error) {
        yield* put(
          ErrorActions.catchError({
            error,
            isAlertOnly: true,
          }),
        );
      } finally {
        yield* put(UiActions.hideLoading("deleteRequestParam"));
      }
    }
  }
}

export function* submitRequestBodyFormFlow() {
  yield* fork<
    CommonModelFieldFormFlow<
      RequestBodyItem,
      ModelFieldFormValues & {
        requestId: string;
      }
    >
  >(commonModelFieldFormFlow, {
    actionToTrigger: ProjectActions.submitRequestBodyForm,
    buildNewModelField: (payload) => ({
      requestId: payload.requestId,
    }),
    addModelField: Firework.addRequestBody,
    updateModelField: Firework.updateRequestBody,
    hasToBlurFormAlways: true,
    sendNotifications: function* ({ payload, project, userProfile, request }) {
      yield* call(
        sendNotificationsToProjectMembers,
        payload.target
          ? `The request body media-type {${payload.fieldName}} in the operation {${
              request!.name
            }} has been modified by {${userProfile.name}}.`
          : `New request body media-type {${payload.fieldName}} in the operation {${
              request!.name
            }} has been added by {${userProfile.name}}.`,
        `/projects/${project.id}/requests/${payload.requestId}?tab=request`,
      );
    },
  });
}

export function* deleteRequestBodyFlow() {
  while (true) {
    const { payload: requestBody } = yield* take(ProjectActions.deleteRequestBody);
    const isConfirmed = yield* call(Alert.confirm, {
      title: "Delete body",
      message: `Are you sure to delete media-type {${requestBody.fieldName.value}}?`,
    });
    if (isConfirmed) {
      const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
      const request = yield* select(
        FirebaseSelectors.createRequestSelectorByProjectIdAndRequestId(
          requestBody.projectId,
          requestBody.requestId,
        ),
      );
      try {
        yield* put(UiActions.showDelayedLoading({ taskName: "deleteRequestBody" }));
        yield* call(Firework.deleteRequestBody, requestBody);
        yield* call(
          sendNotificationsToProjectMembers,
          `The request body media-type {${
            requestBody.fieldName.value
          }} in the operation {${request!.name}} has been deleted by {${
            userProfile.name
          }}.`,
          `/projects/${requestBody.projectId}/requests/${requestBody.requestId}?tab=request`,
        );
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The body has been deleted.",
          }),
        );
      } catch (error) {
        yield* put(
          ErrorActions.catchError({
            error,
            isAlertOnly: true,
          }),
        );
      } finally {
        yield* put(UiActions.hideLoading("deleteRequestBody"));
      }
    }
  }
}

export function* submitRequestSettingFormFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.submitRequestSettingForm);
    yield* put(ProgressActions.startProgress(type));
    const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
    try {
      const target = payload.target;
      assertNotEmpty(target);
      delete payload.target;
      const updatedRecordProps = yield* call(getUpdatedRecordProps);
      const newRequest = {
        projectId: target.projectId,
        ...payload,
        ...updatedRecordProps,
      };
      yield* put(UiActions.showDelayedLoading({ taskName: "submitRequestSettingForm" }));
      yield* call(Firework.updateRequest, target.id, newRequest);
      yield* call(
        sendNotificationsToProjectMembers,
        `The operation {${target.name}} settings have been modified by {${userProfile.name}}`,
        `/projects/${target.projectId}/requests/${target.id}?tab=settings`,
      );
      yield* put(
        UiActions.showNotification({
          type: "success",
          message: "The operation has been modified.",
        }),
      );
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    } finally {
      yield* put(UiActions.hideLoading("submitRequestSettingForm"));
      yield* put(ProgressActions.finishProgress(type));
    }
  }
}

export function* deleteRequestFlow() {
  while (true) {
    const { payload } = yield* take(ProjectActions.deleteRequest);
    const isConfirmed = yield* call(Alert.confirm, {
      title: "Delete operation",
      message: "Are you sure to delete this operation?",
    });
    const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
    if (isConfirmed) {
      try {
        yield* put(UiActions.showDelayedLoading({ taskName: "deleteRequest" }));
        const requests = yield* select(ProjectSelectors.selectRequests);
        const targetRequests = requests[payload.projectId][payload.groupId!];
        const batchItems = yield* call<GetDeleteOrderableItemBatch<RequestDoc>>(
          getDeleteOrderableItemBatch,
          {
            items: targetRequests,
            targetItem: payload,
            getItemRef: (item) => Firework.getRequestRef(item.projectId, item.id),
          },
        );
        yield* call(Firework.runBatch, batchItems);
        yield* call(
          sendNotificationsToProjectMembers,
          `The operation {${payload.name}} has been deleted by {${userProfile.name}}.`,
        );
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The operation has been deleted.",
          }),
        );
      } catch (error) {
        yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
      } finally {
        yield* put(UiActions.hideLoading("deleteRequest"));
      }
    }
  }
}

export function* submitResponseStatusFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.submitResponseStatus);
    yield* put(ProgressActions.startProgress(type));
    yield* put(UiActions.showDelayedLoading({ taskName: "submitResponseStatus" }));
    const target = payload.target;
    delete payload.target;
    const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
    const request = yield* select(
      FirebaseSelectors.createRequestSelectorByProjectIdAndRequestId(
        payload.projectId,
        payload.requestId,
      ),
    );
    try {
      if (!target) {
        const recordableDocProps = yield* call(getRecordableDocProps);
        const newResponseStatus: ResponseStatusItem = {
          ...payload,
          ...recordableDocProps,
        };
        yield* call(Firework.addResponseStatus, newResponseStatus);
        yield* call(
          sendNotificationsToProjectMembers,
          `New response status code {${payload.statusCode}} in the operation {${
            request!.name
          }} has been added by {${userProfile.name}}.`,
          `/projects/${payload.projectId}/requests/${payload.requestId}?tab=response`,
        );
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "New status code has been created.",
          }),
        );
      } else {
        const updatedRecordProps = yield* call(getUpdatedRecordProps);
        const newResponseStatus = {
          ...payload,
          ...updatedRecordProps,
        };
        yield* call(Firework.updateResponseStatus, target.id, newResponseStatus);
        yield* call(
          sendNotificationsToProjectMembers,
          `The response status code {${payload.statusCode}} in the operation {${
            request!.name
          }} has been modified by {${userProfile.name}}.`,
          `/projects/${payload.projectId}/requests/${payload.requestId}?tab=response`,
        );
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The status code has been modified.",
          }),
        );
      }
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    } finally {
      yield* put(UiActions.hideLoading("submitResponseStatus"));
      yield* put(ProgressActions.finishProgress(type));
    }
  }
}

export function* deleteResponseStatusFlow() {
  while (true) {
    const { payload } = yield* take(ProjectActions.deleteResponseStatus);
    const isConfirmed = yield* call(Alert.confirm, {
      title: "Delete status code",
      message: "Are you sure to delete this status code?",
    });
    if (isConfirmed) {
      const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
      const request = yield* select(
        FirebaseSelectors.createRequestSelectorByProjectIdAndRequestId(
          payload.projectId,
          payload.requestId,
        ),
      );
      try {
        yield* put(UiActions.showDelayedLoading({ taskName: "deleteResponseStatus" }));
        yield* call(Firework.deleteResponseStatus, payload);
        yield* call(
          sendNotificationsToProjectMembers,
          `The response status code {${payload.statusCode}} in the operation {${
            request!.name
          }} has been deleted by {${userProfile.name}}.`,
          `/projects/${payload.projectId}/requests/${payload.requestId}?tab=response`,
        );
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The status code has been deleted.",
          }),
        );
      } catch (error) {
        yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
      } finally {
        yield* put(UiActions.hideLoading("deleteResponseStatus"));
      }
    }
  }
}

export function* submitResponseBodyFlow() {
  yield* fork<
    CommonModelFieldFormFlow<
      ResponseBodyItem,
      ModelFieldFormValues & {
        requestId: string;
        projectId: string;
        responseStatusId: string;
      }
    >
  >(commonModelFieldFormFlow, {
    actionToTrigger: ProjectActions.submitResponseBodyForm,
    buildNewModelField: ({ projectId, requestId, responseStatusId }) => ({
      projectId,
      requestId,
      responseStatusId,
    }),
    addModelField: Firework.addResponseBody,
    updateModelField: Firework.updateResponseBody,
    hasToBlurFormAlways: true,
    sendNotifications: function* ({ payload, project, userProfile, request }) {
      yield* call(
        sendNotificationsToProjectMembers,
        payload.target
          ? `The response body media-type {${payload.fieldName}} in the operation {${
              request!.name
            }} has been modified by {${userProfile.name}}.`
          : `New response body media-type {${payload.fieldName}} in the operation {${
              request!.name
            }} has been added by {${userProfile.name}}.`,
        `/projects/${project.id}/requests/${payload.requestId}?tab=response`,
      );
    },
  });
}

export function* deleteResponseBodyFlow() {
  while (true) {
    const { payload } = yield* take(ProjectActions.deleteResponseBody);
    const isConfirmed = yield* call(Alert.confirm, {
      title: "Delete body",
      message: `Are you sure to delete media-type {${payload.fieldName.value}}?`,
    });
    if (isConfirmed) {
      const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
      const request = yield* select(
        FirebaseSelectors.createRequestSelectorByProjectIdAndRequestId(
          payload.projectId,
          payload.requestId,
        ),
      );
      try {
        yield* put(UiActions.showDelayedLoading({ taskName: "deleteResponseBody" }));
        yield* call(Firework.deleteResponseBody, payload as ResponseBodyDoc);
        yield* call(
          sendNotificationsToProjectMembers,
          `The response body media-type {${payload.fieldName.value}} in the operation {${
            request!.name
          }} has been deleted by {${userProfile.name}}.`,
          `/projects/${payload.projectId}/requests/${payload.requestId}?tab=response`,
        );
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The body has been deleted.",
          }),
        );
      } catch (error) {
        yield* put(
          ErrorActions.catchError({
            error,
            isAlertOnly: true,
          }),
        );
      } finally {
        yield* put(UiActions.hideLoading("deleteResponseBody"));
      }
    }
  }
}

export function* submitResponseHeaderFlow() {
  yield* fork<
    CommonModelFieldFormFlow<
      ResponseHeaderItem,
      ModelFieldFormValues & {
        requestId: string;
        projectId: string;
        responseStatusId: string;
      }
    >
  >(commonModelFieldFormFlow, {
    actionToTrigger: ProjectActions.submitResponseHeaderForm,
    buildNewModelField: ({ projectId, requestId, responseStatusId }) => ({
      projectId,
      requestId,
      responseStatusId,
    }),
    addModelField: Firework.addResponseHeader,
    updateModelField: Firework.updateResponseHeader,
    hasToBlurFormAlways: true,
    sendNotifications: function* ({ payload, project, userProfile, request }) {
      yield* call(
        sendNotificationsToProjectMembers,
        payload.target
          ? `The response header {${payload.fieldName}} in the operation {${
              request!.name
            }} has been modified by {${userProfile.name}}.`
          : `New response header {${payload.fieldName}} in the operation {${
              request!.name
            }} has been added by {${userProfile.name}}.`,
        `/projects/${project.id}/requests/${payload.requestId}?tab=response`,
      );
    },
  });
}

export function* deleteResponseHeaderFlow() {
  while (true) {
    const { payload } = yield* take(ProjectActions.deleteResponseHeader);
    const isConfirmed = yield* call(Alert.confirm, {
      title: "Delete header",
      message: `Are you sure to delete key {${payload.fieldName.value}}?`,
    });
    if (isConfirmed) {
      const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
      const request = yield* select(
        FirebaseSelectors.createRequestSelectorByProjectIdAndRequestId(
          payload.projectId,
          payload.requestId,
        ),
      );
      try {
        yield* put(UiActions.showDelayedLoading({ taskName: "deleteResponseHeader" }));
        yield* call(Firework.deleteResponseHeader, payload as ResponseHeaderDoc);
        yield* call(
          sendNotificationsToProjectMembers,
          `The response header {${payload.fieldName.value}} in the operation {${
            request!.name
          }} has been deleted by {${userProfile.name}}.`,
          `/projects/${payload.projectId}/requests/${payload.requestId}?tab=response`,
        );
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The header has been deleted.",
          }),
        );
      } catch (error) {
        yield* put(
          ErrorActions.catchError({
            error,
            isAlertOnly: true,
          }),
        );
      } finally {
        yield* put(UiActions.hideLoading("deleteResponseHeader"));
      }
    }
  }
}

export function* addMembersFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.addMembers);
    yield* put(ProgressActions.startProgress(type));
    yield* put(UiActions.showLoading(type));
    const { role, members } = payload;
    try {
      const project = yield* select(ProjectSelectors.selectCurrentProject);
      assertNotEmpty(project);
      const key = getProjectKeyByRole(role);
      const batchItems: RunBatchItem[] = [];
      const projectUpdateData: Record<string, boolean> = {};
      const projectRef = yield* call(Firework.getProjectRef, project.id);
      members.forEach((member) => {
        projectUpdateData[`members.${member.uid}`] = true;
        projectUpdateData[`${key}.${member.uid}`] = true;
        const userRef = Firework.getUserRef(member.uid);
        batchItems.push({
          operation: "update",
          ref: userRef,
          data: {
            [`projects.${project.id}`]: true,
          },
        });
      });
      batchItems.push({
        operation: "update",
        ref: projectRef,
        data: projectUpdateData,
      });
      yield* call(Firework.runBatch, batchItems);
      const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
      const recordableDocProps = yield* call(getRecordableDocProps);
      yield* all(
        members.map((member) => {
          const notification: NotificationItem = {
            title: project.title,
            content: `You've been added as a {${role}} of the project by {${userProfile.name}}.`,
            link: `/projects/${project.id}?tab=members`,
            userId: member.uid,
            isRead: false,
            ...recordableDocProps,
          };
          return call(Firework.addNotification, notification);
        }),
      );
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    } finally {
      yield* put(ProgressActions.finishProgress(type));
      yield* put(UiActions.hideLoading(type));
      yield* put(UiActions.hideSearchUserFormModal());
      yield* put(
        UiActions.showNotification({
          type: "success",
          message:
            members.length > 1
              ? "New members have been added."
              : "New member has been added.",
        }),
      );
    }
  }
}

export function* deleteMemberFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.deleteMember);
    const project = yield* select(ProjectSelectors.selectCurrentProject);
    assertNotEmpty(project);
    const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
    const { member, role } = payload;
    const isMySelf = userProfile.uid === member.uid;
    const isConfirmed = yield* call(Alert.confirm, {
      title: isMySelf ? "Leave project" : "Delete user",
      message: isMySelf
        ? `Are you sure to leave project {${project.title}}?`
        : `Are you sure to delete user {${member.name}}?`,
    });
    if (isConfirmed) {
      try {
        yield* put(UiActions.showLoading(type));
        const key = getProjectKeyByRole(role);
        const projectRef = yield* call(Firework.getProjectRef, project.id);
        const userRef = yield* call(Firework.getUserRef, member.uid);
        const batchItems: RunBatchItem[] = [
          {
            operation: "update",
            ref: projectRef,
            data: {
              [`members.${member.uid}`]: false,
              [`${key}.${member.uid}`]: false,
            },
          },
          {
            operation: "update",
            ref: userRef,
            data: {
              [`projects.${project.id}`]: false,
            },
          },
        ];
        yield* call(Firework.runBatch, batchItems);
        const recordableDocProps = yield* call(getRecordableDocProps);
        if (isMySelf) {
          const projectMembers = getTrueKeys(project.members);
          yield* all(
            projectMembers
              .filter((item) => item !== userProfile.uid)
              .map((userId) => {
                const notification: NotificationItem = {
                  title: project.title,
                  content: `{${userProfile.name}} has left this project.`,
                  isRead: false,
                  userId,
                  ...recordableDocProps,
                };
                return call(Firework.addNotification, notification);
              }),
          );
        } else {
          const notification: NotificationItem = {
            title: project.title,
            content: `You've been removed from project's member by {${userProfile.name}}.`,
            isRead: false,
            userId: member.uid,
            ...recordableDocProps,
          };
          yield* call(Firework.addNotification, notification);
        }
      } catch (error) {
        yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
      } finally {
        yield* put(UiActions.hideLoading(type));
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The member has been deleted.",
          }),
        );
      }
    }
  }
}

export function* sendNotificationsToProjectMembers(content: string, link?: string) {
  const project = yield* select(ProjectSelectors.selectCurrentProject);
  assertNotEmpty(project);
  const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
  const recordableDocProps = yield* call(getRecordableDocProps);
  const projectMembers = getTrueKeys(project.members);
  yield* all(
    projectMembers
      .filter((userId) => userId !== userProfile.uid)
      .map((userId) => {
        const notification: NotificationItem = {
          title: project.title,
          content,
          userId,
          isRead: false,
          ...recordableDocProps,
        };
        if (link) {
          notification.link = link;
        }
        return call(Firework.addNotification, notification);
      }),
  );
}

export function* changeMemberRoleFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.changeMemberRole);
    const { member, oldRole, newRole } = payload;
    const oldKey = getProjectKeyByRole(oldRole);
    const newKey = getProjectKeyByRole(newRole);
    try {
      yield* put(UiActions.showDelayedLoading({ taskName: type }));
      const project = yield* select(ProjectSelectors.selectCurrentProject);
      assertNotEmpty(project);
      yield* call(Firework.updateProject, project.id, {
        [oldKey]: {
          ...project[oldKey],
          [member.uid]: false,
        },
        [newKey]: {
          ...project[newKey],
          [member.uid]: true,
        },
      });
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    } finally {
      yield* put(UiActions.hideLoading(type));
    }
  }
}

export function* markNotificationsAsReadFlow() {
  while (true) {
    const { payload } = yield* take(ProjectActions.markNotificationsAsRead);
    try {
      const updatedRecordProps = yield* call(getUpdatedRecordProps);
      const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
      yield* all(
        payload.map((item) => {
          const notification: Partial<NotificationItem> = {
            isRead: true,
            userId: userProfile.uid,
            ...updatedRecordProps,
          };
          return call(Firework.updateNotification, item, notification);
        }),
      );
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    }
  }
}

export function* handleRefreshModelField(
  action: ReturnType<typeof ProjectActions.refreshModelField>,
) {
  const { payload } = action;
  const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
  const timestamp = yield* call(getTimestamp);
  const modelFields = yield* select(
    FirebaseSelectors.createModelFieldsSelector(payload.projectId, payload.modelId),
  );
  const requestParams = yield* select(
    FirebaseSelectors.createRequestParamsSelector(
      payload.projectId,
      // @ts-ignore
      payload.requestId,
    ),
  );
  const requestBodies = yield* select(
    FirebaseSelectors.createRequestBodiesSelector(
      payload.projectId,
      // @ts-ignore
      payload.requestId,
    ),
  );
  const responseBodies = yield* select(
    FirebaseSelectors.createResponseBodiesSelector(
      payload.projectId,
      // @ts-ignore
      payload.requestId,
      // @ts-ignore
      payload.responseStatusId,
    ),
  );
  const responseHeaders = yield* select(
    FirebaseSelectors.createResponseHeadersSelector(
      payload.projectId,
      // @ts-ignore
      payload.requestId,
      // @ts-ignore
      payload.responseStatusId,
    ),
  );
  let modelFieldType;
  const latestModelField =
    modelFields?.find((item) => {
      if (item.id === payload.id) {
        modelFieldType = "modelField";
        return true;
      }
      return false;
    }) ||
    requestParams?.find((item) => {
      if (item.id === payload.id) {
        modelFieldType = "requestParam";
        return true;
      }
      return false;
    }) ||
    requestBodies?.find((item) => {
      if (item.id === payload.id) {
        modelFieldType = "requestBody";
        return true;
      }
      return false;
    }) ||
    responseBodies?.find((item) => {
      if (item.id === payload.id) {
        modelFieldType = "responseBody";
        return true;
      }
      return false;
    }) ||
    responseHeaders?.find((item) => {
      if (item.id === payload.id) {
        modelFieldType = "responseHeader";
        return true;
      }
      return false;
    });

  if (latestModelField) {
    const newModelField = {
      [`settingsByMember.${userProfile.uid}.updatedAt`]: timestamp,
      [`fieldName.settingsByMember.${userProfile.uid}.updatedAt`]: timestamp,
      [`fieldName.settingsByMember.${userProfile.uid}.value`]:
        latestModelField.fieldName.value,
      [`isRequired.settingsByMember.${userProfile.uid}.updatedAt`]: timestamp,
      [`isRequired.settingsByMember.${userProfile.uid}.value`]:
        latestModelField.isRequired.value,
      [`isArray.settingsByMember.${userProfile.uid}.updatedAt`]: timestamp,
      [`isArray.settingsByMember.${userProfile.uid}.value`]:
        latestModelField.isArray.value,
      [`fieldType.settingsByMember.${userProfile.uid}.updatedAt`]: timestamp,
      [`fieldType.settingsByMember.${userProfile.uid}.value`]:
        latestModelField.fieldType.value,
      [`format.settingsByMember.${userProfile.uid}.updatedAt`]: timestamp,
      [`format.settingsByMember.${userProfile.uid}.value`]: latestModelField.format.value,
      [`enum.settingsByMember.${userProfile.uid}.updatedAt`]: timestamp,
      [`enum.settingsByMember.${userProfile.uid}.value`]: latestModelField.enum.value,
      [`description.settingsByMember.${userProfile.uid}.updatedAt`]: timestamp,
      [`description.settingsByMember.${userProfile.uid}.value`]:
        latestModelField.description.value,
    };
    if (modelFieldType === "modelField") {
      yield* call(
        // @ts-ignore
        Firework.updateModelField,
        latestModelField.id,
        {
          ...newModelField,
          projectId: payload.projectId,
          modelId: payload.modelId,
        },
      );
    } else if (modelFieldType === "requestParam") {
      // @ts-ignore
      yield* call(Firework.updateRequestParam, latestModelField.id, {
        ...newModelField,
        projectId: payload.projectId,
        // @ts-ignore
        requestId: payload.requestId,
      });
    } else if (modelFieldType === "requestBody") {
      // @ts-ignore
      yield* call(Firework.updateRequestBody, latestModelField.id, {
        ...newModelField,
        projectId: payload.projectId,
        // @ts-ignore
        requestId: payload.requestId,
      });
    } else if (modelFieldType === "responseBody") {
      // @ts-ignore
      yield* call(Firework.updateResponseBody, latestModelField.id, {
        ...newModelField,
        projectId: payload.projectId,
        // @ts-ignore
        requestId: payload.requestId,
        // @ts-ignore
        responseStatusId: payload.responseStatusId,
      });
    } else if (modelFieldType === "responseHeader") {
      // @ts-ignore
      yield* call(Firework.updateResponseHeader, latestModelField.id, {
        ...newModelField,
        projectId: payload.projectId,
        // @ts-ignore
        requestId: payload.requestId,
        // @ts-ignore
        responseStatusId: payload.responseStatusId,
      });
    }
  }
}

export function* submitExamplesFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.submitExamples);
    yield* put(ProgressActions.startProgress(type));
    yield* put(UiActions.showDelayedLoading({ taskName: type }));
    const { target } = payload;
    if (!target) {
      throw new Error("Target model field is not defined.");
    }
    if (
      ![FIELD_TYPE.STRING, FIELD_TYPE.NUMBER, FIELD_TYPE.INTEGER].includes(
        target.fieldType.value,
      )
    ) {
      throw new Error("Field type is invalid.");
    }

    try {
      const examples =
        target.fieldType.value === FIELD_TYPE.STRING
          ? payload.examples
          : payload.examples.map((item) => Number(item));
      const fieldType = target.fieldType.value as FieldTypeHasExamples;
      if (payload.type === EXAMPLE_TYPES.MODEL_FIELD) {
        const data = {
          modelId: target.modelId,
          projectId: target.projectId,
          modelFieldId: target.id,
          examples,
          fieldType,
        };
        yield* call(Firework.updateModelFieldExamples, data);
      } else if (payload.type === EXAMPLE_TYPES.REQUEST_PARAM) {
        const data = {
          projectId: target.projectId,
          requestId: (target as RequestParamDoc).requestId,
          requestParamId: target.id,
          examples,
          fieldType,
        };
        yield* call(Firework.updateRequestParamExamples, data);
      } else if (payload.type === EXAMPLE_TYPES.REQUEST_BODY) {
        const data = {
          projectId: target.projectId,
          requestId: (target as RequestBodyDoc).requestId,
          requestBodyId: target.id,
          examples,
          fieldType,
        };
        yield* call(Firework.updateRequestBodyExamples, data);
      } else if (payload.type === EXAMPLE_TYPES.RESPONSE_BODY) {
        const data = {
          projectId: target.projectId,
          requestId: (target as ResponseBodyDoc).requestId,
          responseStatusId: (target as ResponseBodyDoc).responseStatusId,
          responseBodyId: target.id,
          examples,
          fieldType,
        };
        yield* call(Firework.updateResponseBodyExamples, data);
      } else if (payload.type === EXAMPLE_TYPES.RESPONSE_HEADER) {
        const data = {
          projectId: target.projectId,
          requestId: (target as ResponseHeaderDoc).requestId,
          responseStatusId: (target as ResponseHeaderDoc).responseStatusId,
          responseHeaderId: target.id,
          examples,
          fieldType,
        };
        yield* call(Firework.updateResponseHeaderExamples, data);
      }
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    } finally {
      yield* put(
        UiActions.showNotification({
          type: "success",
          message: "Example data has been saved.",
        }),
      );
      yield* put(UiActions.hideLoading(type));
      yield* put(UiActions.hideExampleFormModal());
      yield* put(ProgressActions.finishProgress(type));
    }
  }
}

async function generateInterface({
  model,
  projectModels,
  projectEnumerations,
  interfaces,
}: {
  model: ModelDoc;
  projectModels: ModelDoc[];
  projectEnumerations: EnumerationDoc[];
  interfaces?: Interface[];
}) {
  const modelFieldsRef = Firework.getModelFieldsRef(model);
  const modelFieldsSnapshot = await modelFieldsRef.get();

  let result: Interface[] = interfaces || [];

  // result에 model 추가
  result.push({
    name: model.name,
    fields: [] as InterfaceField[],
    description: model.description,
  });

  const docs: ModelFieldDoc[] = [];
  modelFieldsSnapshot.forEach((doc) => {
    docs.push(doc.data() as ModelFieldDoc);
  });
  for (const data of docs) {
    const targetIndex = result.findIndex((item) => item.name === model.name);
    const targetInterface = result[targetIndex];
    const type = getTypescriptFieldType(
      data.fieldType.value,
      data.format.value,
      projectModels,
    );
    const hasEnumValue = data.enum.value !== ENUMERATION.NONE;
    const enumeration = hasEnumValue
      ? projectEnumerations.find((item) => item.id === data.enum.value)?.name
      : undefined;
    const examples = data.examples?.[type as FieldTypeHasExamples];
    const description = data.description.value;

    targetInterface.fields.push({
      name: data.fieldName.value,
      isRequired: data.isRequired.value,
      isArray: data.isArray.value,
      type: enumeration || type || "Object",
      hasEnumeration: hasEnumValue,
      examples,
      description,
      format: data.format.value,
    });

    if (!fieldTypes.includes(type)) {
      const fieldTypeModel = projectModels.find((model) => model.name === type);
      if (fieldTypeModel) {
        // 이미 정의된 모델이 있는지 체크
        const isAlreadyDefined = result.some((item) => item.name === fieldTypeModel.name);
        if (!isAlreadyDefined) {
          result = await generateInterface({
            model: fieldTypeModel,
            projectModels,
            projectEnumerations,
            interfaces: result,
          });
        }
      }
    }
  }

  return result;
}

/**
 * 타입스트립트 인터페이스를 생성하고 CodeModal로 보여준다.
 */
export function* generateTypescriptInterfaceFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.generateTypescriptInterface);
    yield* put(ProgressActions.startProgress(type));
    yield* put(UiActions.showDelayedLoading({ taskName: type }));
    const currentProject = yield* call(selectAndCheckProject);
    if (!currentProject) {
      continue;
    }
    const projectModels = yield* select(
      FirebaseSelectors.createProjectModelsSelector(currentProject.id),
    );
    const projectEnumerations = yield* select(
      FirebaseSelectors.createProjectEnumerationsSelector(currentProject.id),
    );
    if (!projectModels || !projectEnumerations) {
      continue;
    }
    const targetModel = payload;
    const result: Interface[] = yield* call(generateInterface, {
      model: targetModel,
      projectModels,
      projectEnumerations,
    });
    const interfaceCode = convertInterfacesToCode(result, projectEnumerations);
    yield* put(
      UiActions.showCodeModal({
        title: "Typescript interface",
        mode: "typescript",
        value: interfaceCode,
      }),
    );
    yield* put(ProgressActions.finishProgress(type));
    yield* put(UiActions.hideLoading(type));
  }
}

export function* generateMockDataFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.generateMockData);
    yield* put(ProgressActions.startProgress(type));
    yield* put(UiActions.showDelayedLoading({ taskName: type }));
    const currentProject = yield* call(selectAndCheckProject);
    if (!currentProject) {
      continue;
    }
    const projectModels = yield* select(
      FirebaseSelectors.createProjectModelsSelector(currentProject.id),
    );
    const projectEnumerations = yield* select(
      FirebaseSelectors.createProjectEnumerationsSelector(currentProject.id),
    );
    if (!projectModels || !projectEnumerations) {
      continue;
    }
    const targetModel = payload;
    const result: Interface[] = yield* call(generateInterface, {
      model: targetModel,
      projectModels,
      projectEnumerations,
    });
    yield* put(
      UiActions.showMockDataModal({
        targetInterface: result[0],
        interfaces: result,
        enumerations: projectEnumerations,
      }),
    );
    yield* put(ProgressActions.finishProgress(type));
    yield* put(UiActions.hideLoading(type));
  }
}

export function* refactorProjectsAsLinkedListFlow() {
  while (true) {
    yield* take(ProjectActions.refactorProjectsAsLinkedList);
    const projects = yield* select(FirebaseSelectors.selectOrderedMyProjects);
    const auth = yield* select(AuthSelectors.selectAuth);
    try {
      yield* all(
        projects.map((project, idx) => {
          const isFirstProject = idx === 0;
          const isLastProject = idx + 1 === projects.length;
          const updatedProject: any = {
            [`settingsByMember.${auth.uid}.isFirstItem`]: isFirstProject,
            [`settingsByMember.${auth.uid}.isLastItem`]: isLastProject,
          };
          if (!isLastProject) {
            updatedProject[`settingsByMember.${auth.uid}.nextItemId`] =
              projects[idx + 1].id;
          }
          return call(Firework.updateProject, project.id, updatedProject);
        }),
      );
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    }
  }
}

export function* refactorGroupsAsLinkedListFlow() {
  while (true) {
    yield* take(ProjectActions.refactorGroupsAsLinkedList);
    const groups = yield* select(ProjectSelectors.selectGroups);
    const keys = Object.keys(groups);
    try {
      const proms: any[] = [];
      keys.forEach((key) => {
        const keyGroups = groups[key];
        keyGroups.forEach((group, idx) => {
          const isFirstGroup = idx === 0;
          const isLastGroup = idx + 1 === keyGroups.length;
          proms.push(
            call(Firework.updateGroup, group.id, {
              projectId: group.projectId,
              isFirstItem: isFirstGroup,
              isLastItem: isLastGroup,
              nextItemId: isLastGroup ? false : keyGroups[idx + 1].id,
            }),
          );
        });
      });
      yield* all(proms);
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    }
  }
}

export function* refactorRequestsAsLinkedListFlow() {
  while (true) {
    yield* take(ProjectActions.refactorRequestsAsLinkedList);
    const requests = yield* select(ProjectSelectors.selectRequests);
    const projectIds = Object.keys(requests);
    try {
      const proms: any[] = [];
      projectIds.forEach((projectId) => {
        const projectRequests = requests[projectId];
        const groupIds = Object.keys(projectRequests);
        groupIds.forEach((groupId) => {
          const groupRequests = projectRequests[groupId];
          groupRequests.forEach((request, idx) => {
            const isFirstRequest = idx === 0;
            const isLastRequest = idx + 1 === groupRequests.length;
            proms.push(
              call(Firework.updateRequest, request.id, {
                projectId: request.projectId,
                isFirstItem: isFirstRequest,
                isLastItem: isLastRequest,
                nextItemId: isLastRequest ? false : groupRequests[idx + 1].id,
              }),
            );
          });
        });
      });
      yield* all(proms);
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    }
  }
}

export function* reorderNavBarItemFlow() {
  while (true) {
    const { payload } = yield* take(ProjectActions.reorderNavBarItem);
    const { itemId, destinationId, destinationIndex, type, projectId } = payload;
    const auth = yield* select(AuthSelectors.selectAuth);
    try {
      if (type === "project") {
        const projects = yield* select(ProjectSelectors.selectMyProjects);
        const sourceProject = projects.find((item) => item.id === itemId);

        assertNotEmpty(sourceProject);

        const sourceNextItemId = sourceProject.settingsByMember[auth.uid].nextItemId;
        const sourceNextItem = projects.find((item) => item.id === sourceNextItemId);
        const sourcePrevItem = projects.find(
          (item) => item.settingsByMember[auth.uid].nextItemId === itemId,
        );
        const sourceIndex = projects.findIndex((item) => item.id === itemId);
        const destinationNextItem =
          destinationIndex < projects.length - 1
            ? projects[destinationIndex + (sourceIndex < destinationIndex ? 1 : 0)]
            : undefined;
        const destinationPrevItem =
          destinationIndex > 0
            ? projects[destinationIndex - (sourceIndex < destinationIndex ? 0 : 1)]
            : undefined;

        const batchItems: RunBatchItem[] = [];

        const sourceItemRef = yield* call(Firework.getProjectRef, sourceProject.id);

        const newProjects = [...projects];
        if (sourcePrevItem) {
          // 현재 아이템의 nextItemId 및 isLastItem을 넘겨받음
          const prevItemRef = yield* call(Firework.getProjectRef, sourcePrevItem.id);

          batchItems.push({
            operation: "update",
            ref: prevItemRef,
            data: {
              [`settingsByMember.${auth.uid}.nextItemId`]: sourceNextItem?.id || false,
              [`settingsByMember.${auth.uid}.isLastItem`]: !sourceNextItem,
            },
          });

          const index = newProjects.findIndex((item) => item.id === sourcePrevItem.id);
          newProjects[index] = produce(newProjects[index], (draft) => {
            const isLastItem = !sourceNextItem;
            if (isLastItem) {
              delete draft.settingsByMember[auth.uid].nextItemId;
            } else {
              draft.settingsByMember[auth.uid].nextItemId = sourceNextItem?.id;
            }
            draft.settingsByMember[auth.uid].isLastItem = isLastItem;
          });
        } else if (sourceNextItem) {
          // sourcePrevItem이 없는경우 isFirstItem을 true
          const nextItemRef = yield* call(Firework.getProjectRef, sourceNextItem.id);

          batchItems.push({
            operation: "update",
            ref: nextItemRef,
            data: {
              [`settingsByMember.${auth.uid}.isFirstItem`]: true,
              [`settingsByMember.${auth.uid}.isLastItem`]: false,
            },
          });

          const index = newProjects.findIndex((item) => item.id === sourceNextItem.id);
          newProjects[index] = produce(newProjects[index], (draft) => {
            draft.settingsByMember[auth.uid].isFirstItem = true;
            draft.settingsByMember[auth.uid].isLastItem = false;
          });
        }

        batchItems.push({
          operation: "update",
          ref: sourceItemRef,
          data: {
            [`settingsByMember.${auth.uid}.nextItemId`]: destinationNextItem?.id || false,
            [`settingsByMember.${auth.uid}.isLastItem`]: !destinationNextItem,
            [`settingsByMember.${auth.uid}.isFirstItem`]: !destinationPrevItem,
          },
        });

        const index = newProjects.findIndex((item) => item.id === sourceProject.id);
        newProjects[index] = produce(newProjects[index], (draft) => {
          const isLastItem = !destinationNextItem;
          if (isLastItem) {
            delete draft.settingsByMember[auth.uid].nextItemId;
          } else {
            draft.settingsByMember[auth.uid].nextItemId = destinationNextItem?.id;
          }
          draft.settingsByMember[auth.uid].isLastItem = !destinationNextItem;
          draft.settingsByMember[auth.uid].isFirstItem = !destinationPrevItem;
        });

        if (destinationPrevItem) {
          // nextItem을 sourceProject.id로 세팅
          const prevItemRef = yield* call(Firework.getProjectRef, destinationPrevItem.id);

          batchItems.push({
            operation: "update",
            ref: prevItemRef,
            data: {
              [`settingsByMember.${auth.uid}.nextItemId`]: sourceProject.id,
            },
          });

          const index = newProjects.findIndex(
            (item) => item.id === destinationPrevItem.id,
          );
          newProjects[index] = produce(newProjects[index], (draft) => {
            draft.settingsByMember[auth.uid].nextItemId = sourceProject.id;
          });
        }
        if (destinationNextItem) {
          // firstItem이 무조건 아니게 됨
          const nextItemRef = yield* call(Firework.getProjectRef, destinationNextItem.id);

          batchItems.push({
            operation: "update",
            ref: nextItemRef,
            data: {
              [`settingsByMember.${auth.uid}.isFirstItem`]: false,
            },
          });

          const index = newProjects.findIndex(
            (item) => item.id === destinationNextItem.id,
          );
          newProjects[index] = produce(newProjects[index], (draft) => {
            draft.settingsByMember[auth.uid].isFirstItem = false;
          });
        }
        yield* put(ProjectActions.receiveMyProjects(newProjects));
        yield* call(Firework.runBatch, batchItems);
      } else if (type === "group") {
        const projectId = destinationId;
        const groups = yield* select(ProjectSelectors.selectGroups);
        const targetGroups = groups[projectId];
        const sourceGroup = targetGroups.find((item) => item.id === itemId);

        assertNotEmpty(sourceGroup);

        const { batchItems, newTargetItems } = yield* call<
          GetReorderOrderableItemBatch<GroupDoc>
        >(getReorderOrderableItemBatch, {
          destId: projectId,
          srcId: projectId,
          srcItem: sourceGroup,
          srcItems: targetGroups,
          destItems: targetGroups,
          destIndex: destinationIndex,
          getItemRef: (item: GroupDoc) => Firework.getGroupRef(item.projectId, item.id),
          targetItems: targetGroups,
        });
        yield* put(
          ProjectActions.receiveGroups({
            ...groups,
            [projectId]: newTargetItems,
          }),
        );
        yield* call(Firework.runBatch, batchItems);
      } else if (type === "request") {
        const destGroupId = destinationId;
        const requests = yield* select(ProjectSelectors.selectRequests);
        const flatRequests = yield* select((state: RootState) => state.project.requests);
        const targetRequests = flatRequests[projectId];
        const sourceRequest = targetRequests.find((item) => item.id === itemId);
        assertNotEmpty(sourceRequest);

        const srcGroupId = sourceRequest.groupId as string;

        const srcRequests = requests[projectId][srcGroupId];
        const destRequests = requests[projectId][destGroupId] || [];

        const { newTargetItems, batchItems } = yield* call<
          GetReorderOrderableItemBatch<RequestDoc>
        >(getReorderOrderableItemBatch, {
          destId: destGroupId,
          srcItem: sourceRequest,
          srcItems: srcRequests,
          srcId: srcGroupId,
          destItems: destRequests,
          destIndex: destinationIndex,
          getItemRef: (item: RequestDoc) =>
            Firework.getRequestRef(item.projectId, item.id),
          targetItems: targetRequests,
          parentIdFieldName: "groupId",
        });

        yield* put(
          ProjectActions.receiveRequests({
            ...flatRequests,
            [projectId]: newTargetItems,
          }),
        );
        yield* call(Firework.runBatch, batchItems);
      }
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    }
  }
}

/**
 * 프로젝트 순서 변경 시 가장 최종 버전의 modification을 반영하기 위해 작성
 */
export function* handleReceiveLatestMyProjects(
  action: ReturnType<typeof ProjectActions.receiveMyProjects>,
) {
  const { payload } = action;
  yield* delay(50);
  yield* put(ProjectActions.receiveMyProjects(payload));
}

export function* handleReceiveLatestGroups(
  action: ReturnType<typeof ProjectActions.receiveGroups>,
) {
  const { payload } = action;
  yield* delay(50);
  yield* put(ProjectActions.receiveGroups(payload));
}

export function* handleReceiveLatestRequests(
  action: ReturnType<typeof ProjectActions.receiveRequests>,
) {
  const { payload } = action;
  yield* delay(50);
  yield* put(ProjectActions.receiveRequests(payload));
}

type GetNewOrderableItemBatch<T extends Orderable & Recordable> = (param: {
  newItemRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  getLastItemRef: (
    item: Doc<T, BaseSettings>,
  ) => firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  newItemData: Partial<T>;
  items?: Doc<T, BaseSettings>[];
}) => Generator<any, RunBatchItem[], unknown>;

export function* getNewOrderableItemBatch<T extends Orderable & Recordable>({
  newItemRef,
  getLastItemRef,
  newItemData,
  items,
}: {
  newItemRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  getLastItemRef: (
    item: Doc<T, BaseSettings>,
  ) => firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  newItemData: Partial<T>;
  items?: Doc<T, BaseSettings>[];
}) {
  const batchItems: RunBatchItem[] = [];
  batchItems.push({
    operation: "set",
    ref: newItemRef,
    data: {
      ...newItemData,
      isLastItem: true,
      isFirstItem: !items || items.length === 0,
    },
  });
  const lastItem = items?.find((item) => item.isLastItem);
  if (lastItem) {
    const lastItemRef = yield* call(getLastItemRef, lastItem);
    batchItems.push({
      operation: "update",
      ref: lastItemRef,
      data: {
        isLastItem: false,
        nextItemId: newItemRef.id,
      },
    });
  }
  return batchItems;
}

type GetDeleteOrderableItemBatch<T extends Doc<Orderable & Recordable, BaseSettings>> =
  (param: {
    targetItem: T;
    items: T[];
    getItemRef: (
      item: T,
    ) => firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  }) => Generator<any, RunBatchItem[], unknown>;

export function* getDeleteOrderableItemBatch<
  T extends Doc<Orderable & Recordable, BaseSettings>,
>({
  items,
  targetItem,
  getItemRef,
}: {
  targetItem: T;
  items?: T[];
  getItemRef: (
    item: T,
  ) => firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
}) {
  const targetItemRef = getItemRef(targetItem);
  const batchItems: RunBatchItem[] = [{ operation: "delete", ref: targetItemRef }];
  const prevItem = items?.find((item) => item.nextItemId === targetItem.id);
  const nextItem = items?.find((item) => item.id === targetItem.nextItemId);
  if (prevItem) {
    const prevItemRef = yield* call(getItemRef, prevItem);
    batchItems.push({
      ref: prevItemRef,
      operation: "update",
      data: nextItem
        ? {
            nextItemId: nextItem.id,
            isLastItem: false,
          }
        : {
            isLastItem: true,
            nextItemId: false,
          },
    });
  } else if (nextItem) {
    const nextItemRef = yield* call(getItemRef, nextItem);
    batchItems.push({
      ref: nextItemRef,
      operation: "update",
      data: {
        isFirstItem: true,
        isLastItem: !nextItem.nextItemId,
      },
    });
  }
  return batchItems;
}

type GetReorderOrderableItemBatch<T extends Orderable> = (param: {
  destId: string;
  srcId: string;
  srcItem: T;
  srcItems: T[];
  destItems: T[];
  destIndex: number;
  getItemRef: (
    item: T,
  ) => firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  targetItems: T[];
  parentIdFieldName?: keyof T;
}) => Generator<any, { batchItems: RunBatchItem[]; newTargetItems: T[] }, unknown>;

export function* getReorderOrderableItemBatch<T extends Orderable>({
  destId,
  srcItem,
  srcItems,
  srcId,
  destItems,
  destIndex,
  getItemRef,
  targetItems,
  parentIdFieldName,
}: {
  destId: string;
  srcId: string;
  srcItem: T;
  srcItems: T[];
  destItems: T[];
  destIndex: number;
  getItemRef: (
    item: T,
  ) => firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  targetItems: T[];
  parentIdFieldName?: keyof T;
}) {
  const isCross = srcId !== destId;
  const srcNextItemId = srcItem.nextItemId;
  const srcNextItem = srcItems.find((item) => item.id === srcNextItemId);
  const srcPrevItem = srcItems.find((item) => item.nextItemId === srcItem.id);
  const srcIndex = srcItems.findIndex((item) => item.id === srcItem.id);
  const destNextItem =
    destIndex < (!isCross ? destItems.length - 1 : destItems.length)
      ? destItems[destIndex + (!isCross && srcIndex < destIndex ? 1 : 0)]
      : undefined;
  const destPrevItem =
    destIndex > 0
      ? destItems[destIndex - (!isCross && srcIndex < destIndex ? 0 : 1)]
      : undefined;
  const batchItems: RunBatchItem[] = [];
  const srcItemRef = yield* call(getItemRef, srcItem);
  const newTargetItems = [...targetItems];
  if (srcPrevItem) {
    const prevItemRef = yield* call(getItemRef, srcPrevItem);
    batchItems.push({
      operation: "update",
      ref: prevItemRef,
      data: {
        nextItemId: srcNextItem?.id || false,
        isLastItem: !srcNextItem,
      },
    });
    const index = newTargetItems.findIndex((item) => item.id === srcPrevItem.id);
    newTargetItems[index] = produce(newTargetItems[index], (draft) => {
      const isLastItem = !srcNextItem;
      if (isLastItem) {
        delete draft.nextItemId;
      } else {
        draft.nextItemId = srcNextItem?.id;
      }
      draft.isLastItem = isLastItem;
    });
  } else if (srcNextItem) {
    const nextItemRef = yield* call(getItemRef, srcNextItem);
    batchItems.push({
      operation: "update",
      ref: nextItemRef,
      data: {
        isFirstItem: true,
        isLastItem: isCross ? srcNextItem.isLastItem : false,
      },
    });
    const index = newTargetItems.findIndex((item) => item.id === srcNextItem.id);
    newTargetItems[index] = produce(newTargetItems[index], (draft) => {
      draft.isFirstItem = true;
      draft.isLastItem = isCross ? srcNextItem.isLastItem : false;
    });
  }
  batchItems.push({
    operation: "update",
    ref: srcItemRef,
    data: {
      nextItemId: destNextItem?.id || false,
      isLastItem: !destNextItem,
      isFirstItem: !destPrevItem,
      groupId: isCross ? destId : srcId,
    },
  });
  const index = newTargetItems.findIndex((item) => item.id === srcItem.id);
  newTargetItems[index] = produce(newTargetItems[index], (draft) => {
    const isLastItem = !destNextItem;
    if (isLastItem) {
      delete draft.nextItemId;
    } else {
      draft.nextItemId = destNextItem?.id;
    }
    draft.isLastItem = !destNextItem;
    draft.isFirstItem = !destPrevItem;
    if (parentIdFieldName) {
      // @ts-ignore
      draft[parentIdFieldName] = isCross ? destId : srcId;
    }
  });
  if (destPrevItem) {
    const prevItemRef = yield* call(getItemRef, destPrevItem);
    batchItems.push({
      operation: "update",
      ref: prevItemRef,
      data: {
        nextItemId: srcItem.id,
      },
    });
    const index = newTargetItems.findIndex((item) => item.id === destPrevItem.id);
    newTargetItems[index] = produce(newTargetItems[index], (draft) => {
      draft.nextItemId = srcItem.id;
    });
  }
  if (destNextItem) {
    const nextItemRef = yield* call(getItemRef, destNextItem);
    batchItems.push({
      operation: "update",
      ref: nextItemRef,
      data: {
        isFirstItem: false,
      },
    });
    const index = newTargetItems.findIndex((item) => item.id === destNextItem.id);
    newTargetItems[index] = produce(newTargetItems[index], (draft) => {
      draft.isFirstItem = false;
    });
  }
  return {
    newTargetItems,
    batchItems,
  };
}

export function* watchProjectActions() {
  yield* all([
    fork(submitProjectFormFlow),
    fork(deleteProjectFlow),
    fork(submitProjectUrlFormFlow),
    fork(deleteProjectUrlFlow),
    fork(submitModelNameFormFlow),
    fork(deleteModelFlow),
    fork(submitModelFieldFormFlow),
    fork(deleteModelFieldFlow),
    fork(proceedQuickModelNameFormFlow),
    fork(submitEnumFormFlow),
    fork(deleteEnumerationFlow),
    fork(submitGroupFormFlow),
    fork(deleteGroupFlow),
    fork(submitRequestFormFlow),
    fork(submitRequestUrlFormFlow),
    fork(submitRequestParamFormFlow),
    fork(deleteRequestParamFlow),
    fork(submitRequestBodyFormFlow),
    fork(deleteRequestBodyFlow),
    fork(submitRequestSettingFormFlow),
    fork(deleteRequestFlow),
    fork(submitResponseStatusFlow),
    fork(deleteResponseStatusFlow),
    fork(submitResponseBodyFlow),
    fork(deleteResponseBodyFlow),
    fork(submitResponseHeaderFlow),
    fork(deleteResponseHeaderFlow),
    fork(addMembersFlow),
    fork(deleteMemberFlow),
    fork(changeMemberRoleFlow),
    fork(markNotificationsAsReadFlow),
    takeEvery(ProjectActions.refreshModelField, handleRefreshModelField),
    fork(submitExamplesFlow),
    fork(generateTypescriptInterfaceFlow),
    fork(generateMockDataFlow),
    fork(refactorProjectsAsLinkedListFlow),
    fork(refactorGroupsAsLinkedListFlow),
    fork(refactorRequestsAsLinkedListFlow),
    fork(reorderNavBarItemFlow),
    takeLatest(ProjectActions.receiveLatestMyProjects, handleReceiveLatestMyProjects),
    takeLatest(ProjectActions.receiveLatestGroups, handleReceiveLatestGroups),
    takeLatest(ProjectActions.receiveLatestRequests, handleReceiveLatestRequests),
  ]);
}
