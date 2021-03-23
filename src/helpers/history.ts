import { createBrowserHistory } from "history";

export const BASE_NAME = "";

const history = createBrowserHistory({ basename: BASE_NAME });

history.listen((_, action) => {
  if (action !== "POP") {
    window.scrollTo(0, 0);
  }
});

export default history;
