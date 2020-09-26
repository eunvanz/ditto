import { Firework } from ".";

const mockResponse = {
  addDocument: undefined,
};

const mockFirework = {};

Object.keys(mockResponse).forEach((key) => {
  Object.defineProperty(
    mockFirework,
    key,
    new Promise((resolve) => {
      return setTimeout(
        () => resolve(mockResponse[key as keyof typeof mockResponse]),
        Number(process.env.REACT_APP_MOCK_TIMEOUT)
      );
    })
  );
});

export default mockFirework as typeof Firework;
