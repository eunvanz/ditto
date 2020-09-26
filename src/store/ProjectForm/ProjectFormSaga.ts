import { fork, take, all, put, call, select } from "typed-redux-saga";
import ProjectFormSlice from "./ProjectFormSlice";
import ProgressSlice from "../Progress/ProgressSlice";
import Firework from "../Firework";
import UiSlice, { UiActions } from "../Ui/UiSlice";
import AuthSelectors from "../Auth/AuthSelector";
import Alert from "../../components/Alert";
import { getTimestamp } from "../../firebase";
import { ErrorActions } from "../Error/ErrorSlice";

export function* submitProjectFormFlow() {
  while (true) {
    const { type, payload } = yield* take(
      ProjectFormSlice.actions.submitProjectForm
    );
    const auth = yield* select(AuthSelectors.selectAuth);

    // 로그인이 돼있지 않은 경우 로그인 유도
    if (auth.isEmpty) {
      yield* call(Alert.message, {
        title: "로그인 필요",
        message: "로그인이 필요한 기능입니다.",
      });
      yield* put(UiActions.hideProjectFormModal());
      yield* put(UiActions.showSignInModal());
      continue;
    }

    yield* all([
      put(ProgressSlice.actions.startProgress(type)),
      put(UiSlice.actions.showLoading()),
    ]);
    const timestamp = yield* call(getTimestamp);
    try {
      yield* call(Firework.addDocument, "projects", {
        ...payload,
        owners: {
          [auth.uid]: true,
        },
        members: {},
        guests: {},
        createdAt: timestamp,
        updatedAt: timestamp,
        createdBy: auth.uid,
        updatedBy: auth.uid,
      });
      yield* all([
        put(
          UiSlice.actions.showNotification({
            message: "새 프로젝트가 생성됐습니다.",
          })
        ),
        put(UiSlice.actions.hideProjectFormModal()),
      ]);
    } catch (error) {
      yield* put(ErrorActions.catchError({ error }));
    } finally {
      yield* all([
        put(ProgressSlice.actions.finishProgress(type)),
        put(UiSlice.actions.hideLoading()),
      ]);
    }
  }
}

export function* watchProjectFormActions() {
  yield* all([fork(submitProjectFormFlow)]);
}
