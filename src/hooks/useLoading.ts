import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isLoaded } from "react-redux-firebase";
import { UiActions } from "../store/Ui/UiSlice";
import UiSelectors from "../store/Ui/UiSelectors";

const useLoading = (data: any, taskName: string, isNullable?: boolean) => {
  const dispatch = useDispatch();

  const loadingTasks = useSelector(UiSelectors.selectLoadingTasks);

  useEffect(() => {
    if (!isNullable && !isLoaded(data)) {
      if (!loadingTasks.includes(taskName)) {
        dispatch(UiActions.showLoading(taskName));
      }
    } else {
      if (loadingTasks.includes(taskName)) {
        dispatch(UiActions.hideLoading(taskName));
      }
    }
  }, [data, dispatch, taskName, isNullable, loadingTasks]);
};

export default useLoading;
