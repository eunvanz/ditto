import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { isLoaded } from "react-redux-firebase";
import { UiActions } from "../store/Ui/UiSlice";

const useLoading = (data: any, taskName: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoaded(data)) {
      dispatch(UiActions.showLoading(taskName));
    } else {
      dispatch(UiActions.hideLoading(taskName));
    }
  }, [data, dispatch, taskName]);
};

export default useLoading;
