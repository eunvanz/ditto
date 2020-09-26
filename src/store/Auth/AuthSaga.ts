import { fork, take, all } from "typed-redux-saga";
import AuthSlice from "./AuthSlice";

export function* signInWithGoogleFlow() {
  while (true) {
    const { type } = yield* take(AuthSlice.actions.signInWithGoogle);
  }
}

export function* watchAuthActions() {
  yield* all([fork(signInWithGoogleFlow)]);
}
