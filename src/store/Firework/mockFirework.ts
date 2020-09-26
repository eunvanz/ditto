import { realFirework } from ".";

enum MOCK_TYPE {
  PROMISE = "PROMISE",
  REF = "REF",
}

const mockResponse = {
  addDocument: {
    type: MOCK_TYPE.PROMISE,
    data: undefined,
  },
  addProject: {
    type: MOCK_TYPE.PROMISE,
    data: undefined,
  },
  updateDocument: {
    type: MOCK_TYPE.PROMISE,
    data: undefined,
  },
  updateProject: {
    type: MOCK_TYPE.PROMISE,
    data: undefined,
  },
};

const mockFirework = {};

Object.keys(mockResponse).forEach((key) => {
  // @ts-ignore
  mockFirework[key] = () =>
    new Promise((resolve) => {
      return setTimeout(
        () => resolve(mockResponse[key as keyof typeof mockResponse].data),
        Number(process.env.REACT_APP_MOCK_TIMEOUT)
      );
    });
});

export default mockFirework as typeof realFirework;
