import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectDoc, ProjectUrlDoc, ModelDoc } from "../../types";

export enum DATA_KEY {
  PROJECTS = "projects",
  PROJECT = "project",
  PROJECT_URLS = "projectUrls",
  MODEL = "model",
}

export type DataPayload = {
  key: DATA_KEY;
  data: any;
};

export type RecordDataPayload = {
  key: DATA_KEY;
  recordKey: string;
  data: any;
};

export interface DataState {
  [DATA_KEY.PROJECTS]?: ProjectDoc[];
  /**
   * 현재 선택된 프로젝트
   */
  [DATA_KEY.PROJECT]?: ProjectDoc;
  /**
   * project id를 키로 사용하는 Record 형식
   */
  [DATA_KEY.PROJECT_URLS]?: Record<string, ProjectUrlDoc[]>;
  /**
   * 현재 선택된 모델
   */
  [DATA_KEY.MODEL]?: ModelDoc;
}

export const initialDataState: DataState = {};

const DataSlice = createSlice({
  name: "Data",
  initialState: initialDataState,
  reducers: {
    receiveData: (state, action: PayloadAction<DataPayload>) => {
      state[action.payload.key] = action.payload.data;
    },
    receiveRecordData: (state, action: PayloadAction<RecordDataPayload>) => {
      if (!state[action.payload.key]) {
        // @ts-ignore
        state[action.payload.key] = {};
      }
      (state[action.payload.key] as Record<string, any>)[
        action.payload.recordKey
      ] = action.payload.data;
    },
    receiveMultipleData: (state, action: PayloadAction<DataPayload[]>) => {
      const { payload } = action;
      payload.forEach((item: DataPayload) => {
        state[item.key] = item.data;
      });
    },
    clearData: (state, action: PayloadAction<DATA_KEY>) => {
      delete state[action.payload];
    },
  },
});

export const DataActions = DataSlice.actions;

export default DataSlice;
