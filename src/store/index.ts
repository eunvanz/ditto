import { configureStore, combineReducers } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import UiSlice, { initialUiState } from "./Ui/UiSlice";
import ProgressSlice, { initialProgressState } from "./Progress/ProgressSlice";
import ProjectFormSlice, {
  initialProjectFormState,
} from "./ProjectForm/ProjectFormSlice";
import watchAllActions from "./RootSaga";

export const rootReducer = combineReducers({
  ui: UiSlice.reducer,
  progress: ProgressSlice.reducer,
  projectForm: ProjectFormSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const initialRootState: RootState = {
  ui: initialUiState,
  progress: initialProgressState,
  projectForm: initialProjectFormState,
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
