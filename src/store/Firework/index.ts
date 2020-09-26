import { db } from "../../firebase";
import mockFirework from "./mockFirework";

function* addDocument<T>(path: string, data: T) {
  yield db.collection(path).add(data);
}

export const realFirework = {
  addDocument,
};

const isMockMode = process.env.REACT_APP_MOCK === "true";

export default isMockMode ? mockFirework : realFirework;
