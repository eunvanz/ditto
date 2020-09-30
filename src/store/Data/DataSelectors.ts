import { DATA_KEY } from "./DataSlice";
import { RootState } from "..";

function createDataKeySelector(dataKey: DATA_KEY) {
  return (state: RootState) => state.data[dataKey];
}

const DataSelectors = {
  createDataKeySelector,
};

export default DataSelectors;
