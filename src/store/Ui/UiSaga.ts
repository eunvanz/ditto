import { all, takeEvery, put } from "typed-redux-saga";
import UiSlice from "./UiSlice";
import shortid from "shortid";

export function* handleShowNotification(
  action: ReturnType<typeof UiSlice.actions.showNotification>
) {
  const { message, type = "success" } = action.payload;
  yield* put(
    UiSlice.actions.receiveNotification({
      key: shortid.generate(),
      message,
      options: {
        variant: type,
        autoHideDuration: 3000,
      },
    })
  );
}

export function* watchUiActions() {
  yield* all([
    takeEvery(UiSlice.actions.showNotification, handleShowNotification),
  ]);
}
