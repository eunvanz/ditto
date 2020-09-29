import { createBrowserHistory } from "history";

const history = createBrowserHistory();

history.listen((_, action) => {
  if (action !== "POP") {
    window.scrollTo(0, 0);
  }
});

export default history;
