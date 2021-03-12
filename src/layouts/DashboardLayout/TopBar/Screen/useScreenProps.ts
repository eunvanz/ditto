import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import UiSelectors from "../../../../store/Ui/UiSelectors";
import { UiActions } from "../../../../store/Ui/UiSlice";

const useScreenProps = () => {
  const screenMode = useSelector(UiSelectors.selectScreenMode);

  const dispatch = useDispatch();

  const onToggleScreenMode = useCallback(() => {
    dispatch(UiActions.toggleScreenMode());
  }, [dispatch]);

  return {
    screenMode,
    onToggleScreenMode,
  };
};

export default useScreenProps;
