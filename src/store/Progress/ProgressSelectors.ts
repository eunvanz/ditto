import { RootState } from "..";

const createInProgressSelector = (actionTypes: string[] | string) => (
  state: RootState
) => {
  if (typeof actionTypes === "string") {
    return state.progress.includes(actionTypes);
  } else {
    return actionTypes.some((item) => state.progress.includes(item));
  }
};

const ProgressSelectors = {
  createInProgressSelector,
};

export default ProgressSelectors;
