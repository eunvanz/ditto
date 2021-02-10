import { db } from "../../firebase";
import mockFirework from "./mockFirework";
import {
  ProjectItem,
  ProjectUrlItem,
  ProjectUrlDoc,
  ModelItem,
  ModelFieldItem,
  ModelDoc,
  ModelFieldDoc,
  ModifiableModelFieldItem,
  EnumerationItem,
  EnumerationDoc,
  GroupItem,
  GroupDoc,
} from "../../types";
import { call } from "typed-redux-saga";

function addDocument<T>(path: string, data: T) {
  return db.collection(path).add(data);
}

function* addProject(data: ProjectItem) {
  return yield* call(addDocument, "projects", data);
}

function getMyProjectsRef(uid: string) {
  return db.collection("projects").where(`members.${uid}`, "==", true);
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
  return db
    .collection(`projects/${projectId}/urls`)
    .orderBy("createdAt", "asc");
}

function* deleteProjectUrl(projectUrl: ProjectUrlDoc) {
  yield* call(
    deleteDocument,
    `projects/${projectUrl.projectId}/urls/`,
    projectUrl.id
  );
}

function* updateProjectUrl(id: string, projectUrl: Partial<ProjectUrlItem>) {
  yield* call(
    updateDocument,
    `projects/${projectUrl.projectId}/urls`,
    id,
    projectUrl
  );
}

function* updateModel(id: string, model: Partial<ModelItem>) {
  yield* call(updateDocument, `projects/${model.projectId}/models`, id, model);
}

function* updateModelField(id: string, modelField: ModifiableModelFieldItem) {
  yield* call(
    updateDocument,
    `projects/${modelField.projectId}/models/${modelField.modelId}/modelFields`,
    id,
    modelField
  );
}

function* addModel(data: ModelItem) {
  return yield* call(addDocument, `projects/${data.projectId}/models`, data);
}

function* addModelField(data: ModelFieldItem) {
  return yield* call(
    addDocument,
    `projects/${data.projectId}/models/${data.modelId}/modelFields`,
    data
  );
}

function getModelRef({
  projectId,
  modelId,
}: {
  projectId: string;
  modelId: string;
}) {
  return db.doc(`projects/${projectId}/models/${modelId}`);
}

function getProjectModelsRef(projectId: string) {
  return db.collection(`projects/${projectId}/models`);
}

function* deleteModel(model: ModelDoc) {
  yield* call(deleteDocument, `projects/${model.projectId}/models/`, model.id);
}

function getModelFieldsRef(model: ModelDoc) {
  return db.collection(
    `projects/${model.projectId}/models/${model.id}/modelFields`
  );
}

function* deleteModelField(modelField: ModelFieldDoc) {
  yield* call(
    deleteDocument,
    `projects/${modelField.projectId}/models/${modelField.modelId}/modelFields/`,
    modelField.id
  );
}

function getModelFieldsReferringModelRef(
  referringModel: ModelDoc,
  referredModel: ModelDoc
) {
  return db
    .collection(
      `projects/${referringModel.projectId}/models/${referringModel.id}/modelFields`
    )
    .where("format.value", "==", referredModel.id);
}

function getModelFieldsReferringEnumerationRef(
  referringModel: ModelDoc,
  referredEnumeration: EnumerationDoc
) {
  return db
    .collection(
      `projects/${referringModel.projectId}/models/${referringModel.id}/modelFields`
    )
    .where("enum.value", "==", referredEnumeration.id);
}

function* addEnumeration(data: EnumerationItem) {
  return yield* call(
    addDocument,
    `projects/${data.projectId}/enumerations`,
    data
  );
}

function* updateEnumeration(id: string, data: Partial<EnumerationItem>) {
  yield* call(
    updateDocument,
    `projects/${data.projectId}/enumerations`,
    id,
    data
  );
}

function getProjectEnumerationsRef(projectId: string) {
  return db.collection(`projects/${projectId}/enumerations`);
}

function* deleteEnumeration(enumeration: EnumerationDoc) {
  yield* call(
    deleteDocument,
    `projects/${enumeration.projectId}/enumerations`,
    enumeration.id
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
};

const isMockMode = process.env.REACT_APP_MOCK === "true";

export default isMockMode ? mockFirework : realFirework;
