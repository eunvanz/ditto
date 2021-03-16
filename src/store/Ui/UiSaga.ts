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
import FirebaseSelectors from "../Firebase/FirebaseSelectors";
import Firework from "../Firework";
import UiSelectors from "./UiSelectors";

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
 * 지연시간 이상일 때에만 로딩 표시 (기본 200ms)
 */
export function* handleShowDelayedLoading(
  action: ReturnType<typeof UiActions.showDelayedLoading>
) {
  const { isDelayed } = yield* race({
    isDelayed: call(delay, action.payload.delay || 200),
    isLoadingHidden: take(UiActions.hideLoading),
  });
  if (isDelayed) {
    yield* put(UiActions.showLoading(action.payload.taskName));
  }
}

export function* handleShowQuickModelNameFormModal(
  action: ReturnType<typeof UiActions.showQuickModelNameFormModal>
) {
  // FIXME: 추후 공통 미들웨어로 작성
  const auth = yield* select(AuthSelectors.selectAuth);
  if (auth.isEmpty) {
    yield* put(UiActions.showSignInModal());
  } else {
    const { payload } = action;
    yield* put(
      UiActions.receiveQuickModelNameFormModal({
        isVisible: true,
        model: payload,
      })
    );
  }
}

export function* handleHideQuickModelNameFormModal(
  _: ReturnType<typeof UiActions.hideQuickModelNameFormModal>
) {
  // 모달이 완전히 닫힌 후에 project를 undefined로 세팅
  yield* delay(100);
  yield* put(UiActions.clearQuickModelNameFormModal());
}

export function* handleReloadApp() {
  yield* call(window.location.reload.bind(window.location), true);
}

export function* handleToggleDarkMode(
  action: ReturnType<typeof UiActions.receiveTheme>
) {
  const { payload } = action;
  const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
  if (userProfile.theme !== payload) {
    yield* call(Firework.updateUserProfile, userProfile.uid, {
      theme: payload,
    });
  }
}

export function* handleToggleScreenMode(
  _: ReturnType<typeof UiActions.toggleScreenMode>
) {
  const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
  const screenMode = yield* select(UiSelectors.selectScreenMode);
  if (userProfile.screenMode !== screenMode) {
    yield* call(Firework.updateUserProfile, userProfile.uid, { screenMode });
  }
}

export function* watchUiActions() {
  yield* all([
    takeEvery(UiActions.showNotification, handleShowNotification),
    takeEvery(UiActions.hideProjectFormModal, handleHideProjectFormModal),
    takeEvery(UiActions.showProjectFormModal, handleShowProjectFormModal),
    takeEvery(UiActions.showDelayedLoading, handleShowDelayedLoading),
    takeEvery(
      UiActions.showQuickModelNameFormModal,
      handleShowQuickModelNameFormModal
    ),
    takeEvery(
      UiActions.hideQuickModelNameFormModal,
      handleHideQuickModelNameFormModal
    ),
    takeEvery(UiActions.reloadApp, handleReloadApp),
    takeEvery(UiActions.receiveTheme, handleToggleDarkMode),
    takeEvery(UiActions.toggleScreenMode, handleToggleScreenMode),
  ]);
}
