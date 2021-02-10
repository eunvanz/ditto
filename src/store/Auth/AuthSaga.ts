import { fork, take, all, call, put, select } from "typed-redux-saga";
import { AuthActions } from "./AuthSlice";
import { getFirebase } from "react-redux-firebase";
import { actionTypes } from "redux-firestore";
import history from "../../helpers/history";
import ROUTE from "../../paths";
import { UiActions } from "../Ui/UiSlice";
import { ProgressActions } from "../Progress/ProgressSlice";
import AuthSelectors from "./AuthSelector";
import Alert from "../../components/Alert";
import { ErrorActions } from "../Error/ErrorSlice";

export function* requireSignIn() {
  const auth = yield* select(AuthSelectors.selectAuth);

  // 로그인이 돼있지 않은 경우 로그인 유도
  if (auth.isEmpty) {
    yield* call(Alert.message, {
      title: "로그인 필요",
      message: "로그인이 필요한 기능입니다.",
    });
    yield* put(UiActions.hideProjectFormModal());
    yield* put(UiActions.showSignInModal());
    return false;
  }
  return true;
}

export function* signInWithGoogleFlow() {
  while (true) {
    const { type } = yield* take(AuthActions.signInWithGoogle);
    yield* put(ProgressActions.startProgress(type));
    yield* put(UiActions.showLoading());
    try {
      const firebase = yield* call(getFirebase);
      yield* call(firebase.login, { provider: "google", type: "redirect" });
    } catch (error) {
      yield* put(
        ErrorActions.catchError({
          error,
          isAlertOnly: true,
        })
      );
    } finally {
      yield* put(ProgressActions.finishProgress(type));
      yield* put(UiActions.hideLoading());
    }
  }
}

export function* signOutFlow() {
  while (true) {
    yield* take(AuthActions.signOut);
    yield* put(UiActions.showLoading());
    try {
      const firebase = yield* call(getFirebase);
      yield* call(firebase.logout);
      yield* all([put({ type: actionTypes.CLEAR_DATA })]);
      yield* call(history.push, ROUTE.ROOT);
    } catch (error) {
      yield* put(
        ErrorActions.catchError({
          error,
          isAlertOnly: true,
        })
      );
    } finally {
      yield* put(UiActions.hideLoading());
    }
  }
}

export function* watchAuthActions() {
  yield* all([fork(signInWithGoogleFlow), fork(signOutFlow)]);
}
