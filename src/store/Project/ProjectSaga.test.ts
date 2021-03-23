import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";
import { initialRootState, rootReducer } from "..";
import Alert from "../../components/Alert";
import { getTimestamp } from "../../firebase";
import mockUser from "../../mocks/mockUser";
import { initialFirebaseState } from "../Firebase";
import Firework from "../Firework";
import { UiActions } from "../Ui/UiSlice";
import {
  submitProjectFormFlow,
  watchProjectActions,
  listenToMyProjectsFlow,
} from "./ProjectSaga";
import { ProjectActions } from "./ProjectSlice";

describe("ProjectFormSaga", () => {
  describe("submitProjectFormFlow", () => {
    const actionCreator = ProjectActions.submitProjectForm;
    const payload = {
      data: {
        title: "test",
        description: "test",
      },
      type: "create" as const,
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
          ...payload.data,
          members: {
            [auth.uid]: true,
          },
          owners: {
            [auth.uid]: true,
          },
          managers: {},
          guests: {},
          createdAt: timestamp,
          updatedAt: timestamp,
          createdBy: auth.uid,
          updatedBy: auth.uid,
          settingsByMembers: {
            [auth.uid]: {
              updatedAt: timestamp,
              seq: 1,
            },
          },
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
      return expectSaga(watchProjectActions)
        .fork(submitProjectFormFlow)
        .fork(listenToMyProjectsFlow)
        .silentRun();
    });
  });
});
