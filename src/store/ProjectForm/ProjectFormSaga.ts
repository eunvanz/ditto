import { fork, take, all, put, call } from "typed-redux-saga";
import ProjectFormSlice from "./ProjectFormSlice";
import ProgressSlice from "../Progress/ProgressSlice";
import Fireworks from "../Fireworks";
import Alert from "../../components/Alert";

export function* submitProjectFormFlow() {
  while (true) {
    const { type, payload } = yield* take(
      ProjectFormSlice.actions.submitProjectForm
    );
    yield* put(ProgressSlice.actions.startProgress(type));
    yield* call(Fireworks.addDocument, "projects", payload);
    yield* put(ProgressSlice.actions.finishProgress(type));
    yield* call(Alert.message, {
      title: "프로젝트 생성",
      message: "새 프로젝트가 생성됐습니다.",
    });
  }
}

export function* watchProjectFormActions() {
  yield* all([fork(submitProjectFormFlow)]);
}
