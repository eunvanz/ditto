import { FirebaseReducer } from "react-redux-firebase";

export enum THEMES {
  LIGHT = "LIGHT",
  DARK = "DARK",
}

export enum REQUEST_METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export interface Recordable {
  createdAt: firebase.firestore.FieldValue;
  updatedAt: firebase.firestore.FieldValue;
  createdBy: string;
  updatedBy: string;
}

export interface DataRecord extends Recordable {
  dataRecordId: string;
  seq: number;
  key: string;
  type: DATA_TYPE;
  customEnumId?: string;
  dataObjectId?: string;
  isRequired: boolean;
}

export interface DataObject extends Recordable {
  dataObjectId: string;
  title?: string; // 없을경우 anonymous
  dataRecord: DataRecord[];
}

export enum DATA_TYPE {
  STRING = "STRING",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  ENUM = "ENUM",
  OBJECT = "OBJECT",
}

export enum QUERY_PARAM_TYPE {
  STRING = "STRING",
  NUMBER = "NUMBER",
  ENUM = "ENUM",
}

export interface QueryParam extends Recordable {
  key: string;
  type: QUERY_PARAM_TYPE;
  customEnumId?: string;
  description?: string;
}

export interface CustomEnumItem extends Recordable {
  customEnumItemId: string;
  title?: string; // 없을경우 anonymous
  key: string;
  value: string;
  description?: string;
}

export interface CustomEnum extends Recordable {
  customEnumId: string;
  customEnumItems: CustomEnumItem[];
}

export interface RequestHeader extends Recordable {
  requestHeaderId: string;
  key: string;
  description?: string;
}

export interface RequestBody extends Recordable {
  requestBodyId: string;
  key: string;
  type: DATA_TYPE;
}

export interface RequestItem extends Recordable {
  requestItemId: string;
  projectItemId: string;
  groupItemId?: string;
  seq: number;
  title: string;
  method: REQUEST_METHOD;
  url?: string;
  queryParams?: QueryParam[];
  headers?: RequestHeader[];
  body?: RequestBody[];
}

export interface User {
  auth: FirebaseReducer.AuthState;
}

export interface ProjectItem extends Recordable {
  title: string;
  description: string;
  members: Record<string, boolean>;
  owners: Record<string, boolean>;
  guests: Record<string, boolean>;
}
