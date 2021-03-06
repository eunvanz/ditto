import { fade, Theme } from "@material-ui/core";
import firebase from "firebase/app";
import orderBy from "lodash/orderBy";
import random from "lodash/random";
import {
  DraggableProvidedDraggableProps,
  DraggableStateSnapshot,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import { FieldError } from "react-hook-form";
import shortid from "shortid";
import {
  REQUEST_METHOD,
  MemberRole,
  ProjectDoc,
  UserProfileDoc,
  DocTimestamp,
  REQUEST_PARAM_LOCATION,
  ModelFieldDoc,
  ModelFieldKey,
  THEMES,
  FIELD_TYPE,
  ModelDoc,
  Interface,
  EnumerationDoc,
  InterfaceField,
  FORMAT,
  Orderable,
  CommonModelFieldItem,
  ModelCellDoc,
  ModelFieldDocLike,
} from "../types";
import { assertNotEmpty } from "./commonHelpers";

export const patterns = {
  wordsWithNoSpace: {
    value: /^[\w-/]+\S$/,
    message: "Try a mix of letters or numbers more than 2 characters with no spaces.",
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

export const checkHasAuthorization = (role: MemberRole, targetRole: MemberRole) => {
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

export const removeKeyFromRecord = (record: Record<string, any>, key: string) => {
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
    timestamp.nanoseconds,
  ).toDate();
};

export const getRequestParamLocationName = (location: REQUEST_PARAM_LOCATION) => {
  switch (location) {
    case REQUEST_PARAM_LOCATION.COOKIE:
      return "cookie";
    case REQUEST_PARAM_LOCATION.HEADER:
      return "header";
    case REQUEST_PARAM_LOCATION.PATH:
      return "path param";
    case REQUEST_PARAM_LOCATION.QUERY:
      return "query param";
  }
};

export const checkIsNewerTimestamp = (target: DocTimestamp, compare: DocTimestamp) => {
  if (target.seconds < compare.seconds) {
    return false;
  } else if (target.seconds === compare.seconds) {
    if (target.nanoseconds < compare.nanoseconds) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
};

export const MODEL_FIELD_KEYS: ModelFieldKey[] = [
  "fieldName",
  "isRequired",
  "isArray",
  "fieldType",
  "format",
  "enum",
  "description",
];

export const checkHasUpdatedFieldKey = (modelField: ModelFieldDoc, uid: string) => {
  return MODEL_FIELD_KEYS.some(
    (key) => modelField[key].value !== modelField[key].settingsByMember?.[uid]?.value,
  );
};

export const checkHasUpdatedFields = (modelFields: ModelFieldDoc[], uid: string) => {
  return modelFields.some((modelField) => checkHasUpdatedFieldKey(modelField, uid));
};

export const commonStyles = {
  updatedFieldCell: {
    backgroundColor: "rgba(255,0,0,0.1)",
  },
};

export const getEditorTheme = (theme: THEMES) => {
  return theme === THEMES.LIGHT ? "chrome" : "nord_dark";
};

export const getTypescriptFieldType = (
  fieldType: FIELD_TYPE,
  format: string,
  projectModels: ModelDoc[],
) => {
  switch (fieldType) {
    case FIELD_TYPE.BOOLEAN:
      return "boolean";
    case FIELD_TYPE.INTEGER:
    case FIELD_TYPE.NUMBER:
      return "number";
    case FIELD_TYPE.STRING:
      return "string";
    case FIELD_TYPE.OBJECT:
      return projectModels.find((model) => model.id === format)?.name;
  }
};

export const convertInterfacesToCode = (
  interfaces: Interface[],
  enumerations: EnumerationDoc[],
) => {
  let result = "";
  const enumerationsToDefine: string[] = [];
  interfaces.forEach((item) => {
    if (item.description) {
      result = `${result}\n/**\n * ${item.description}\n */`;
    } else {
      result = `${result}\n`;
    }
    result = `${result}export interface ${item.name} {\n`;
    item.fields.forEach((field) => {
      if (field.description || field.examples) {
        if (field.description) {
          result = `${result}  /** ${field.description} */\n`;
        }
        if (field.examples?.length) {
          result = `${result}  /** @examples: ${field.examples.join(", ")} */\n`;
        }
      }
      result = `${result}  ${field.name}${field.isRequired ? "" : "?"}: ${field.type}${
        field.isArray ? "[];" : ";"
      }\n`;
      if (field.hasEnumeration) {
        const isAlreadyDefined = enumerationsToDefine.some((item) => item === field.type);
        !isAlreadyDefined && enumerationsToDefine.push(field.type);
      }
    });
    result = `${result}}\n`;
  });

  enumerationsToDefine.forEach((item) => {
    const targetEnumeration = enumerations.find(
      (enumeration) => enumeration.name === item,
    );
    if (targetEnumeration) {
      if (targetEnumeration.fieldType === FIELD_TYPE.STRING) {
        result = `${result}\nexport enum ${targetEnumeration.name} {\n`;
        targetEnumeration.items.forEach((item: string | number) => {
          result = `${result}  ${item
            .toString()
            .toUpperCase()
            .replace(/[0-9()@:%+.~#?&//={}]/g, "")} = "${item}",\n`;
        });
        result = `${result}}\n`;
      } else {
        result = `${result}\nexport type ${
          targetEnumeration.name
        } = ${targetEnumeration.items.join(" | ")}\n`;
      }
    }
  });

  return result;
};

export const getMockString = (wordCnt: number = 2) => {
  const loremIpsum =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ipsum suspendisse ultrices gravida dictum fusce ut placerat orci nulla. Sit amet mauris commodo quis. Feugiat in ante metus dictum. Neque aliquam vestibulum morbi blandit cursus risus at. Sit amet luctus venenatis lectus. Adipiscing vitae proin sagittis nisl. Quis enim lobortis scelerisque fermentum dui faucibus in ornare quam. Egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Nunc mattis enim ut tellus elementum. Pharetra convallis posuere morbi leo urna molestie at elementum. Donec ac odio tempor orci dapibus ultrices in iaculis. Quis lectus nulla at volutpat. Sed viverra ipsum nunc aliquet bibendum enim facilisis gravida. Dolor sed viverra ipsum nunc aliquet. Pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus. Integer feugiat scelerisque varius morbi enim nunc faucibus a. Nam libero justo laoreet sit amet. Ut tortor pretium viverra suspendisse potenti nullam ac. Ut venenatis tellus in metus";
  const splitLoremIpsum = loremIpsum.split(" ");
  const startIndex = random(0, splitLoremIpsum.length - wordCnt - 1);
  return splitLoremIpsum.slice(startIndex, startIndex + wordCnt).join(" ");
};

export const getMockDate = () => {
  return `${random(2000, 2021)}-${String(random(1, 12)).padStart(2, "0")}-${String(
    random(1, 30),
  ).padStart(2, "0")}`;
};

export const getMockTime = () => {
  return `${String(random(0, 23)).padStart(2, "0")}:${String(random(0, 59)).padStart(
    2,
    "0",
  )}:${String(random(0, 59)).padStart(2, "0")}`;
};

export const generateInterfaceFieldData = (
  field: InterfaceField,
  enumerations: EnumerationDoc[],
) => {
  const { type, hasEnumeration, format, examples, name } = field;
  if (hasEnumeration) {
    const enumeration = enumerations.find((item) => item.name === type);
    return enumeration?.items?.[random(0, enumeration.items.length - 1)];
  } else if (examples?.length) {
    return examples[random(0, examples.length - 1)];
  } else if (type === "string") {
    if (format === FORMAT.NONE) {
      switch (true) {
        case name.toUpperCase().includes("IMAGEURL"):
        case name.toUpperCase().includes("IMGURL"):
        case name.toUpperCase().includes("PHOTOURL"):
          return "https://via.placeholder.com/150";
        case name.toUpperCase().includes("URL"):
        case name.toUpperCase().includes("LINK"):
          return "https://diit.to";
        case name.toUpperCase().includes("PHONE"):
          return `0${random(2, 99)}-${random(100, 9999)}-${random(1000, 9999)}`;
        case name.toUpperCase().includes("MOBILE"):
          return `010-${random(1000, 9999)}-${random(1000, 9999)}`;
        case name.endsWith("Id"):
        case name.toUpperCase().endsWith("UUID"):
          return shortid.generate();
      }
      return getMockString();
    } else if (format === FORMAT.PASSWORD) {
      return shortid.generate();
    } else if (format === FORMAT.BINARY) {
      return "mockBinaryString";
    } else if (format === FORMAT.BYTE) {
      return "mockByteString";
    } else if (format === FORMAT.DATE) {
      return getMockDate();
    } else if (format === FORMAT.DATE_TIME) {
      return `${getMockDate()} ${getMockTime()}`;
    }
  } else if (type === "boolean") {
    return [false, true][random(0, 1)];
  } else if (type === "number") {
    return random(0, 999999);
  }
};

export const convertInterfaceToMockData = ({
  targetInterface,
  interfaces,
  enumerations,
}: {
  targetInterface: Interface;
  interfaces: Interface[];
  enumerations: EnumerationDoc[];
}) => {
  const result: any = {};
  targetInterface.fields.forEach((field) => {
    const { isArray, isRequired, type, name, hasEnumeration } = field;
    let hasToSetData = true;
    if (!isRequired) {
      const decision = random(0, 10);
      if (decision < 4) {
        hasToSetData = false;
      }
    }
    if (!hasToSetData) {
      return;
    }
    if (["boolean", "number", "string"].includes(type) || hasEnumeration) {
      if (isArray) {
        const length = random(1, 3);
        result[name] = Array.from({ length }).map(() =>
          generateInterfaceFieldData(field, enumerations),
        );
      } else {
        result[name] = generateInterfaceFieldData(field, enumerations);
      }
    } else {
      const subInterface = interfaces.find((item) => item.name === type);
      if (!subInterface) {
        return;
      }
      if (isArray) {
        const length = random(1, 3);
        result[name] = Array.from({ length }).map(() =>
          convertInterfaceToMockData({
            targetInterface: subInterface,
            interfaces,
            enumerations,
          }),
        );
      } else {
        result[name] = convertInterfaceToMockData({
          targetInterface: subInterface,
          interfaces,
          enumerations,
        });
      }
    }
  });
  return result;
};

export const getDroppableStyles = (snapshot: DroppableStateSnapshot, theme: Theme) => {
  if (snapshot.isDraggingOver) {
    return { backgroundColor: fade(theme.palette.primary.main, 0.2) };
  }
  return undefined;
};

export const getDraggableStyles = ({
  snapshot,
  draggableProps,
  theme,
}: {
  snapshot?: DraggableStateSnapshot;
  draggableProps?: DraggableProvidedDraggableProps;
  theme: Theme;
}) => {
  if (snapshot?.isDragging) {
    return {
      ...draggableProps?.style,
      backgroundColor: fade(theme.palette.background.paper, 0.8),
    };
  }
  return draggableProps?.style;
};

export const getOrderedProjects = (project: ProjectDoc[], uid: string) => {
  const firstItem = project?.find((item) => item.settingsByMember[uid]?.isFirstItem);
  if (firstItem) {
    const result = [firstItem];
    while (true) {
      const nextItemId = result[result.length - 1].settingsByMember[uid].nextItemId;
      if (nextItemId) {
        const nextItem = project.find((item) => item.id === nextItemId);
        assertNotEmpty(nextItem);
        if (result.find((item) => item.id === nextItem!.id)) {
          break;
        } else {
          result.push(nextItem);
        }
      } else {
        break;
      }
    }
    return result;
  } else {
    return orderBy(project, [`settingsByMember.${uid}.seq`], ["asc"]);
  }
};

export const getOrderedItems = <T extends Orderable>(orderableItems: T[]) => {
  const firstItem = orderableItems.find((item) => item.isFirstItem);
  if (firstItem) {
    const result = [firstItem];
    while (true) {
      const nextItemId = result[result.length - 1].nextItemId;
      if (nextItemId) {
        const nextItem = orderableItems.find((item) => item.id === nextItemId);
        assertNotEmpty(nextItem);
        if (result.find((item) => item.id === nextItem!.id)) {
          break;
        } else {
          result.push(nextItem);
        }
      } else {
        break;
      }
    }
    return result;
  } else {
    return orderableItems;
  }
};

export const convertModelFieldItemToModelFieldDoc = ({
  fieldName,
  isRequired,
  isArray,
  fieldType,
  format,
  enum: enumeration,
  description,
  projectId,
  ...rest
}: CommonModelFieldItem) => {
  const tempId = "tempId";
  const tempUuid = "tempUuid";
  const tempTimestamp = {
    seconds: 0,
    nanoseconds: 0,
  };
  // @ts-ignore
  const createField: <T>(value: T) => ModelCellDoc<T> = (value) => {
    return {
      id: tempId,
      value,
      createdBy: tempUuid,
      updatedBy: tempUuid,
      createdAt: tempTimestamp,
      updatedAt: tempTimestamp,
      settingsByMember: {
        [Object.keys(fieldName.settingsByMember)[0]]: {
          updatedAt: tempTimestamp,
          value,
        },
      },
    };
  };
  // @ts-ignore
  const result: ModelFieldDocLike = {
    id: tempId,
    fieldName: createField(fieldName.value),
    isRequired: createField(isRequired.value),
    isArray: createField(isArray.value),
    fieldType: createField(fieldType.value as FIELD_TYPE),
    format: createField(format.value),
    enum: createField(enumeration.value),
    description: createField(description.value),
    projectId: projectId,
    ...rest,
  };
  return result;
};
