import { useSelector, useDispatch } from "react-redux";
import FirebaseSelectors from "../store/Firebase/FirebaseSelectors";
import Alert from "../components/Alert";
import { UiActions } from "../store/Ui/UiSlice";
import AuthSelectors from "../store/Auth/AuthSelector";

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
