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

export const regExps = {
  url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
};

export function convertRecordToArray<T>(record: Record<string, T>) {
  const keys = Object.keys(record);
  return keys.map((key) => record[key]);
}
