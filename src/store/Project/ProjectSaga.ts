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
import Firework from "../Firework";
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
  ModifiableModelFieldItem,
  FORMAT,
  EnumerationItem,
  EnumerationDoc,
  FIELD_TYPE,
  ENUMERATION,
  GroupItem,
} from "../../types";
import { RootState } from "..";
import { requireSignIn } from "../Auth/AuthSaga";
import { assertNotEmpty } from "../../helpers/commonHelpers";
import history from "../../helpers/history";
import ROUTE from "../../paths";
import ProjectSelectors from "./ProjectSelectors";

export function* submitProjectFormFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.submitProjectForm);
    const auth = yield* select(AuthSelectors.selectAuth);

    const isLogOn = yield* call(requireSignIn);
    if (!isLogOn) {
      continue;
    }

    const project = yield* select(ProjectSelectors.selectCurrentProject);

    const isModification = payload.type === "modify";

    yield* all([
      put(ProgressActions.startProgress(type)),
      put(UiActions.showLoading()),
    ]);
    const timestamp = yield* call(getTimestamp);
    const projectCount = yield* select(
      (state: RootState) => state.firestore.ordered.projects?.length
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
        yield* put(
          UiActions.showNotification({
            message: "프로젝트가 삭제됐습니다.",
            type: "success",
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
    const isConfirmed = yield* call(Alert.confirm, {
      title: "필드 삭제",
      message: `정말 ${modelField.fieldName.value} 필드를 삭제하시겠습니까?`,
    });
    if (isConfirmed) {
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

    const { target } = payload;

    try {
      if (!!target) {
        // 수정인 경우
        yield* put(UiActions.showDelayedLoading());
        delete payload.target;
        const updatedRecordProps = yield* call(getUpdatedRecordProps);
        const newModel: Partial<ModelItem> = {
          projectId: currentProject.id,
          ...payload,
          ...updatedRecordProps,
        };
        yield* call(Firework.updateModel, target.id, newModel);
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
        yield* putResolve(ProjectActions.receiveCreatedModelId(newModelRef.id));
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
      title: "모델 삭제",
      message: `정말 ${payload.name} 모델을 삭제하시겠습니까?`,
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
            title: "삭제 불가",
            message: `${referringModels
              .map((model) => model.name)
              .join(
                ", "
              )} 모델에서 참조 중인 모델입니다. 다른 모델에서 참조중인 모델은 삭제가 불가능합니다.`,
          });
          continue;
        } else {
          yield* call(Firework.deleteModel, payload);
          yield* put(
            UiActions.showNotification({
              type: "success",
              message: "모델이 삭제되었습니다.",
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
    const { type, payload } = yield* take(ProjectActions.submitModelFieldForm);
    const submitModelFieldFormActionType = `${type}-${payload.target?.id}`;
    yield* put(ProgressActions.startProgress(submitModelFieldFormActionType));

    const { modelId } = payload;

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

    const isNewModel =
      payload.fieldType === FIELD_TYPE.OBJECT &&
      payload.format === FORMAT.NEW_MODEL;

    const isNewEnum = payload.enum === ENUMERATION.NEW;

    let hasToBlurForm = true;

    try {
      if (!!target) {
        delete payload.target;
        delete payload.modelId;
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
            yield* call(Firework.updateModelField, target.id, {
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
            yield* call(Firework.updateModelField, target.id, {
              ...newModelField,
              enum: {
                value: createdEnumId,
                ...updatedRecordProps,
              },
            });
          }
        } else {
          yield* put(UiActions.showDelayedLoading(500));
          yield* call(Firework.updateModelField, target.id, newModelField);
        }
      } else {
        hasToBlurForm = false;
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
            yield* call(Firework.addModelField, {
              ...newModelField,
              format: {
                value: createdModelId!,
                ...recordableDocProps,
              },
            });
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
            yield* call(Firework.addModelField, {
              ...newModelField,
              enum: {
                value: createdEnumId!,
                ...recordableDocProps,
              },
            });
          }
        } else {
          yield* put(UiActions.showDelayedLoading(500));
          yield* call(Firework.addModelField, newModelField);
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
      yield* putResolve(
        ProgressActions.finishProgress(submitModelFieldFormActionType)
      );
      if (hasToBlurForm) {
        yield* put(ProjectActions.receiveEditingModelField(undefined));
      }
      yield* put(UiActions.hideLoading());
    }
  }
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
            message: "열거형이 생성되었습니다.",
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
      title: "열거형 삭제",
      message: `정말 ${payload.name} 열거형을 삭제하시겠습니까?`,
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
              )} 모델에서 참조 중인 열거형입니다. 모델에서 참조중인 열거형은 삭제가 불가능합니다.`,
          });
          continue;
        } else {
          yield* call(Firework.deleteEnumeration, payload);
          yield* put(
            UiActions.showNotification({
              type: "success",
              message: "열거형이 삭제되었습니다.",
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

    const project = yield* select(ProjectSelectors.selectCurrentProject);

    if (!project) {
      yield* call(Alert.message, {
        title: "그룹 생성 불가",
        message: "선택되어있는 프로젝트가 없습니다.",
      });
      continue;
    }

    const { target } = payload;

    try {
      yield* put(UiActions.showLoading());
      if (!!target) {
        delete payload.target;
        const updatedRecordProps = yield* call(getUpdatedRecordProps);
        const newGroup: Partial<GroupItem> = {
          projectId: project.id,
          ...payload,
          ...updatedRecordProps,
        };
        yield* call(Firework.updateGroup, target.id, newGroup);
      } else {
        const recordableDocProps = yield* call(getRecordableDocProps);
        const newModel: ModelItem = {
          projectId: project.id,
          ...payload,
          ...recordableDocProps,
        };
        yield* call(Firework.addGroup, newModel);
      }
      yield* put(
        UiActions.showNotification({
          type: "success",
          message: "그룹이 생성됐습니다.",
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
  ]);
}
