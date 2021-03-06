import {
  fork,
  take,
  all,
  put,
  call,
  select,
  race,
  putResolve,
} from "typed-redux-saga";
import { ProjectActions } from "./ProjectSlice";
import { ProgressActions } from "../Progress/ProgressSlice";
import Firework, { RunBatchItem } from "../Firework";
import { UiActions } from "../Ui/UiSlice";
import AuthSelectors from "../Auth/AuthSelector";
import Alert from "../../components/Alert";
import { getTimestamp } from "../../firebase";
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
  RequestParamDoc,
  REQUEST_METHOD,
  RequestBodyItem,
  RequestBodyDoc,
  ResponseStatusItem,
  ResponseBodyItem,
  Modifiable,
  CustomizedModelFieldPart,
  CommonModelFieldItem,
  ResponseBodyDoc,
  REQUEST_PARAM_LOCATION,
} from "../../types";
import { RootState } from "..";
import { requireSignIn } from "../Auth/AuthSaga";
import { assertNotEmpty } from "../../helpers/commonHelpers";
import history from "../../helpers/history";
import ROUTE from "../../paths";
import ProjectSelectors from "./ProjectSelectors";
import FirebaseSelectors from "../Firebase/FirebaseSelectors";
import UiSelectors from "../Ui/UiSelectors";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { ModelFieldFormValues } from "../../components/ModelForm/ModelForm";

function* getProperDoc<T extends Recordable>(
  values: any & { target?: Doc<T, BaseSettings> }
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

    const isLogOn = yield* call(requireSignIn);
    if (!isLogOn) {
      continue;
    }

    const project = yield* select(ProjectSelectors.selectCurrentProject);
    const projects = yield* select(FirebaseSelectors.selectOrderedMyProjects);

    const isModification = payload.type === "modify";

    yield* all([
      put(ProgressActions.startProgress(type)),
      put(UiActions.showLoading()),
    ]);
    const timestamp = yield* call(getTimestamp);
    const lastProjectSeq =
      projects[projects.length - 1]?.settingsByMember[auth.uid].seq || 0;
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
              seq: lastProjectSeq + 1,
            },
          },
        });
      }
      yield* all([
        put(
          UiActions.showNotification({
            message: isModification
              ? "Project settings have been modified."
              : "New project is created.",
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

export function* deleteProjectFlow() {
  while (true) {
    const { payload: project } = yield* take(ProjectActions.deleteProject);
    yield* put(
      UiActions.showCriticalConfirmModal({
        title: "Delete project",
        message: `This will permanently delete the project, included operations and groups. Please type {${project.title}} to confirm.`,
        keyword: project.title,
      })
    );
    const { isConfirmed } = yield* race({
      isConfirmed: take(UiActions.confirmCriticalConfirmModal),
      isCanceled: take(UiActions.hideCriticalConfirmModal),
    });
    if (isConfirmed) {
      try {
        yield* put(UiActions.showLoading());
        yield* call(Firework.deleteProject, project.id);
        yield* put(
          UiActions.showNotification({
            message: "The project has been deleted.",
            type: "success",
          })
        );
        yield* put(UiActions.hideCriticalConfirmModal());
      } catch (error) {
        yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
      } finally {
        yield* put(UiActions.hideLoading());
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
        const projectUrlRef = yield* call(
          Firework.addProjectUrl,
          newProjectUrl
        );
        yield* put(
          ProjectActions.notifySubmissionQuickUrlFormComplete({
            createdUrlId: projectUrlRef.id,
          })
        );
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "New base URL has been created.",
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
    }
  }
}

export function* deleteProjectUrlFlow() {
  while (true) {
    const { payload: projectUrl } = yield* take(
      ProjectActions.deleteProjectUrl
    );
    const requests = yield* select(
      FirebaseSelectors.createProjectRequestsSelector(projectUrl.projectId)
    );
    const isUsedBySome = requests.some(
      (item) => item.baseUrl === projectUrl.id
    );

    if (isUsedBySome) {
      yield* call(Alert.message, {
        title: "Deletion failure",
        message: "The base URL is used by an operation.",
      });
      continue;
    }
    try {
      yield* put(UiActions.showDelayedLoading());
      yield* call(Firework.deleteProjectUrl, projectUrl);
      yield* put(
        UiActions.showNotification({
          type: "success",
          message: "The base URL has been deleted.",
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
    const isConfirmed = yield* call(Alert.confirm, {
      title: "Delete field",
      message: `Are you sure to delete field ${modelField.fieldName.value}?`,
    });
    if (isConfirmed) {
      try {
        yield* put(UiActions.showDelayedLoading());
        yield* call(Firework.deleteModelField, modelField);
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The field has been deleted.",
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
      if (!!target) {
        // 수정인 경우
        yield* put(UiActions.showDelayedLoading());
        const updatedRecordProps = yield* call(getUpdatedRecordProps);
        const newModel: Partial<ModelItem> = {
          projectId: currentProject.id,
          ...payload,
          ...updatedRecordProps,
        };
        yield* call(Firework.updateModel, target.id, newModel);
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The model has been modified.",
          })
        );
      } else {
        // 생성인 경우
        // 모델을 생성하지 않고 필드를 수정할 수 없으므로 loading을 보여줌
        yield* put(UiActions.showLoading());
        const recordableDocProps = yield* call(getRecordableDocProps);
        const newModel: ModelItem = {
          projectId: currentProject.id,
          name: payload.name, // name 필드 blur시 수행되므로 이 값만 필요
          ...recordableDocProps,
        };
        // model document 생성
        const newModelRef = yield* call(Firework.addModel, newModel);
        const newModelId = newModelRef.id;
        yield* putResolve(ProjectActions.receiveCreatedModelId(newModelId));

        if (hasToSetResult) {
          const projectModels = yield* select(
            FirebaseSelectors.createProjectModelsSelector(currentProject.id)
          );
          const currentModel = projectModels?.find(
            (model) => model.id === newModelId
          );
          yield* putResolve(ProjectActions.receiveCurrentModel(currentModel!));
        }

        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "New model has been created.",
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
      yield* put(ProjectActions.notifySubmissionQuickModelNameFormComplete());
      yield* put(UiActions.hideLoading());
    }
  }
}

export async function getReferringModels(
  type: "model" | "enum",
  referred: ModelDoc | EnumerationDoc
) {
  const projectModelsRef = Firework.getProjectModelsRef(referred.projectId);
  const projectModelsSnapshot = await projectModelsRef.get();

  // 프로젝트의 모델을 가져옴
  let projectModels: ModelDoc[] = [];
  projectModelsSnapshot.forEach((doc) =>
    projectModels.push({ id: doc.id, ...doc.data() } as ModelDoc)
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
          referred as any
        ).get();
        if (modelFieldsSnapshot.size > 0) {
          referringModels.push(model);
        }
      })
  );
  return referringModels;
}

export function* deleteModelFlow() {
  while (true) {
    const { payload } = yield* take(ProjectActions.deleteModel);
    const isConfirmed = yield* call(Alert.confirm, {
      title: "Delete model",
      message: `Are you sure to delete model ${payload.name}?`,
    });
    if (isConfirmed) {
      try {
        yield* put(UiActions.showDelayedLoading());
        const referringModels = yield* call(
          getReferringModels,
          "model",
          payload
        );
        if (referringModels.length > 0) {
          yield* put(UiActions.hideLoading());
          yield* call(Alert.message, {
            title: "Deletion failure",
            message: `${referringModels
              .map((model) => model.name)
              .join(
                ", "
              )} is(are) referring to the model. It's impossible to delete a model referred by another models.`,
          });
          continue;
        } else {
          yield* call(Firework.deleteModel, payload);
          yield* put(
            UiActions.showNotification({
              type: "success",
              message: "The model has been deleted.",
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
}

export function* selectAndCheckProject() {
  const currentProject = yield* select(
    (state: RootState) => state.project.currentProject
  );

  // currentProject가 없을경우 오류
  if (!currentProject) {
    yield* put(
      ErrorActions.catchError({
        error: new Error("There's no selected project."),
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

export interface CommonModelFieldFormFlowParams<
  T extends CommonModelFieldItem,
  FormValues extends ModelFieldFormValues
> {
  actionToTrigger: ActionCreatorWithPayload<FormValues>;
  checkIsNotEmpty?: (payload: FormValues) => boolean;
  buildNewModelField: (payload: FormValues) => CustomizedModelFieldPart<T>;
  addModelField: (modelFieldItem: T) => void;
  updateModelField: (id: string, modelFieldItem: Modifiable<T>) => void;
  hasToBlurFormAlways?: boolean;
}

export type CommonModelFieldFormFlow<
  CustomModelFieldItem extends CommonModelFieldItem,
  FormValues extends ModelFieldFormValues
> = (
  args: CommonModelFieldFormFlowParams<CustomModelFieldItem, FormValues>
) => Generator;

export function* commonModelFieldFormFlow<
  CustomModelFieldItem extends CommonModelFieldItem,
  FormValues extends ModelFieldFormValues
>({
  actionToTrigger,
  checkIsNotEmpty,
  buildNewModelField,
  addModelField,
  updateModelField,
  hasToBlurFormAlways,
}: CommonModelFieldFormFlowParams<CustomModelFieldItem, FormValues>) {
  while (true) {
    const { type, payload } = yield* take(actionToTrigger);
    const submitModelFieldFormActionType = `${type}-${payload.target?.id}`;
    yield* put(ProgressActions.startProgress(submitModelFieldFormActionType));

    if (!!checkIsNotEmpty && !checkIsNotEmpty(payload)) {
      yield* put(
        ErrorActions.catchError({
          error: new Error("There's no required value."),
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

    const isNewModel =
      payload.fieldType === FIELD_TYPE.OBJECT &&
      payload.format === FORMAT.NEW_MODEL;

    const isNewEnum = payload.enum === ENUMERATION.NEW;

    let hasToBlurForm = true;

    try {
      if (!!target) {
        const updatedRecordProps = yield* call(getUpdatedRecordProps);
        // @ts-ignore
        const newModelField: Modifiable<CustomModelFieldItem> = {
          ...buildNewModelField(payload),
          projectId: currentProject.id,
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
            yield* take(
              ProjectActions.notifySubmissionQuickModelNameFormComplete
            );
            const createdModelId = yield* select(
              (state: RootState) => state.project.createdModelId
            );
            yield* put(UiActions.showDelayedLoading(500));
            yield* put(UiActions.hideQuickModelNameFormModal());
            yield* call(updateModelField, target.id, {
              ...newModelField,
              format: {
                value: createdModelId,
                ...updatedRecordProps,
              },
            });
          }
        } else if (isNewEnum) {
          yield* putResolve(
            ProjectActions.receiveFieldTypeToCreate(payload.fieldType)
          );
          yield* put(UiActions.showQuickEnumFormModal());
          const { submit, cancel } = yield* race({
            submit: take(ProjectActions.submitEnumForm),
            cancel: take(UiActions.hideQuickEnumFormModal),
          });
          if (cancel) {
            hasToBlurForm = false;
            continue;
          } else {
            yield* put(ProjectActions.submitEnumForm(submit!.payload));
            yield* take(ProjectActions.notifySubmissionQuickEnumFormComplete);
            const createdEnumId = yield* select(
              (state: RootState) => state.project.createdEnumId
            );
            yield* put(UiActions.showDelayedLoading(500));
            yield* put(UiActions.hideQuickEnumFormModal());
            yield* call(updateModelField, target.id, {
              ...newModelField,
              enum: {
                value: createdEnumId,
                ...updatedRecordProps,
              },
            });
          }
        } else {
          yield* put(UiActions.showDelayedLoading(500));
          yield* call(updateModelField, target.id, newModelField);
        }
      } else {
        hasToBlurForm = false;
        const recordableDocProps = yield* call(getRecordableDocProps);
        // @ts-ignore
        const newModelField: CustomModelFieldItem = {
          ...buildNewModelField(payload),
          projectId: currentProject.id,
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

        if (isNewModel) {
          yield* put(UiActions.showQuickModelNameFormModal());
          const { submit, cancel } = yield* race({
            submit: take(ProjectActions.submitQuickModelNameForm), // 모델 생성 액션
            cancel: take(ProjectActions.cancelQuickModelNameForm), // 모델 생성 취소 액션
          });
          if (cancel) {
            continue;
          } else {
            yield* put(ProjectActions.submitModelNameForm(submit!.payload));
            yield* take(
              ProjectActions.notifySubmissionQuickModelNameFormComplete
            );
            const createdModelId = yield* select(
              (state: RootState) => state.project.createdModelId
            );
            yield* put(UiActions.showDelayedLoading(500));
            yield* put(UiActions.hideQuickModelNameFormModal());
            yield* call(addModelField, {
              ...newModelField,
              format: {
                value: createdModelId!,
                ...recordableDocProps,
              },
            });
            hasToBlurForm = true;
          }
        } else if (isNewEnum) {
          yield* putResolve(
            ProjectActions.receiveFieldTypeToCreate(payload.fieldType)
          );
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
              (state: RootState) => state.project.createdEnumId
            );
            yield* put(UiActions.showDelayedLoading(500));
            yield* put(UiActions.hideQuickEnumFormModal());
            yield* call(addModelField, {
              ...newModelField,
              enum: {
                value: createdEnumId!,
                ...recordableDocProps,
              },
            });
          }
        } else {
          yield* put(UiActions.showDelayedLoading(500));
          yield* call(addModelField, newModelField);
        }
      }
    } catch (error) {
      yield* put(
        ErrorActions.catchError({
          error,
          isAlertOnly: true,
        })
      );
    } finally {
      if (hasToBlurFormAlways || hasToBlurForm) {
        yield* put(ProjectActions.receiveEditingModelField(undefined));
      }
      yield* putResolve(
        ProgressActions.finishProgress(submitModelFieldFormActionType)
      );
      yield* put(UiActions.hideLoading());
    }
  }
}

export function* submitModelFieldFormFlow() {
  yield* fork<
    CommonModelFieldFormFlow<
      ModelFieldItem,
      ModelFieldFormValues & { modelId?: string }
    >
  >(commonModelFieldFormFlow, {
    actionToTrigger: ProjectActions.submitModelFieldForm,
    checkIsNotEmpty: (payload) => {
      return !!payload.modelId;
    },
    buildNewModelField: (payload) => ({ modelId: payload.modelId! }),
    addModelField: Firework.addModelField,
    updateModelField: Firework.updateModelField,
  });
}

export function* proceedQuickModelNameFormFlow() {
  while (true) {
    const { payload: originModel } = yield* take(
      ProjectActions.proceedQuickModelNameForm
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
      yield* put(UiActions.showDelayedLoading(500));
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
      const items =
        payload.fieldType === FIELD_TYPE.INTEGER
          ? payload.items.split(",").map((item) => Number(item))
          : payload.items.split(",");
      if (!!target) {
        yield* put(UiActions.showDelayedLoading());
        const updatedRecordProps = yield* call(getUpdatedRecordProps);
        const newEnumeration: Partial<EnumerationItem> = {
          projectId: currentProject.id,
          ...payload,
          items,
          ...updatedRecordProps,
        };
        yield* call(Firework.updateEnumeration, target.id, newEnumeration);
      } else {
        yield* put(UiActions.showDelayedLoading());
        const recordableDocProps = yield* call(getRecordableDocProps);
        const newEnumeration: EnumerationItem = {
          projectId: currentProject.id,
          ...payload,
          items,
          ...recordableDocProps,
        };
        const createdEnumerationRef = yield* call(
          Firework.addEnumeration,
          newEnumeration
        );
        yield* putResolve(
          ProjectActions.receiveCreatedEnumId(createdEnumerationRef.id)
        );
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "New enumeration has been created.",
          })
        );
      }
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    } finally {
      yield* put(UiActions.hideLoading());
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
      message: `Are you sure to delete enumeration ${payload.name}?`,
    });
    if (isConfirmed) {
      try {
        yield* put(UiActions.showDelayedLoading());
        const referringModels = yield* call(
          getReferringModels,
          "enum",
          payload
        );
        if (referringModels.length > 0) {
          yield* put(UiActions.hideLoading());
          yield* call(Alert.message, {
            title: "삭제 불가",
            message: `${referringModels
              .map((model) => model.name)
              .join(
                ", "
              )} is(are) referring to the model. It's impossible to delete a model referred by another models.`,
          });
          continue;
        } else {
          yield* call(Firework.deleteEnumeration, payload);
          yield* put(
            UiActions.showNotification({
              type: "success",
              message: "The enumeration has been deleted.",
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
}

export function* submitGroupFormFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.submitGroupForm);
    yield* put(ProgressActions.startProgress(type));

    const { target } = payload;
    const newGroup = yield* call(getProperDoc, payload);

    try {
      yield* put(UiActions.showLoading());
      if (!!target) {
        yield* call(Firework.updateGroup, target.id, newGroup);
      } else {
        yield* call(Firework.addGroup, newGroup as GroupItem);
      }
      yield* put(
        UiActions.showNotification({
          type: "success",
          message: target
            ? "The group has been modified."
            : "New group has been created.",
        })
      );
      yield* put(UiActions.hideGroupFormModal());
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    } finally {
      yield* put(ProgressActions.finishProgress(type));
      yield* put(UiActions.hideLoading());
    }
  }
}

export function* deleteGroupFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.deleteGroup);
    yield* put(
      UiActions.showCriticalConfirmModal({
        title: "Delete group",
        message: `This will permanently delete the group and included operations. Please type {${payload.name}} to confirm.`,
        keyword: payload.name,
      })
    );
    const { isConfirmed } = yield* race({
      isConfirmed: take(UiActions.confirmCriticalConfirmModal),
      isCanceled: take(UiActions.hideCriticalConfirmModal),
    });
    if (isConfirmed) {
      yield* put(UiActions.showLoading());
      try {
        yield* put(ProgressActions.startProgress(type));
        const groupRef = yield* call(
          Firework.getGroupRef,
          payload.projectId,
          payload.id
        );
        const requestGroupRef = yield* call(
          Firework.getGroupRequestsRef,
          payload.projectId,
          payload.id
        );
        const batchItems: RunBatchItem[] = [
          { operation: "delete", ref: groupRef },
        ];
        yield* call(Firework.runTaskForEachDocs, requestGroupRef, (doc) =>
          batchItems.push({ operation: "delete", ref: doc.ref })
        );
        yield* call(Firework.runBatch, batchItems);
        yield* put(
          UiActions.showNotification({
            message: "The group has been deleted.",
            type: "success",
          })
        );
        yield* put(UiActions.hideGroupFormModal());
        yield* put(UiActions.hideCriticalConfirmModal());
      } catch (error) {
        yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
      } finally {
        yield* put(UiActions.hideLoading());
        yield* put(ProgressActions.finishProgress(type));
      }
    }
  }
}

export function* submitRequestFormFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.submitRequestForm);
    yield* put(ProgressActions.startProgress(type));
    yield* put(UiActions.showLoading());

    const { groupId, projectId } = yield* select(
      UiSelectors.selectRequestFormModal
    );
    if (!projectId) {
      continue;
    }

    const recordableDocProps = yield* call(getRecordableDocProps);
    const newRequest: RequestItem = {
      projectId,
      method: REQUEST_METHOD.GET,
      ...payload,
      ...recordableDocProps,
    };
    if (groupId) {
      newRequest.groupId = groupId;
    }

    try {
      const newRequestRef = yield* call(Firework.addRequest, newRequest);
      const newResponseStatus = {
        projectId,
        requestId: newRequestRef.id,
        statusCode: 200,
        description: "OK",
        ...recordableDocProps,
      };
      yield* call(Firework.addResponseStatus, newResponseStatus);
      yield* put(
        UiActions.showNotification({
          message: "New operation has been created.",
          type: "success",
        })
      );
      yield* put(UiActions.hideRequestFormModal());
      yield* call(
        history.push,
        `${ROUTE.PROJECTS}/${projectId}${ROUTE.REQUESTS}/${newRequestRef.id}`
      );
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    } finally {
      yield* put(ProgressActions.finishProgress(type));
      yield* put(UiActions.hideLoading());
    }
  }
}

export function* submitRequestUrlFormFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.submitRequestUrlForm);
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

      yield* put(UiActions.showDelayedLoading());
      yield* call(Firework.updateRequest, target!.id, newRequest);
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    } finally {
      yield* put(ProgressActions.finishProgress(type));
      yield* put(UiActions.hideLoading());
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
  });
}

export function* deleteRequestParamFlow() {
  while (true) {
    const { payload: requestParam } = yield* take(
      ProjectActions.deleteRequestParam
    );
    const isConfirmed = yield* call(Alert.confirm, {
      title: "Delete parameter",
      message: `Are you sure to delete key ${requestParam.fieldName.value}?`,
    });
    if (isConfirmed) {
      try {
        yield* put(UiActions.showDelayedLoading());
        yield* call(
          Firework.deleteRequestParam,
          requestParam as RequestParamDoc
        );
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The parameter has been deleted.",
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
  });
}

export function* deleteRequestBodyFlow() {
  while (true) {
    const { payload: requestBody } = yield* take(
      ProjectActions.deleteRequestBody
    );
    const isConfirmed = yield* call(Alert.confirm, {
      title: "Delete body",
      message: `Are you sure to delete media-type ${requestBody.fieldName.value}?`,
    });
    if (isConfirmed) {
      try {
        yield* put(UiActions.showDelayedLoading());
        yield* call(Firework.deleteRequestBody, requestBody as RequestBodyDoc);
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The body has been deleted.",
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

export function* submitRequestSettingFormFlow() {
  while (true) {
    const { type, payload } = yield* take(
      ProjectActions.submitRequestSettingForm
    );
    yield* put(ProgressActions.startProgress(type));
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
      yield* put(UiActions.showDelayedLoading());
      yield* call(Firework.updateRequest, target.id, newRequest);
      yield* put(
        UiActions.showNotification({
          type: "success",
          message: "The operation has been modified.",
        })
      );
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    } finally {
      yield* put(UiActions.hideLoading());
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
    if (isConfirmed) {
      try {
        yield* put(UiActions.showDelayedLoading());
        yield* call(Firework.deleteRequest, payload);
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The operation has been deleted.",
          })
        );
      } catch (error) {
        yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
      } finally {
        yield* put(UiActions.hideLoading());
      }
    }
  }
}

export function* submitResponseStatusFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.submitResponseStatus);
    yield* put(ProgressActions.startProgress(type));
    yield* put(UiActions.showDelayedLoading());
    const target = payload.target;
    delete payload.target;
    try {
      if (!target) {
        const recordableDocProps = yield* call(getRecordableDocProps);
        const newResponseStatus: ResponseStatusItem = {
          ...payload,
          ...recordableDocProps,
        };
        yield* call(Firework.addResponseStatus, newResponseStatus);
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "New status code has been created.",
          })
        );
      } else {
        const updatedRecordProps = yield* call(getUpdatedRecordProps);
        const newResponseStatus = {
          ...payload,
          ...updatedRecordProps,
        };
        yield* call(
          Firework.updateResponseStatus,
          target.id,
          newResponseStatus
        );
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The status code has been modified.",
          })
        );
      }
    } catch (error) {
      yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
    } finally {
      yield* put(UiActions.hideLoading());
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
      try {
        yield* put(UiActions.showDelayedLoading());
        yield* call(Firework.deleteResponseStatus, payload);
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The status code has been deleted.",
          })
        );
      } catch (error) {
        yield* put(ErrorActions.catchError({ error, isAlertOnly: true }));
      } finally {
        yield* put(UiActions.hideLoading());
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
  });
}

export function* deleteResponseBodyFlow() {
  while (true) {
    const { payload } = yield* take(ProjectActions.deleteResponseBody);
    const isConfirmed = yield* call(Alert.confirm, {
      title: "Delete body",
      message: `Are you sure to delete media-type ${payload.fieldName.value}?`,
    });
    if (isConfirmed) {
      try {
        yield* put(UiActions.showDelayedLoading());
        yield* call(Firework.deleteResponseBody, payload as ResponseBodyDoc);
        yield* put(
          UiActions.showNotification({
            type: "success",
            message: "The body has been deleted.",
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
  ]);
}
