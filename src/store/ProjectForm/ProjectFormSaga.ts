import { fork, take, all, put, call } from "typed-redux-saga";
import ProjectFormSlice from "./ProjectFormSlice";
import ProgressSlice from "../Progress/ProgressSlice";
import Firework from "../Firework";
import UiSlice from "../Ui/UiSlice";

export function* submitProjectFormFlow() {
  while (true) {
    const { type, payload } = yield* take(
      ProjectFormSlice.actions.submitProjectForm
    );
    yield* all([
      put(ProgressSlice.actions.startProgress(type)),
      put(UiSlice.actions.showLoading()),
    ]);
    yield* call(Firework.addDocument, "projects", payload);
    yield* all([
      put(ProgressSlice.actions.finishProgress(type)),
      put(
        UiSlice.actions.showNotification({
          message: "새 프로젝트가 생성됐습니다.",
        })
      ),
      put(UiSlice.actions.hideLoading()),
      put(UiSlice.actions.hideProjectFormModal()),
    ]);
  }
}

export function* watchProjectFormActions() {
  yield* all([fork(submitProjectFormFlow)]);
}
