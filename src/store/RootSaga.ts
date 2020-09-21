import { all, fork } from "redux-saga/effects";
import { watchProjectFormActions } from "./ProjectForm/ProjectFormSaga";

function* watchAllActions() {
  yield all([fork(watchProjectFormActions)]);
}

export default watchAllActions;
