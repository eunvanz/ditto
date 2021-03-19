import { fork, take, all, call, select } from "typed-redux-saga";
import ErrorSlice from "./ErrorSlice";
import ROUTE from "../../paths";
import Alert from "../../components/Alert";
import history from "../../helpers/history";
import Sentry from "../../helpers/sentry";
import FirebaseSelectors from "../Firebase/FirebaseSelectors";

export function* catchErrorFlow() {
  while (true) {
    const {
      payload: { error, isAlertOnly },
    } = yield* take(ErrorSlice.actions.catchError);
    console.error("an error has been caught in saga - ", error);

    const userProfile = yield* select(FirebaseSelectors.selectUserProfile);
    Sentry.setUser({
      name: userProfile.name,
      uid: userProfile.uid,
      email: userProfile.email,
    });
    Sentry.captureException(error);
    if (
      ![ROUTE.NETWORK_ERROR, ROUTE.ERROR].includes(window.location.pathname)
    ) {
      yield* call(Alert.message, {
        title: "오류",
        message: error.message || "알 수 없는 오류가 발생했습니다.",
      });
    }
    if (!isAlertOnly) {
      yield* call(history.push, ROUTE.ERROR);
    }
  }
}

export function* watchErrorActions() {
  yield* all([fork(catchErrorFlow)]);
}
