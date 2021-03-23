import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import ROUTE from "../paths";
import AuthSelectors from "../store/Auth/AuthSelector";
import { UiActions } from "../store/Ui/UiSlice";

interface UseAuthOptions {
  isUserRequired?: boolean;
  isNoUserRequired?: boolean;
}

const useAuth = (options?: UseAuthOptions) => {
  const user = useSelector(AuthSelectors.selectUser);
  const auth = useSelector(AuthSelectors.selectAuth);

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (auth.isLoaded) {
      return;
    }
    if (options?.isUserRequired && auth.isEmpty) {
      dispatch(UiActions.showSignInModal());
    } else if (options?.isNoUserRequired && !auth.isEmpty) {
      history.push(ROUTE.ROOT);
    }
  }, [auth.isLoaded, auth.isEmpty, options, dispatch, history]);

  return { user, auth };
};

export default useAuth;
