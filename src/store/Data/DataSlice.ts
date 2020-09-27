import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectDoc } from "../../types";

export enum DATA_KEY {
  PROJECTS = "projects",
  PROJECT = "project",
}

export type DataPayload = {
  key: DATA_KEY;
  data: any;
};

export interface DataState {
  [DATA_KEY.PROJECTS]?: ProjectDoc[];
  [DATA_KEY.PROJECT]?: ProjectDoc;
}

export const initialDataState: DataState = {};

const DataSlice = createSlice({
  name: "Data",
  initialState: initialDataState,
  reducers: {
    receiveData: (state, action: PayloadAction<DataPayload>) => {
      state[action.payload.key] = action.payload.data;
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
