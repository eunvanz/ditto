import firebase from "firebase";
import { FieldError } from "react-hook-form";
import {
  REQUEST_METHOD,
  MemberRole,
  ProjectDoc,
  UserProfileDoc,
  DocTimestamp,
} from "../types";

export const patterns = {
  wordsWithNoSpace: {
    value: /^[\w-/]+\S$/,
    message:
      "Try a mix of letters or numbers more than 2 characters with no spaces.",
  },
};

export const getIndentionPaddingByDepth = (depth?: number) => {
  return depth ? depth * 16 : undefined;
};

export const getButtonIndentionPaddingByDepth = (depth?: number) => {
  return depth ? depth * 16 - 28 : 4;
};

export const getTextFieldErrorProps = (error?: FieldError) => ({
  error: !!error,
  helperText: error?.message,
});

export const mediaTypes = [
  "application/json",
  "application/xml",
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain; charset=utf-8",
  "text/html",
  "application/pdf",
  "image/png",
];

export const methodOptions = [
  REQUEST_METHOD.GET,
  REQUEST_METHOD.POST,
  REQUEST_METHOD.PUT,
  REQUEST_METHOD.PATCH,
  REQUEST_METHOD.DELETE,
];

export const getRequestMethodColor = (method?: REQUEST_METHOD) => {
  switch (method) {
    case REQUEST_METHOD.GET:
      return "success";
    case REQUEST_METHOD.POST:
      return "warning";
    case REQUEST_METHOD.PUT:
      return "primary";
    case REQUEST_METHOD.DELETE:
      return "error";
    case REQUEST_METHOD.PATCH:
      return "secondary";
    default:
      return "default";
  }
};

export const getProjectKeyByRole = (role: MemberRole) => {
  switch (role) {
    case "owner":
      return "owners";
    case "manager":
      return "managers";
    case "guest":
      return "guests";
  }
};

export const checkHasAuthorization = (
  role: MemberRole,
  targetRole: MemberRole
) => {
  if (targetRole === "owner") {
    return role === "owner";
  } else if (targetRole === "manager") {
    return role === "owner" || role === "manager";
  } else if (targetRole === "guest") {
    return role === "owner" || role === "manager";
  } else {
    return false;
  }
};

export const getProjectRole = ({
  userProfile,
  project,
}: {
  userProfile?: UserProfileDoc;
  project?: ProjectDoc;
}) => {
  const uid = userProfile?.uid;
  if (!uid) {
    return "guest";
  } else if (project?.owners[uid]) {
    return "owner";
  } else if (project?.managers[uid]) {
    return "manager";
  } else {
    return "guest";
  }
};

export const removeKeyFromRecord = (
  record: Record<string, any>,
  key: string
) => {
  const keys = Object.keys(record);
  const filteredKeys = keys.filter((item) => item !== key);
  const result: Record<string, any> = {};
  filteredKeys.forEach((item) => (result[item] = record[item]));
  return result;
};

export const getTrueKeys = (record: Record<string, boolean>) => {
  const keys = Object.keys(record);
  return keys.filter((key) => record[key]);
};

export const convertTimestampToDate = (timestamp: DocTimestamp) => {
  return new firebase.firestore.Timestamp(
    timestamp.seconds,
    timestamp.nanoseconds
  ).toDate();
};
