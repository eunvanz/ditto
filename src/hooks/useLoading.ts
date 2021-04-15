import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isLoaded } from "react-redux-firebase";
import UiSelectors from "../store/Ui/UiSelectors";
import { UiActions } from "../store/Ui/UiSlice";

const useLoading = (
  data: any,
  taskName: string,
  isNullable?: boolean,
  delay?: number,
) => {
  const dispatch = useDispatch();

  const loadingTasks = useSelector(UiSelectors.selectLoadingTasks);

  useEffect(() => {
    if (!isNullable && !isLoaded(data)) {
      if (!loadingTasks.includes(taskName)) {
        if (delay) {
          dispatch(UiActions.showDelayedLoading({ taskName, delay }));
        } else {
          dispatch(UiActions.showLoading(taskName));
        }
      }
    } else {
      if (loadingTasks.includes(taskName)) {
        dispatch(UiActions.hideLoading(taskName));
      }
    }
  }, [data, dispatch, taskName, isNullable, loadingTasks, delay]);
};

export default useLoading;
