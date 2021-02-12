import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UiSelectors from "../store/Ui/UiSelectors";
import { UiActions } from "../store/Ui/UiSlice";

export interface UseModalKeyControlParams {
  isVisible?: boolean;
  onClose?: () => void;
  name: string;
  isDisabled?: boolean;
}

const useModalKeyControl = ({
  isVisible,
  onClose,
  name,
  isDisabled,
}: UseModalKeyControlParams) => {
  const dispatch = useDispatch();

  const modalLayers = useSelector(UiSelectors.selectModalLayers);

  const handleOnPressKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (!isDisabled && modalLayers[modalLayers.length - 1] === name) {
          onClose?.();
        }
      }
    },
    [isDisabled, modalLayers, name, onClose]
  );

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("keydown", handleOnPressKey);
      return () => {
        document.removeEventListener("keydown", handleOnPressKey);
      };
    }
  }, [dispatch, handleOnPressKey, isVisible, name]);

  useEffect(() => {
    if (isVisible) {
      dispatch(UiActions.pushModalLayer(name));
      return () => {
        dispatch(UiActions.popModalLayer());
      };
    }
  }, [dispatch, isVisible, name]);
};

export default useModalKeyControl;
