import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UiSelectors from "../store/Ui/UiSelectors";
import { UiActions } from "../store/Ui/UiSlice";

export interface UseModalKeyControlParams {
  isVisible?: boolean;
  onClose?: () => void;
  name: string;
}

const useModalKeyControl = ({ isVisible, onClose, name }: UseModalKeyControlParams) => {
  const dispatch = useDispatch();

  const modalLayers = useSelector(UiSelectors.selectModalLayers);
  const isModalEscapeDisabled = useSelector(UiSelectors.selectIsModalEscapeDisabled);

  const handleOnPressKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isModalEscapeDisabled) {
        e.stopPropagation();
        if (modalLayers[modalLayers.length - 1] === name) {
          onClose?.();
        }
      }
    },
    [isModalEscapeDisabled, modalLayers, name, onClose],
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
