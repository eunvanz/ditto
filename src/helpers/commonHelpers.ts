import { BASE_NAME } from "./history";

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
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  pathParamUrl: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//={}]*)$/,
  enumValues: {
    string: /^[a-zA-Z0-9()@:%_+.~#?&//={}가-힣]+(,[a-zA-Z0-9()@:%_+.~#?&//={}가-힣]+)*$/,
    integer: /^[0-9]+(,[0-9]+)*$/,
  },
};

/**
 * record형태를 array형태로 변경하여 반환
 * @param record
 */
export function convertRecordToArray<T>(record: Record<string, T>) {
  const keys = Object.keys(record);
  return keys.map((key) => record[key]);
}

/**
 * location객체에서 쿼리를 포함한 url을 추출하여 리턴
 * @param location location 객체
 */
export const getPathFromLocation = (location: Location) => {
  const pathname = location.pathname.replace(BASE_NAME, "");
  return `${pathname}${location.search}`;
};
