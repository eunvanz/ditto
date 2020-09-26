import { fork, take, all, call } from "typed-redux-saga";
import { AuthActions } from "./AuthSlice";
import { getFirebase } from "react-redux-firebase";

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
    const firebase = yield* call(getFirebase);
    yield* call(firebase.logout);
  }
}

export function* watchAuthActions() {
  yield* all([fork(signInWithGoogleFlow), fork(signOutFlow)]);
}
