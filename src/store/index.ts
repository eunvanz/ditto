import { configureStore, combineReducers } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import UiSlice, { initialUiState } from "./Ui/UiSlice";
import ProgressSlice, { initialProgressState } from "./Progress/ProgressSlice";
import ProjectSlice, { initialProjectState } from "./Project/ProjectSlice";
import watchAllActions from "./RootSaga";
import FirebaseSlice, { initialFirebaseState } from "./Firebase";
import ErrorSlice, { initialErrorState } from "./Error/ErrorSlice";
import AuthSlice, { initialAuthState } from "./Auth/AuthSlice";
import DataSlice, { initialDataState } from "./Data/DataSlice";

export const rootReducer = combineReducers({
  firebase: FirebaseSlice.reducer,
  ui: UiSlice.reducer,
  progress: ProgressSlice.reducer,
  project: ProjectSlice.reducer,
  error: ErrorSlice.reducer,
  auth: AuthSlice.reducer,
  data: DataSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const initialRootState: RootState = {
  firebase: initialFirebaseState as any,
  ui: initialUiState,
  progress: initialProgressState,
  project: initialProjectState,
  error: initialErrorState,
  auth: initialAuthState,
  data: initialDataState,
};

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

export const createStore = (preloadedState: RootState = initialRootState) =>
  configureStore({
    reducer: rootReducer,
    middleware,
    devTools: true,
    preloadedState,
  });

const store = createStore();

sagaMiddleware.run(watchAllActions);

export default store;
