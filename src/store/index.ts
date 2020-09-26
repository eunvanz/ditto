import { configureStore, combineReducers } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import UiSlice, { initialUiState } from "./Ui/UiSlice";
import ProgressSlice, { initialProgressState } from "./Progress/ProgressSlice";
import ProjectFormSlice, {
  initialProjectFormState,
} from "./ProjectForm/ProjectFormSlice";
import watchAllActions from "./RootSaga";
import FirebaseSlice, { initialFirebaseState } from "./Firebase";
import ErrorSlice, { initialErrorState } from "./Error/ErrorSlice";

export const rootReducer = combineReducers({
  firebase: FirebaseSlice.reducer,
  ui: UiSlice.reducer,
  progress: ProgressSlice.reducer,
  projectForm: ProjectFormSlice.reducer,
  error: ErrorSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const initialRootState: RootState = {
  firebase: initialFirebaseState as any,
  ui: initialUiState,
  progress: initialProgressState,
  projectForm: initialProjectFormState,
  error: initialErrorState,
};

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const store = configureStore({
  reducer: rootReducer,
  middleware,
  devTools: true,
});

sagaMiddleware.run(watchAllActions);

export default store;
