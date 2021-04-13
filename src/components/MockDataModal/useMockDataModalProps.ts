import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import UiSelectors from "../../store/Ui/UiSelectors";
import { UiActions } from "../../store/Ui/UiSlice";

const useMockDataModalProps = () => {
  const dispatch = useDispatch();

  const { isVisible, targetInterface, interfaces, enumerations } = useSelector(
    UiSelectors.selectMockDataModal,
  );

  const onClose = useCallback(() => {
    dispatch(UiActions.hideMockDataModal());
  }, [dispatch]);

  const theme = useSelector(UiSelectors.selectTheme);

  return {
    isVisible,
    targetInterface,
    interfaces,
    enumerations,
    onClose,
    theme,
  };
};

export default useMockDataModalProps;
