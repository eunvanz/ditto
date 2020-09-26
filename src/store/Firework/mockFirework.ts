import { realFirework } from ".";

const mockResponse = {
  addDocument: undefined,
  addProject: undefined,
};

const mockFirework = {};

Object.keys(mockResponse).forEach((key) => {
  // @ts-ignore
  mockFirework[key] = () =>
    new Promise((resolve) => {
      return setTimeout(
        () => resolve(mockResponse[key as keyof typeof mockResponse]),
        Number(process.env.REACT_APP_MOCK_TIMEOUT)
      );
    });
});

export default mockFirework as typeof realFirework;
