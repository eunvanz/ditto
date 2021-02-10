import { isArray } from "lodash";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { UiActions } from "../store/Ui/UiSlice";

const useLoading = (data: any | any[]) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data || (isArray(data) && data.includes(undefined))) {
      dispatch(UiActions.showLoading());
    } else {
      dispatch(UiActions.hideLoading());
    }
  }, [data, dispatch]);
};

export default useLoading;
