import { db } from "../../firebase";
import mockFirework from "./mockFirework";
import { ProjectItem } from "../../types";
import { call } from "typed-redux-saga";

function* addDocument<T>(path: string, data: T) {
  yield db.collection(path).add(data);
}

function* addProject(data: ProjectItem) {
  yield call(addDocument, "projects", data);
}

function getMyProjectsRef(uid: string) {
  return db.collection("projects").where(`members.${uid}`, "==", true);
}

function* updateDocument<T>(path: string, id: string, data: Partial<T>) {
  yield db.collection(path).doc(id).update(data);
}

function* updateProject(id: string, data: Partial<ProjectItem>) {
  yield call(updateDocument, "projects", id, data);
}

export const realFirework = {
  addDocument,
  addProject,
  getMyProjectsRef,
  updateProject,
};

const isMockMode = process.env.REACT_APP_MOCK === "true";

export default isMockMode ? mockFirework : realFirework;
