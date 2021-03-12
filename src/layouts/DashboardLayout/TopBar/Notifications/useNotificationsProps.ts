import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import FirebaseSelectors from "../../../../store/Firebase/FirebaseSelectors";

const useNotificationsProps = () => {
  const userProfile = useSelector(FirebaseSelectors.selectUserProfile);

  useFirestoreConnect([
    {
      collection: "notifications",
      where: [
        [`members.${userProfile.uid}`, "==", true],
        [`settingsByMember.${userProfile.uid}.isChecked`, "!=", true],
      ],
      orderBy: [
        [`settingsByMember.${userProfile.uid}.isChecked`, "asc"],
        ["createdAt", "asc"],
      ],
    },
  ]);

  const notifications = useSelector(FirebaseSelectors.selectNotifications);

  const onClickMarkAllAsRead = useCallback(() => {
    // TODO
  }, []);

  const onMarkAsRead = useCallback((id: string) => {
    // TODO
  }, []);

  return {
    notifications: notifications || [],
    onClickMarkAllAsRead,
    onMarkAsRead,
  };
};

export default useNotificationsProps;
