import { DATA_KEY } from "./DataSlice";
import { RootState } from "..";

function createDataKeySelector(dataKey: DATA_KEY) {
  return (state: RootState) => state.data[dataKey];
}

function createRecordDataKeySelector({
  dataKey,
  recordKey,
}: {
  dataKey: DATA_KEY;
  recordKey: string;
}) {
  return (state: RootState) =>
    (state.data[dataKey] as Record<string, any>)?.[recordKey];
}

const DataSelectors = {
  createDataKeySelector,
  createRecordDataKeySelector,
};

export default DataSelectors;
