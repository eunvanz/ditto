import { isArray } from "lodash";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { UiActions } from "../store/Ui/UiSlice";

const useLoading = (data: any | any[], taskName: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data || (isArray(data) && data.includes(undefined))) {
      dispatch(UiActions.showLoading(taskName));
    } else {
      dispatch(UiActions.hideLoading(taskName));
    }
  }, [data, dispatch, taskName]);
};

export default useLoading;
