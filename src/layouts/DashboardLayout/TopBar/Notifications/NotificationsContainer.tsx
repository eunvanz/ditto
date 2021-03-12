import React from "react";
import Notifications from "./Notifications";
import useNotificationsProps from "./useNotificationsProps";

const NotificationsContainer = () => {
  const props = useNotificationsProps();
  return <Notifications {...props} />;
};

export default NotificationsContainer;
