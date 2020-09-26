import { all, takeEvery, put, delay } from "typed-redux-saga";
import { UiActions } from "./UiSlice";
import shortid from "shortid";

export function* handleShowNotification(
  action: ReturnType<typeof UiActions.showNotification>
) {
  const { message, type = "success" } = action.payload;
  yield* put(
    UiActions.receiveNotification({
      key: shortid.generate(),
      message,
      options: {
        variant: type,
        autoHideDuration: 3000,
      },
    })
  );
}

export function* handleHideProjectFormModal(
  _: ReturnType<typeof UiActions.hideProjectFormModal>
) {
  // 모달이 완전히 닫힌 후에 project를 undefined로 세팅
  yield* delay(100);
  yield* put(UiActions.clearProjectFormModal());
}

export function* watchUiActions() {
  yield* all([
    takeEvery(UiActions.showNotification, handleShowNotification),
    takeEvery(UiActions.hideProjectFormModal, handleHideProjectFormModal),
  ]);
}
