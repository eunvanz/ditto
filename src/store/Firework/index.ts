import { db } from "../../firebase";
import mockFirework from "./mockFirework";
import {
  ProjectItem,
  ProjectUrlItem,
  ProjectUrlDoc,
  ModelItem,
  ModelFieldItem,
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

function* addModel(data: ModelItem) {
  return yield* call(addDocument, `projects/${data.projectId}/models`, data);
}

function* addModelField(data: ModelFieldItem) {
  return yield* call(
    addDocument,
    `projects/${data.projectId}/models/${data.modelId}`,
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
};

const isMockMode = process.env.REACT_APP_MOCK === "true";

export default isMockMode ? mockFirework : realFirework;
