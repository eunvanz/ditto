import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import UiSelectors from "../../store/Ui/UiSelectors";
import { UiActions } from "../../store/Ui/UiSlice";

const useCodeModalProps = () => {
  const dispatch = useDispatch();

  const { isVisible, title, value, mode } = useSelector(UiSelectors.selectCodeModal);

  const onClose = useCallback(() => {
    dispatch(UiActions.hideCodeModal());
  }, [dispatch]);

  const theme = useSelector(UiSelectors.selectTheme);

  return {
    isVisible,
    title,
    value,
    mode,
    onClose,
    theme,
  };
};

export default useCodeModalProps;
