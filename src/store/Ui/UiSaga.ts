import {
  all,
  takeEvery,
  put,
  delay,
  select,
  race,
  take,
  call,
} from "typed-redux-saga";
import { UiActions } from "./UiSlice";
import shortid from "shortid";
import AuthSelectors from "../Auth/AuthSelector";

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

export function* handleShowProjectFormModal(
  action: ReturnType<typeof UiActions.hideProjectFormModal>
) {
  const auth = yield* select(AuthSelectors.selectAuth);
  if (auth.isEmpty) {
    yield* put(UiActions.showSignInModal());
  } else {
    const { payload } = action;
    yield* put(
      UiActions.receiveProjectFormModal({
        isVisible: true,
        project: payload,
      })
    );
  }
}

/**
 * 지연이 200ms 이상일 때에만 로딩 표시
 */
export function* handleShowDelayedLoading() {
  const { isDelayed } = yield* race({
    isDelayed: call(delay, 200),
    isLoadingHidden: take(UiActions.hideLoading),
  });
  if (isDelayed) {
    yield* put(UiActions.showLoading());
  }
}

export function* watchUiActions() {
  yield* all([
    takeEvery(UiActions.showNotification, handleShowNotification),
    takeEvery(UiActions.hideProjectFormModal, handleHideProjectFormModal),
    takeEvery(UiActions.showProjectFormModal, handleShowProjectFormModal),
    takeEvery(UiActions.showDelayedLoading, handleShowDelayedLoading),
  ]);
}
