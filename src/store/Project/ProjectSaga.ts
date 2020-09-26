import { fork, take, all, put, call, select } from "typed-redux-saga";
import { ProjectActions } from "./ProjectSlice";
import { ProgressActions } from "../Progress/ProgressSlice";
import Firework from "../Firework";
import { UiActions } from "../Ui/UiSlice";
import AuthSelectors from "../Auth/AuthSelector";
import Alert from "../../components/Alert";
import { getTimestamp } from "../../firebase";
import { ErrorActions } from "../Error/ErrorSlice";

export function* submitProjectFormFlow() {
  while (true) {
    const { type, payload } = yield* take(ProjectActions.submitProjectForm);
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
      put(ProgressActions.startProgress(type)),
      put(UiActions.showLoading()),
    ]);
    const timestamp = yield* call(getTimestamp);
    try {
      yield* call(Firework.addProject, {
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
          UiActions.showNotification({
            message: "새 프로젝트가 생성됐습니다.",
          })
        ),
        put(UiActions.hideProjectFormModal()),
      ]);
    } catch (error) {
      yield* put(ErrorActions.catchError({ error }));
    } finally {
      yield* all([
        put(ProgressActions.finishProgress(type)),
        put(UiActions.hideLoading()),
      ]);
    }
  }
}

export function* watchProjectFormActions() {
  yield* all([fork(submitProjectFormFlow)]);
}
