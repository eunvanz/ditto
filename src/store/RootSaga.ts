import { all, fork } from "redux-saga/effects";
import { watchAuthActions } from "./Auth/AuthSaga";
import { watchErrorActions } from "./Error/ErrorSaga";
import { watchProjectActions } from "./Project/ProjectSaga";
import { watchUiActions } from "./Ui/UiSaga";

function* watchAllActions() {
  yield all([
    fork(watchProjectActions),
    fork(watchUiActions),
    fork(watchErrorActions),
    fork(watchAuthActions),
  ]);
}

export default watchAllActions;
