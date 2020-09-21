import ProgressSlice from "./ProgressSlice";

describe("ProgressSlice", () => {
  const slice = ProgressSlice;

  describe("reducer", () => {
    const reducer = ProgressSlice.reducer;

    describe("startProgress", () => {
      const action = slice.actions.startProgress;

      it("작업을 배열에 추가한다.", () => {
        const initialState: string[] = [];
        const payload = "test/action";

        const resultState = reducer(initialState, action(payload));

        expect(resultState).toEqual([payload]);
      });
    });

    describe("finishProgress", () => {
      const action = slice.actions.finishProgress;

      it("배열에서 작업을 제거한다.", () => {
        const payload = "test/action";
        const initialState: string[] = [payload, "another/action"];

        const resultState = reducer(initialState, action(payload));

        expect(resultState).toEqual(["another/action"]);
      });
    });
  });
});
