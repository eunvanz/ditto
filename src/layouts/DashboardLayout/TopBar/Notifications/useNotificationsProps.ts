import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import FirebaseSelectors from "../../../../store/Firebase/FirebaseSelectors";
import { ProjectActions } from "../../../../store/Project/ProjectSlice";

const useNotificationsProps = () => {
  const userProfile = useSelector(FirebaseSelectors.selectUserProfile);

  useFirestoreConnect([
    {
      collection: `users/${userProfile.uid}/notifications`,
      where: [["isRead", "==", false]],
      orderBy: [["createdAt", "desc"]],
      storeAs: "notifications",
    },
  ]);

  const notifications = useSelector(FirebaseSelectors.selectNotifications);

  const dispatch = useDispatch();

  const onClickMarkAllAsRead = useCallback(() => {
    if (notifications) {
      dispatch(
        ProjectActions.markNotificationsAsRead(
          notifications.map((notification) => notification.id),
        ),
      );
    }
  }, [dispatch, notifications]);

  const onMarkAsRead = useCallback(
    (id: string) => {
      dispatch(ProjectActions.markNotificationsAsRead([id]));
    },
    [dispatch],
  );

  return {
    notifications: notifications || [],
    onClickMarkAllAsRead,
    onMarkAsRead,
  };
};

export default useNotificationsProps;
