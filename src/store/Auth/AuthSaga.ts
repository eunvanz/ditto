import { fork, take, all, call } from "typed-redux-saga";
import { AuthActions } from "./AuthSlice";
import { getFirebase } from "react-redux-firebase";
import Alert from "../../components/Alert";
import history from "../../helpers/history";
import ROUTE from "../../paths";

export function* signInWithGoogleFlow() {
  while (true) {
    yield* take(AuthActions.signInWithGoogle);
    const firebase = yield* call(getFirebase);
    yield* call(firebase.login, { provider: "google", type: "redirect" });
  }
}

export function* signOutFlow() {
  while (true) {
    yield* take(AuthActions.signOut);
    const isConfirmed = yield* call(Alert.confirm, {
      title: "로그아웃",
      message: "정말 로그아웃 하시겠습니까?",
    });
    if (!isConfirmed) {
      continue;
    }
    const firebase = yield* call(getFirebase);
    yield* call(firebase.logout);
    yield* call(history.push, ROUTE.ROOT);
  }
}

export function* watchAuthActions() {
  yield* all([fork(signInWithGoogleFlow), fork(signOutFlow)]);
}
