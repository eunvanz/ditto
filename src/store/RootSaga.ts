import { all, fork } from "redux-saga/effects";
import { watchProjectFormActions } from "./ProjectForm/ProjectFormSaga";
import { watchUiActions } from "./Ui/UiSaga";

function* watchAllActions() {
  yield all([fork(watchProjectFormActions), fork(watchUiActions)]);
}

export default watchAllActions;
