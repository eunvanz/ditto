import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import UiSelectors from "../../store/Ui/UiSelectors";
import { UiActions } from "../../store/Ui/UiSlice";

const useSearchUserFormModalProps = () => {
  const dispatch = useDispatch();

  const { isVisible } = useSelector(UiSelectors.selectSearchUserFormModal);

  const onClose = useCallback(() => {
    dispatch(UiActions.hideSearchUserFormModal());
  }, [dispatch]);

  return { isVisible, onClose };
};

export default useSearchUserFormModalProps;
