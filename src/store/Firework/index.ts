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

function* listenToMyProjects<T>(path: string, uid: string) {
  yield db
    .collection("projects")
    .where(`owners.${uid}`, "==", true)
    .where(`members.${uid}`, "==", true)
    .where(`guests.${uid}`, "==", true)
    .get();
}

export const realFirework = {
  addDocument,
  addProject,
};

const isMockMode = process.env.REACT_APP_MOCK === "true";

export default isMockMode ? mockFirework : realFirework;
