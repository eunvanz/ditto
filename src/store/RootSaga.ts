import { all, fork } from "redux-saga/effects";
import { watchProjectActions } from "./Project/ProjectSaga";
import { watchUiActions } from "./Ui/UiSaga";
import { watchErrorActions } from "./Error/ErrorSaga";
import { watchAuthActions } from "./Auth/AuthSaga";

function* watchAllActions() {
  yield all([
    fork(watchProjectActions),
    fork(watchUiActions),
    fork(watchErrorActions),
    fork(watchAuthActions),
  ]);
}

export default watchAllActions;
