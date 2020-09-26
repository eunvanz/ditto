import { ProjectFormActions } from "./ProjectSlice";
import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";
import { submitProjectFormFlow, watchProjectFormActions } from "./ProjectSaga";
import { ProjectFormValues } from "../../components/ProjectForm/ProjectForm";
import { initialRootState, rootReducer } from "..";
import { initialFirebaseState } from "../Firebase";
import mockUser from "../../mocks/mockUser";
import Firework from "../Firework";
import { getTimestamp } from "../../firebase";
import { UiActions } from "../Ui/UiSlice";
import Alert from "../../components/Alert";

describe("ProjectFormSaga", () => {
  describe("submitProjectFormFlow", () => {
    const actionCreator = ProjectFormActions.submitProjectForm;
    const payload: ProjectFormValues = {
      title: "test",
      description: "test",
    };
    const action = actionCreator(payload);

    it("정상적으로 프로젝트를 생성한다.", () => {
      const auth = mockUser.auth;

      const initialState = {
        ...initialRootState,
        firebase: {
          ...initialFirebaseState,
          auth,
        },
      };

      const timestamp = "2020년 9월 26일 오후 11시 16분 46초 UTC+9";

      return expectSaga(submitProjectFormFlow)
        .provide([
          [matchers.call.fn(getTimestamp), timestamp],
          [matchers.call.fn(Firework.addDocument), undefined],
        ])
        .withReducer(rootReducer)
        .withState(initialState)
        .take(actionCreator)
        .call(Firework.addProject, {
          ...payload,
          owners: {
            [auth.uid]: true,
          },
          members: {},
          guests: {},
          createdAt: timestamp,
          updatedAt: timestamp,
          createdBy: auth.uid,
          updatedBy: auth.uid,
        })
        .dispatch(action)
        .silentRun();
    });

    it("로그인이 돼있지 않은 경우 로그인을 유도한다.", () => {
      const initialState = {
        ...initialRootState,
      };

      return expectSaga(submitProjectFormFlow)
        .provide([[matchers.call.fn(Alert.message), undefined]])
        .withReducer(rootReducer)
        .withState(initialState)
        .take(actionCreator)
        .call(Alert.message, {
          title: "로그인 필요",
          message: "로그인이 필요한 기능입니다.",
        })
        .put(UiActions.hideProjectFormModal())
        .put(UiActions.showSignInModal())
        .dispatch(action)
        .silentRun();
    });
  });

  describe("watchProjectFormActions", () => {
    it("과 관련된 모든 액션들을 감시한다.", () => {
      return expectSaga(watchProjectFormActions)
        .fork(submitProjectFormFlow)
        .silentRun();
    });
  });
});
