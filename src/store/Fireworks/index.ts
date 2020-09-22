import { db } from "../../firebase";

function* addDocument<T>(path: string, data: T) {
  yield db.collection(path).add(data);
}

const Fireworks = {
  addDocument,
};

export default Fireworks;
