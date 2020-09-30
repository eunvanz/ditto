import { fork, take, all, call, put } from "typed-redux-saga";
import { AuthActions } from "./AuthSlice";
import { getFirebase } from "react-redux-firebase";
import history from "../../helpers/history";
import ROUTE from "../../paths";
import { DataActions, DATA_KEY } from "../Data/DataSlice";
import { UiActions } from "../Ui/UiSlice";
import { ProgressActions } from "../Progress/ProgressSlice";

export function* signInWithGoogleFlow() {
  while (true) {
    const { type } = yield* take(AuthActions.signInWithGoogle);
    yield* put(ProgressActions.startProgress(type));
    yield* put(UiActions.showLoading());
    const firebase = yield* call(getFirebase);
    yield* call(firebase.login, { provider: "google", type: "redirect" });
    yield* put(ProgressActions.finishProgress(type));
    yield* put(UiActions.hideLoading());
  }
}

export function* signOutFlow() {
  while (true) {
    yield* take(AuthActions.signOut);
    yield* put(UiActions.showLoading());
    const firebase = yield* call(getFirebase);
    yield* call(firebase.logout);
    yield* all([put(DataActions.clearData(DATA_KEY.PROJECTS))]);
    yield* call(history.push, ROUTE.ROOT);
    yield* put(UiActions.hideLoading());
  }
}

export function* watchAuthActions() {
  yield* all([fork(signInWithGoogleFlow), fork(signOutFlow)]);
}
