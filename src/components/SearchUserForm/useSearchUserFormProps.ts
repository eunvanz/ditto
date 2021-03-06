import { useCallback, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import useProjectByParam from "../../hooks/useProjectByParam";
import FirebaseSelectors from "../../store/Firebase/FirebaseSelectors";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import UiSelectors from "../../store/Ui/UiSelectors";
import { UserProfileDoc, MemberRole } from "../../types";

const useSearchUserFormProps = () => {
  const dispatch = useDispatch();

  const { project } = useProjectByParam();

  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

  const onSearch = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const firestoreQuery = useMemo(() => {
    if (searchValue) {
      return [
        {
          collection: `users`,
          where: [
            ["email", ">=", searchValue],
            ["email", "<=", `${searchValue}~`],
          ],
          storeAs: "searchUserResult",
        },
      ];
    } else {
      return [];
    }
  }, [searchValue]);

  useFirestoreConnect(firestoreQuery as any);

  const resultItems = useSelector(FirebaseSelectors.selectSearchUserResult);

  const onSubmit = useCallback(
    (members: UserProfileDoc[], role: MemberRole) => {
      dispatch(ProjectActions.addMembers({ members, role }));
    },
    [dispatch],
  );

  const { role } = useSelector(UiSelectors.selectSearchUserFormModal);

  const isSubmitting = useSelector(
    ProgressSelectors.createInProgressSelector(ProjectActions.addMembers.type),
  );

  return {
    resultItems: resultItems?.filter((item) => !project?.members[item.uid]),
    onSearch,
    onSubmit,
    isSubmitting,
    role,
    project,
  };
};

export default useSearchUserFormProps;
