import { DATA_KEY } from "./DataSlice";
import { RootState } from "..";

const createDataKeySelector = (dataKey: DATA_KEY) => (state: RootState) =>
  state.data[dataKey];

const DataSelectors = {
  createDataKeySelector,
};

export default DataSelectors;
