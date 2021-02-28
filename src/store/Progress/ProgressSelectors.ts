import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { ProjectActions } from "../Project/ProjectSlice";

const createInProgressSelector = (actionTypes: string[] | string) => (
  state: RootState
) => {
  if (typeof actionTypes === "string") {
    return state.progress.includes(actionTypes);
  } else {
    return actionTypes.some((item) => state.progress.includes(item));
  }
};

const selectSubmitModelFieldFormItemActions = createSelector(
  (state: RootState) =>
    state.progress.filter((item) =>
      item.startsWith(ProjectActions.submitModelFieldForm.type)
    ),
  (submitModelFieldFormActions) => submitModelFieldFormActions
);

const selectSubmitRequestParamFormActions = createSelector(
  (state: RootState) =>
    state.progress.filter((item) =>
      item.startsWith(ProjectActions.submitRequestParamForm.type)
    ),
  (submitModelFieldFormActions) => submitModelFieldFormActions
);

const ProgressSelectors = {
  createInProgressSelector,
  selectSubmitModelFieldFormItemActions,
  selectSubmitRequestParamFormActions,
};

export default ProgressSelectors;
