import { all, fork } from "redux-saga/effects";
import { watchProjectFormActions } from "./ProjectForm/ProjectFormSaga";
import { watchUiActions } from "./Ui/UiSaga";
import { watchErrorActions } from "./Error/ErrorSaga";

function* watchAllActions() {
  yield all([
    fork(watchProjectFormActions),
    fork(watchUiActions),
    fork(watchErrorActions),
  ]);
}

export default watchAllActions;
