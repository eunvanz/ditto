import { useCallback, useEffect } from "react";

export interface UseModalKeyControlParams {
  isVisible: boolean;
  onClose: () => void;
}

const useModalKeyControl = ({
  isVisible,
  onClose,
}: UseModalKeyControlParams) => {
  const handleOnPressKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isVisible) {
          e.stopPropagation();
          onClose();
        }
      }
    },
    [isVisible, onClose]
  );

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("keyup", handleOnPressKey);
      return () => {
        document.removeEventListener("keyup", handleOnPressKey);
      };
    }
  }, [handleOnPressKey, isVisible]);
};

export default useModalKeyControl;
