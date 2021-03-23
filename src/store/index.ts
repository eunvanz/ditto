import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { FirebaseReducer } from "react-redux-firebase";
import createSagaMiddleware from "redux-saga";
import { UserProfileDoc } from "../types";
import AuthSlice, { initialAuthState } from "./Auth/AuthSlice";
import ErrorSlice, { initialErrorState } from "./Error/ErrorSlice";
import FirebaseSlice, { initialFirebaseState, initialFirestoreState } from "./Firebase";
import ProgressSlice, { initialProgressState } from "./Progress/ProgressSlice";
import ProjectSlice, { initialProjectState } from "./Project/ProjectSlice";
import watchAllActions from "./RootSaga";
import UiSlice, { initialUiState } from "./Ui/UiSlice";

export const rootReducer = combineReducers({
  firebase: FirebaseSlice.firebaseReducer,
  firestore: FirebaseSlice.firestoreReducer,
  ui: UiSlice.reducer,
  progress: ProgressSlice.reducer,
  project: ProjectSlice.reducer,
  error: ErrorSlice.reducer,
  auth: AuthSlice.reducer,
});

export type RootState = {
  firebase: FirebaseReducer.Reducer<UserProfileDoc, any>;
} & Omit<ReturnType<typeof rootReducer>, "firebase">;

export const initialRootState: RootState = {
  firebase: initialFirebaseState as any,
  firestore: initialFirestoreState,
  ui: initialUiState,
  progress: initialProgressState,
  project: initialProjectState,
  error: initialErrorState,
  auth: initialAuthState,
};

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

export const createStore = (preloadedState: RootState = initialRootState) =>
  configureStore({
    reducer: rootReducer,
    middleware,
    devTools: process.env.NODE_ENV === "development",
    preloadedState,
  });

const store = createStore();

sagaMiddleware.run(watchAllActions);

export default store;
