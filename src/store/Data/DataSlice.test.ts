import DataSlice, { initialDataState, DataState, DATA_KEY } from "./DataSlice";
import mockProject from "../../mocks/mockProject";

describe("DataSlice", () => {
  const slice = DataSlice;

  describe("reducer", () => {
    const reducer = DataSlice.reducer;

    describe("receiveRecordData", () => {
      const action = slice.actions.receiveRecordData;

      it("key가 undefined일 때 정상적으로 작동한다.", () => {
        const initialState: DataState = initialDataState;
        const payload = {
          key: DATA_KEY.MODELS,
          data: "mockData",
          recordKey: "mockRecordKey",
          subRecordKey: "mockSubRecordKey",
        };

        const resultState = reducer(initialState, action(payload));

        expect(resultState).toEqual({
          ...initialState,
          [payload.key]: {
            [payload.recordKey]: {
              [payload.subRecordKey]: payload.data,
            },
          },
        });
      });

      it("이미 데이터가 존재할 때 정상적으로 작동한다.", () => {
        const initialState: DataState = {
          ...initialDataState,
          [DATA_KEY.MODELS]: {
            existingData: { existingData: [mockProject.model] },
          },
        };
        const payload = {
          key: DATA_KEY.MODELS,
          data: "mockData",
          recordKey: "mockRecordKey",
          subRecordKey: "mockSubRecordKey",
        };

        const resultState = reducer(initialState, action(payload));

        expect(resultState).toEqual({
          ...initialState,
          [payload.key]: {
            ...initialState[DATA_KEY.MODELS],
            [payload.recordKey]: {
              [payload.subRecordKey]: payload.data,
            },
          },
        });
      });
    });
  });
});
