import { useEffect } from "react";

/**
 * form의 defaultValues가 다른 사용자들에 의해 변경될 경우 싱크를 맞춘다.
 * @param defaultValues
 * @param reset
 */
const useSyncDefaultValues = <T>(
  reset: (values?: T) => void,
  defaultValues?: T
) => {
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);
};

export default useSyncDefaultValues;
