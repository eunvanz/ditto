import { configureStore, combineReducers } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import UiSlice, { initialUiState } from "./Ui/UiSlice";

export const rootReducer = combineReducers({
  ui: UiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const initialRootState: RootState = {
  ui: initialUiState,
};

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const store = configureStore({
  reducer: rootReducer,
  middleware,
  devTools: true,
});

// sagaMiddleware.run(watchAllActions);

export default store;
