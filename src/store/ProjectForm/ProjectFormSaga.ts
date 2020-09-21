import { fork, take, all, put } from "typed-redux-saga";
import ProjectFormSlice from "./ProjectFormSlice";
import ProgressSlice from "../Progress/ProgressSlice";

export function* submitProjectFormFlow() {
  while (true) {
    const { type } = yield* take(ProjectFormSlice.actions.submitProjectForm);
    yield* put(ProgressSlice.actions.startProgress(type));
  }
}

export function* watchProjectFormActions() {
  yield* all([fork(submitProjectFormFlow)]);
}
