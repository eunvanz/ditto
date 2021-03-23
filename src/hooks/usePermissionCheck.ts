import { useSelector, useDispatch } from "react-redux";
import Alert from "../components/Alert";
import AuthSelectors from "../store/Auth/AuthSelector";
import FirebaseSelectors from "../store/Firebase/FirebaseSelectors";
import { UiActions } from "../store/Ui/UiSlice";

const usePermissionCheck = () => {
  const permissionErrors = useSelector(FirebaseSelectors.selectPermissionErrors);

  const auth = useSelector(AuthSelectors.selectAuth);

  const dispatch = useDispatch();

  if (permissionErrors.length) {
    if (!auth.isEmpty) {
      Alert.message({
        title: "No permission",
        message: "You are required to have permission.",
      });
    } else {
      dispatch(UiActions.showSignInModal());
    }
  }
};

export default usePermissionCheck;
