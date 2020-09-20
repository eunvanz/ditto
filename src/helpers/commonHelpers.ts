export const isEmpty = (value: any) => {
  return (
    value === "" ||
    value === null ||
    value === undefined ||
    (value != null && typeof value === "object" && !Object.keys(value).length)
  );
};

export function assertNotEmpty(value: any): asserts value {
  if (isEmpty(value)) {
    throw new Error("필수값이 없습니다.");
  }
}
