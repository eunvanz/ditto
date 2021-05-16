import { call } from "typed-redux-saga";
import { db } from "../../firebase";
import {
  ProjectItem,
  ProjectUrlItem,
  ProjectUrlDoc,
  ModelItem,
  ModelFieldItem,
  ModelDoc,
  ModelFieldDoc,
  EnumerationItem,
  EnumerationDoc,
  GroupItem,
  GroupDoc,
  RequestItem,
  RequestParamItem,
  RequestParamDoc,
  RequestBodyItem,
  RequestBodyDoc,
  RequestDoc,
  ResponseStatusItem,
  ResponseStatusDoc,
  ResponseBodyItem,
  ResponseBodyDoc,
  Modifiable,
  ResponseHeaderItem,
  ResponseHeaderDoc,
  UserProfile,
  NotificationItem,
  FieldTypeHasExamples,
} from "../../types";
import mockFirework from "./mockFirework";

function addDocument<T>(path: string, data: T) {
  return db.collection(path).add(data);
}

function* addProject(data: ProjectItem) {
  return yield* call(addDocument, "projects", data);
}

function batch() {
  return db.batch();
}

function runTransaction(
  callback: (transaction: firebase.firestore.Transaction) => Promise<unknown>,
) {
  return db.runTransaction(callback);
}

function getMyProjectsRef(uid: string) {
  return db.collection("projects").where(`members.${uid}`, "==", true);
}

function getProjectRef(id?: string) {
  if (id) {
    return db.collection("projects").doc(id);
  } else {
    // 새로운 프로젝트의 ref를 생성
    return db.collection("projects").doc();
  }
}

function getUserRef(uid: string) {
  return db.collection("users").doc(uid);
}

function* addUserProfile(data: UserProfile) {
  return yield* call(addDocument, "users", data);
}

function updateDocument<T>(path: string, id: string, data: Partial<T>) {
  return db.collection(path).doc(id).update(data);
}

function* updateProject(id: string, data: Partial<ProjectItem>) {
  yield* call(updateDocument, "projects", id, data);
}

function deleteDocument(path: string, id: string) {
  return db.collection(path).doc(id).delete();
}

function* deleteProject(id: string) {
  yield* call(deleteDocument, "projects", id);
}

function* addProjectUrl(data: ProjectUrlItem) {
  return yield* call(addDocument, `projects/${data.projectId}/urls`, data);
}

function getProjectUrlRef(projectId: string) {
  return db.collection(`projects/${projectId}/urls`).orderBy("createdAt", "asc");
}

function* deleteProjectUrl(projectUrl: ProjectUrlDoc) {
  yield* call(deleteDocument, `projects/${projectUrl.projectId}/urls/`, projectUrl.id);
}

function* updateProjectUrl(id: string, projectUrl: Partial<ProjectUrlItem>) {
  yield* call(updateDocument, `projects/${projectUrl.projectId}/urls`, id, projectUrl);
}

function* updateModel(id: string, model: Partial<ModelItem>) {
  yield* call(updateDocument, `projects/${model.projectId}/models`, id, model);
}

function* updateModelField(id: string, modelField: Modifiable<ModelFieldItem>) {
  yield* call(
    updateDocument,
    `projects/${modelField.projectId}/models/${modelField.modelId}/modelFields`,
    id,
    modelField,
  );
}

function* updateModelFieldExamples(data: {
  projectId: string;
  modelId: string;
  modelFieldId: string;
  examples: string[] | number[];
  fieldType: FieldTypeHasExamples;
}) {
  yield* call(
    updateDocument,
    `projects/${data.projectId}/models/${data.modelId}/modelFields`,
    data.modelFieldId,
    {
      [`examples.${data.fieldType}`]: data.examples,
    },
  );
}

function* addModel(data: ModelItem) {
  return yield* call(addDocument, `projects/${data.projectId}/models`, data);
}

function* addModelField(data: ModelFieldItem) {
  return yield* call(
    addDocument,
    `projects/${data.projectId}/models/${data.modelId}/modelFields`,
    data,
  );
}

function getModelRef({ projectId, modelId }: { projectId: string; modelId: string }) {
  return db.doc(`projects/${projectId}/models/${modelId}`);
}

function getProjectModelsRef(projectId: string) {
  return db.collection(`projects/${projectId}/models`);
}

function* deleteModel(model: ModelDoc) {
  yield* call(deleteDocument, `projects/${model.projectId}/models/`, model.id);
}

function getModelFieldsRef(model: ModelDoc) {
  return db.collection(`projects/${model.projectId}/models/${model.id}/modelFields`);
}

function getGroupRef(projectId: string, groupId: string) {
  return db.collection(`projects/${projectId}/groups`).doc(groupId);
}

function* deleteModelField(modelField: ModelFieldDoc) {
  yield* call(
    deleteDocument,
    `projects/${modelField.projectId}/models/${modelField.modelId}/modelFields/`,
    modelField.id,
  );
}

function getModelFieldsReferringModelRef(
  referringModel: ModelDoc,
  referredModel: ModelDoc,
) {
  return db
    .collection(
      `projects/${referringModel.projectId}/models/${referringModel.id}/modelFields`,
    )
    .where("format.value", "==", referredModel.id);
}

function getModelFieldsReferringEnumerationRef(
  referringModel: ModelDoc,
  referredEnumeration: EnumerationDoc,
) {
  return db
    .collection(
      `projects/${referringModel.projectId}/models/${referringModel.id}/modelFields`,
    )
    .where("enum.value", "==", referredEnumeration.id);
}

function* addEnumeration(data: EnumerationItem) {
  return yield* call(addDocument, `projects/${data.projectId}/enumerations`, data);
}

function* updateEnumeration(id: string, data: Partial<EnumerationItem>) {
  yield* call(updateDocument, `projects/${data.projectId}/enumerations`, id, data);
}

function getProjectEnumerationsRef(projectId: string) {
  return db.collection(`projects/${projectId}/enumerations`);
}

function* deleteEnumeration(enumeration: EnumerationDoc) {
  yield* call(
    deleteDocument,
    `projects/${enumeration.projectId}/enumerations`,
    enumeration.id,
  );
}

function* updateGroup(id: string, data: Partial<GroupItem>) {
  yield* call(updateDocument, `projects/${data.projectId}/groups`, id, data);
}

function* addGroup(data: GroupItem) {
  return yield* call(addDocument, `projects/${data.projectId}/groups`, data);
}

function* deleteGroup(group: GroupDoc) {
  yield* call(deleteDocument, `projects/${group.projectId}/groups`, group.id);
}

function* addRequest(data: RequestItem) {
  return yield* call(addDocument, `projects/${data.projectId}/requests`, data);
}

function* updateRequest(id: string, data: Partial<RequestItem>) {
  return yield* call(updateDocument, `projects/${data.projectId}/requests`, id, data);
}

function getGroupRequestsRef(projectId: string, groupId: string) {
  return db.collection(`projects/${projectId}/requests`).where("groupId", "==", groupId);
}

function* addRequestParam(data: RequestParamItem) {
  return yield* call(
    addDocument,
    `projects/${data.projectId}/requests/${data.requestId}/params`,
    data,
  );
}

function* updateRequestParam(id: string, data: Modifiable<RequestParamItem>) {
  return yield* call(
    updateDocument,
    `projects/${data.projectId}/requests/${data.requestId}/params`,
    id,
    data,
  );
}

function* updateRequestParamExamples(data: {
  projectId: string;
  requestId: string;
  requestParamId: string;
  examples: string[] | number[];
  fieldType: FieldTypeHasExamples;
}) {
  yield* call(
    updateDocument,
    `projects/${data.projectId}/requests/${data.requestId}/params`,
    data.requestParamId,
    {
      [`examples.${data.fieldType}`]: data.examples,
    },
  );
}

function* deleteRequestParam(data: RequestParamDoc) {
  yield* call(
    deleteDocument,
    `projects/${data.projectId}/requests/${data.requestId}/params`,
    data.id,
  );
}

function* addRequestBody(data: RequestBodyItem) {
  return yield* call(
    addDocument,
    `projects/${data.projectId}/requests/${data.requestId}/bodies`,
    data,
  );
}

function* updateRequestBody(id: string, data: Modifiable<RequestBodyItem>) {
  return yield* call(
    updateDocument,
    `projects/${data.projectId}/requests/${data.requestId}/bodies`,
    id,
    data,
  );
}

function* updateRequestBodyExamples(data: {
  projectId: string;
  requestId: string;
  requestBodyId: string;
  examples: string[] | number[];
  fieldType: FieldTypeHasExamples;
}) {
  yield* call(
    updateDocument,
    `projects/${data.projectId}/requests/${data.requestId}/bodies`,
    data.requestBodyId,
    {
      [`examples.${data.fieldType}`]: data.examples,
    },
  );
}

function* deleteRequestBody(data: RequestBodyDoc) {
  yield* call(
    deleteDocument,
    `projects/${data.projectId}/requests/${data.requestId}/bodies`,
    data.id,
  );
}

function* deleteRequest(data: RequestDoc) {
  yield* call(deleteDocument, `projects/${data.projectId}/requests`, data.id);
}

function* addResponseStatus(data: ResponseStatusItem) {
  return yield* call(
    addDocument,
    `projects/${data.projectId}/requests/${data.requestId}/responseStatuses`,
    data,
  );
}

function* updateResponseStatus(id: string, data: Partial<ResponseStatusItem>) {
  return yield* call(
    updateDocument,
    `projects/${data.projectId}/requests/${data.requestId}/responseStatuses`,
    id,
    data,
  );
}

function* deleteResponseStatus(data: ResponseStatusDoc) {
  yield* call(
    deleteDocument,
    `projects/${data.projectId}/requests/${data.requestId}/responseStatuses`,
    data.id,
  );
}

function* addResponseBody(data: ResponseBodyItem) {
  return yield* call(
    addDocument,
    `projects/${data.projectId}/requests/${data.requestId}/responseStatuses/${data.responseStatusId}/bodies`,
    data,
  );
}

function* updateResponseBody(id: string, data: Modifiable<ResponseBodyItem>) {
  return yield* call(
    updateDocument,
    `projects/${data.projectId}/requests/${data.requestId}/responseStatuses/${data.responseStatusId}/bodies`,
    id,
    data,
  );
}

function* updateResponseBodyExamples(data: {
  projectId: string;
  requestId: string;
  responseStatusId: string;
  responseBodyId: string;
  examples: string[] | number[];
  fieldType: FieldTypeHasExamples;
}) {
  yield* call(
    updateDocument,
    `projects/${data.projectId}/requests/${data.requestId}/responseStatuses/${data.responseStatusId}/bodies`,
    data.responseBodyId,
    {
      [`examples.${data.fieldType}`]: data.examples,
    },
  );
}

function* deleteResponseBody(data: ResponseBodyDoc) {
  yield* call(
    deleteDocument,
    `projects/${data.projectId}/requests/${data.requestId}/responseStatuses/${data.responseStatusId}/bodies`,
    data.id,
  );
}

function* addResponseHeader(data: ResponseHeaderItem) {
  return yield* call(
    addDocument,
    `projects/${data.projectId}/requests/${data.requestId}/responseStatuses/${data.responseStatusId}/headers`,
    data,
  );
}

function* updateResponseHeader(id: string, data: Modifiable<ResponseHeaderItem>) {
  return yield* call(
    updateDocument,
    `projects/${data.projectId}/requests/${data.requestId}/responseStatuses/${data.responseStatusId}/headers`,
    id,
    data,
  );
}

function* updateResponseHeaderExamples(data: {
  projectId: string;
  requestId: string;
  responseStatusId: string;
  responseHeaderId: string;
  examples: string[] | number[];
  fieldType: FieldTypeHasExamples;
}) {
  yield* call(
    updateDocument,
    `projects/${data.projectId}/requests/${data.requestId}/responseStatuses/${data.responseStatusId}/headers`,
    data.responseHeaderId,
    {
      [`examples.${data.fieldType}`]: data.examples,
    },
  );
}

function* deleteResponseHeader(data: ResponseHeaderDoc) {
  yield* call(
    deleteDocument,
    `projects/${data.projectId}/requests/${data.requestId}/responseStatuses/${data.responseStatusId}/headers`,
    data.id,
  );
}

export interface RunBatchItem {
  operation: "set" | "update" | "delete";
  ref: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  data?: Partial<firebase.firestore.DocumentData>;
}

async function runBatch(operations: RunBatchItem[]) {
  const batch = db.batch();
  operations.forEach((item) => {
    if (item.operation === "delete") {
      batch[item.operation](item.ref);
    } else if (item.operation === "update") {
      batch[item.operation](item.ref, item.data!);
    } else {
      batch[item.operation](item.ref, item.data!);
    }
  });
  await batch.commit();
}

async function runTaskForEachDocs(
  collectionRef: firebase.firestore.Query<firebase.firestore.DocumentData>,
  task: (
    doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>,
  ) => void,
) {
  return new Promise((resolve) => {
    collectionRef.onSnapshot((snapshot) => {
      // length가 0일 경우에도 resolve 해줘야 함
      if (snapshot.docs.length === 0) {
        resolve(undefined);
      }
      snapshot.docs.forEach((doc, index) => {
        task(doc);
        if (index === snapshot.docs.length - 1) {
          resolve(undefined);
        }
      });
    });
  });
}

function* updateUserProfile(id: string, data: Partial<UserProfile>) {
  return yield* call(updateDocument, "users", id, data);
}

function* addNotification(data: NotificationItem) {
  return yield* call(addDocument, `users/${data.userId}/notifications`, data);
}

function* updateNotification(id: string, data: Partial<NotificationItem>) {
  return yield* call(updateDocument, `users/${data.userId}/notifications`, id, data);
}

export const realFirework = {
  addDocument,
  addProject,
  getMyProjectsRef,
  updateProject,
  deleteDocument,
  deleteProject,
  addProjectUrl,
  getProjectUrlRef,
  deleteProjectUrl,
  updateProjectUrl,
  addModel,
  addModelField,
  getModelRef,
  getProjectModelsRef,
  deleteModel,
  getModelFieldsRef,
  deleteModelField,
  updateModel,
  updateModelField,
  getModelFieldsReferringModelRef,
  addEnumeration,
  updateEnumeration,
  getProjectEnumerationsRef,
  getModelFieldsReferringEnumerationRef,
  deleteEnumeration,
  updateGroup,
  addGroup,
  deleteGroup,
  addRequest,
  updateRequest,
  addRequestParam,
  updateRequestParam,
  deleteRequestParam,
  addRequestBody,
  updateRequestBody,
  deleteRequestBody,
  deleteRequest,
  addResponseStatus,
  updateResponseStatus,
  deleteResponseStatus,
  addResponseBody,
  updateResponseBody,
  deleteResponseBody,
  addResponseHeader,
  updateResponseHeader,
  deleteResponseHeader,
  batch,
  getGroupRequestsRef,
  getGroupRef,
  runBatch,
  runTaskForEachDocs,
  addUserProfile,
  updateUserProfile,
  getUserRef,
  getProjectRef,
  addNotification,
  updateNotification,
  updateModelFieldExamples,
  updateRequestParamExamples,
  updateRequestBodyExamples,
  updateResponseBodyExamples,
  updateResponseHeaderExamples,
  runTransaction,
};

const isMockMode = process.env.REACT_APP_MOCK === "true";

export default isMockMode ? mockFirework : realFirework;
