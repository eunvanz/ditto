import { fork, take, all, put, call } from "typed-redux-saga";
import ProjectFormSlice from "./ProjectFormSlice";
import ProgressSlice from "../Progress/ProgressSlice";
import Fireworks from "../Fireworks";

export function* submitProjectFormFlow() {
  while (true) {
    const { type, payload } = yield* take(
      ProjectFormSlice.actions.submitProjectForm
    );
    yield* put(ProgressSlice.actions.startProgress(type));
    yield* call(Fireworks.addDocument, "projects", payload);
    yield* put(ProgressSlice.actions.finishProgress(type));
  }
}

export function* watchProjectFormActions() {
  yield* all([fork(submitProjectFormFlow)]);
}
